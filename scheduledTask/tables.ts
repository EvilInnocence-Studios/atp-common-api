import { Knex } from "knex";

export const scheduledTasksTable = (table: Knex.TableBuilder) => {
    table.string("id", 255).primary();
    table.string("name", 255).notNullable();
    table.string("module", 100).notNullable();
    table.text("description").nullable();
    table.boolean("enabled").notNullable().defaultTo(true);
    table.string("scheduleType", 20).notNullable().defaultTo("interval");
    table.integer("intervalMinutes").nullable().defaultTo(60);
    table.string("cronExpression", 100).nullable();
    table.string("timezone", 100).notNullable().defaultTo("UTC");
    table.timestamp("lastRunAt", { useTz: true }).nullable();
    table.integer("lastDurationMs").nullable();
    table.string("lastStatus", 50).notNullable().defaultTo("idle");
    table.text("lastError").nullable();
    table.timestamp("lockedUntil", { useTz: true }).nullable();
    table.timestamp("createdAt", { useTz: true }).nullable();
    table.timestamp("updatedAt", { useTz: true }).nullable();
};

export const scheduledTaskLogsTable = (table: Knex.TableBuilder) => {
    table.bigIncrements("id");
    table.string("taskId", 255).notNullable().references("scheduledTasks.id").onDelete("CASCADE");
    table.timestamp("startedAt", { useTz: true }).notNullable();
    table.timestamp("finishedAt", { useTz: true }).notNullable();
    table.integer("durationMs").notNullable();
    table.string("status", 50).notNullable();
    table.text("message").nullable();
    table.text("error").nullable();
    table.string("triggeredBy", 50).notNullable().defaultTo("eventbridge");
};
