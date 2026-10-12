import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";
import { insertPermissions, insertRolePermissions } from "../../uac/migrations/util";
import { scheduledTaskLogsTable, scheduledTasksTable } from "../scheduledTask/tables";

const db = database();

const permissions = [
    { name: "scheduledTask.view", description: "Can view scheduled tasks" },
    { name: "scheduledTask.update", description: "Can configure scheduled tasks" },
    { name: "scheduledTask.run", description: "Can run scheduled tasks" },
];

const rolePermissions = [
    ...permissions.map(p => ({ roleName: "SuperUser", permissionName: p.name })),
];

export const addScheduledTasks: IMigration = {
    name: "addScheduledTasks",
    module: "common",
    description: "Add scheduledTasks and scheduledTaskLogs tables for task scheduling and monitoring",
    version: "1.3.0",
    order: 10,
    up: async () => {
        const hasTasks = await db.schema.hasTable("scheduledTasks");
        if (!hasTasks) {
            await db.schema.createTable("scheduledTasks", scheduledTasksTable);
        }
        const hasLogs = await db.schema.hasTable("scheduledTaskLogs");
        if (!hasLogs) {
            await db.schema.createTable("scheduledTaskLogs", scheduledTaskLogsTable);
        }
        try {
            await insertPermissions(db, permissions);
            await insertRolePermissions(db, rolePermissions);
        } catch (e: any) {
            console.warn("Could not insert scheduled task permissions (UAC may not be initialized yet):", e.message);
        }
    },
    down: async () => {
        await db.schema.dropTableIfExists("scheduledTaskLogs");
        await db.schema.dropTableIfExists("scheduledTasks");
    },
    initData: async () => {}
};
