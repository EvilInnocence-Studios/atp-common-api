import { database } from "../../core/database";
import {
    IScheduledTask,
    IScheduledTaskLog,
    IScheduledTaskUpdate
} from "../../common-shared/scheduledTask/types";
import { getNextRunDate, syncTasksWithDatabase } from "./runner";

const db = database();

export const ScheduledTaskService = {
    search: async (): Promise<IScheduledTask[]> => {
        await syncTasksWithDatabase();
        const tasks: IScheduledTask[] = await db("scheduledTasks")
            .select("*")
            .orderBy("name", "asc");

        const now = new Date();
        return tasks.map(task => {
            const nextRun = getNextRunDate(task, now);
            return {
                ...task,
                nextRunAt: nextRun ? nextRun.toISOString() : null
            };
        });
    },

    loadById: async (id: string): Promise<IScheduledTask | null> => {
        const task: IScheduledTask | undefined = await db("scheduledTasks")
            .select("*")
            .where({ id })
            .first();

        if (!task) return null;
        const nextRun = getNextRunDate(task, new Date());
        return {
            ...task,
            nextRunAt: nextRun ? nextRun.toISOString() : null
        };
    },

    update: async (id: string, updateData: IScheduledTaskUpdate): Promise<IScheduledTask> => {
        const fieldsToUpdate: any = {
            updatedAt: new Date()
        };

        if (updateData.enabled !== undefined) {
            fieldsToUpdate.enabled = Boolean(updateData.enabled);
        }
        if (updateData.scheduleType !== undefined) {
            fieldsToUpdate.scheduleType = updateData.scheduleType;
        }
        if (updateData.intervalMinutes !== undefined) {
            fieldsToUpdate.intervalMinutes = updateData.intervalMinutes !== null ? Number(updateData.intervalMinutes) : null;
        }
        if (updateData.cronExpression !== undefined) {
            fieldsToUpdate.cronExpression = updateData.cronExpression;
        }
        if (updateData.timezone !== undefined) {
            fieldsToUpdate.timezone = updateData.timezone;
        }

        await db("scheduledTasks").where({ id }).update(fieldsToUpdate);
        const updated = await ScheduledTaskService.loadById(id);
        if (!updated) {
            throw new Error(`Scheduled task ${id} not found after update`);
        }
        return updated;
    },

    getLogs: async (taskId: string, limit = 50, offset = 0): Promise<IScheduledTaskLog[]> => {
        return db("scheduledTaskLogs")
            .select("*")
            .where({ taskId })
            .orderBy("startedAt", "desc")
            .limit(limit)
            .offset(offset);
    }
};
