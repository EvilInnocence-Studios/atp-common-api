import { IScheduledTaskDefinition } from "../../common-shared/scheduledTask/types";

class TaskRegistry {
    private tasks: Map<string, IScheduledTaskDefinition> = new Map();

    register(task: IScheduledTaskDefinition): void {
        if (!task.id) {
            throw new Error("Task id is required when registering a scheduled task");
        }
        if (this.tasks.has(task.id)) {
            console.warn(`[ScheduledTaskRegistry] Overwriting existing registered task: ${task.id}`);
        }
        this.tasks.set(task.id, task);
    }

    get(id: string): IScheduledTaskDefinition | undefined {
        return this.tasks.get(id);
    }

    getAll(): IScheduledTaskDefinition[] {
        return Array.from(this.tasks.values());
    }

    has(id: string): boolean {
        return this.tasks.has(id);
    }
}

export const ScheduledTaskRegistry = new TaskRegistry();
