import { CronExpressionParser } from "cron-parser";
import { database } from "../../core/database";
import {
    IScheduledTask,
    IScheduledTaskRunResult,
    IScheduledTasksBatchResult
} from "../../common-shared/scheduledTask/types";
import { ScheduledTaskRegistry } from "./registry";

const db = database();

export const syncTasksWithDatabase = async (): Promise<void> => {
    const registered = ScheduledTaskRegistry.getAll();
    if (registered.length === 0) return;

    try {
        const existingTasks: IScheduledTask[] = await db("scheduledTasks").select("*");
        const existingMap = new Map<string, IScheduledTask>(
            existingTasks.map(t => [t.id, t])
        );

        for (const def of registered) {
            const existing = existingMap.get(def.id);
            if (!existing) {
                const sched = def.defaultSchedule;
                const isInterval = sched.type === "interval";
                const intervalMinutes = isInterval ? sched.intervalMinutes : 60;
                const cronExpression = !isInterval ? sched.cronExpression : null;
                const timezone = !isInterval && sched.timezone ? sched.timezone : "UTC";

                await db("scheduledTasks").insert({
                    id: def.id,
                    name: def.name,
                    module: def.module,
                    description: def.description || null,
                    enabled: def.defaultEnabled !== undefined ? def.defaultEnabled : true,
                    scheduleType: sched.type,
                    intervalMinutes,
                    cronExpression,
                    timezone,
                    lastStatus: "idle",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            } else {
                // Update code metadata if changed, preserving user-configured schedules and toggles
                if (
                    existing.name !== def.name ||
                    existing.module !== def.module ||
                    existing.description !== (def.description || null)
                ) {
                    await db("scheduledTasks").where({ id: def.id }).update({
                        name: def.name,
                        module: def.module,
                        description: def.description || null,
                        updatedAt: new Date()
                    });
                }
            }
        }
    } catch (err: any) {
        console.error("[ScheduledTasks] Failed to sync tasks with database:", err.message);
    }
};

export const isTaskDue = (task: IScheduledTask, now: Date): boolean => {
    if (!task.enabled) return false;

    // Check if task is locked by an active unexpired execution
    if (task.lockedUntil && new Date(task.lockedUntil).getTime() > now.getTime()) {
        return false;
    }

    if (task.scheduleType === "interval") {
        if (!task.lastRunAt) return true;
        const intervalMs = (task.intervalMinutes || 60) * 60 * 1000;
        return now.getTime() - new Date(task.lastRunAt).getTime() >= intervalMs;
    }

    if (task.scheduleType === "cron" && task.cronExpression) {
        try {
            const interval = CronExpressionParser.parse(task.cronExpression, {
                currentDate: now,
                tz: task.timezone || "UTC"
            });
            const prevRunDate = interval.prev().toDate();
            if (!task.lastRunAt) return true;
            return new Date(task.lastRunAt).getTime() < prevRunDate.getTime();
        } catch (err: any) {
            console.error(`[ScheduledTasks] Invalid cron expression for task ${task.id}:`, err.message);
            return false;
        }
    }

    return false;
};

export const getNextRunDate = (task: IScheduledTask, now: Date = new Date()): Date | null => {
    if (task.scheduleType === "interval") {
        const intervalMs = (task.intervalMinutes || 60) * 60 * 1000;
        if (!task.lastRunAt) return now;
        const next = new Date(task.lastRunAt).getTime() + intervalMs;
        return new Date(Math.max(next, now.getTime()));
    }

    if (task.scheduleType === "cron" && task.cronExpression) {
        try {
            const interval = CronExpressionParser.parse(task.cronExpression, {
                currentDate: now,
                tz: task.timezone || "UTC"
            });
            return interval.next().toDate();
        } catch {
            return null;
        }
    }

    return null;
};

export const executeTask = async (
    taskId: string,
    trigger: "eventbridge" | "manual" = "manual"
): Promise<IScheduledTaskRunResult> => {
    const taskRecord: IScheduledTask | undefined = await db("scheduledTasks").where({ id: taskId }).first();
    if (!taskRecord) {
        throw new Error(`Scheduled task with id "${taskId}" not found in database`);
    }

    const def = ScheduledTaskRegistry.get(taskId);
    if (!def) {
        const errorMsg = `No task handler registered in code for id "${taskId}"`;
        await db("scheduledTasks").where({ id: taskId }).update({
            lastStatus: "failure",
            lastError: errorMsg,
            lockedUntil: null,
            updatedAt: new Date()
        });
        return {
            taskId,
            status: "failure",
            durationMs: 0,
            error: errorMsg
        };
    }

    const timeoutSeconds = def.timeoutSeconds || 300;
    const lockExpiry = new Date(Date.now() + timeoutSeconds * 1000);

    // Acquire lock and update status to running
    await db("scheduledTasks").where({ id: taskId }).update({
        lastStatus: "running",
        lockedUntil: lockExpiry,
        updatedAt: new Date()
    });

    const startTime = Date.now();
    let status: "success" | "failure" = "success";
    let message: string | null = null;
    let error: string | null = null;

    try {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Scheduled task timed out after ${timeoutSeconds}s`)), timeoutSeconds * 1000)
        );

        const executionPromise = def.run({
            taskId,
            trigger,
            scheduledTime: new Date(startTime)
        });

        const result: any = await Promise.race([executionPromise, timeoutPromise]);
        message = result?.message || "Task completed successfully";
    } catch (err: any) {
        status = "failure";
        error = err?.stack || err?.message || String(err);
        console.error(`[ScheduledTasks] Error executing task "${taskId}":`, error);
    }

    const finishedTime = Date.now();
    const durationMs = finishedTime - startTime;

    // Update task status and release lock
    await db("scheduledTasks").where({ id: taskId }).update({
        lastRunAt: new Date(startTime),
        lastDurationMs: durationMs,
        lastStatus: status,
        lastError: error,
        lockedUntil: null,
        updatedAt: new Date()
    });

    // Save run log
    try {
        await db("scheduledTaskLogs").insert({
            taskId,
            startedAt: new Date(startTime),
            finishedAt: new Date(finishedTime),
            durationMs,
            status,
            message,
            error,
            triggeredBy: trigger
        });
    } catch (logErr: any) {
        console.error("[ScheduledTasks] Failed to write run log:", logErr.message);
    }

    return {
        taskId,
        status,
        durationMs,
        message: message || undefined,
        error: error || undefined
    };
};

export const executeDueTasks = async (options: {
    forceAll?: boolean;
    trigger?: "eventbridge" | "manual";
} = {}): Promise<IScheduledTasksBatchResult> => {
    await syncTasksWithDatabase();

    const now = new Date();
    const allTasks: IScheduledTask[] = await db("scheduledTasks").select("*");
    const results: IScheduledTaskRunResult[] = [];
    let executedCount = 0;
    let skippedCount = 0;

    for (const task of allTasks) {
        const shouldRun = options.forceAll ? task.enabled : isTaskDue(task, now);

        if (shouldRun) {
            try {
                const res = await executeTask(task.id, options.trigger || "eventbridge");
                results.push(res);
                executedCount++;
            } catch (err: any) {
                results.push({
                    taskId: task.id,
                    status: "failure",
                    durationMs: 0,
                    error: err.message
                });
                executedCount++;
            }
        } else {
            skippedCount++;
        }
    }

    return {
        timestamp: now.toISOString(),
        evaluated: allTasks.length,
        executed: executedCount,
        skipped: skippedCount,
        results
    };
};
