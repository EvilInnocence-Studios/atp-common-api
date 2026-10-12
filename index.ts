import { FieldRegistry } from "../core/express/util";
import { init, initSettings } from "../common/migrations/00-init";
import { addTagType } from "../common/migrations/01-addTagType";
import { updateContentType } from "../common/migrations/02-updateContentType";
import { addScheduledTasks } from "../common/migrations/03-addScheduledTasks";

export { apiConfig } from "./endpoints";
export { CacheService } from "./cache/service";
export { ScheduledTaskRegistry, ScheduledTaskService, executeDueTasks, executeTask } from "./scheduledTask";

export const migrations = [init, addTagType, updateContentType, addScheduledTasks];
export const setupMigrations = [init, initSettings, addScheduledTasks];

import { ScheduledTaskRegistry } from "./scheduledTask";
import { database } from "../core/database";

ScheduledTaskRegistry.register({
    id: "common:cleanup-stale-locks",
    name: "Cleanup Stale Task Locks",
    module: "common",
    description: "Cleans up any expired database execution locks left behind by interrupted or timed out processes.",
    defaultSchedule: {
        type: "interval",
        intervalMinutes: 15
    },
    run: async () => {
        const db = database();
        const count = await db("scheduledTasks")
            .where("lockedUntil", "<", new Date())
            .update({ lockedUntil: null, lastStatus: "idle" });
        return { message: `Cleared ${count} stale task locks.` };
    }
});

ScheduledTaskRegistry.register({
    id: "common:daily-health-check",
    name: "Daily System Health Check",
    module: "common",
    description: "Performs a daily database connectivity and system status verification at midnight.",
    defaultSchedule: {
        type: "cron",
        cronExpression: "0 0 * * *",
        timezone: "UTC"
    },
    run: async () => {
        const db = database();
        await db.raw("SELECT 1");
        return { message: "Daily system health check completed successfully." };
    }
});

FieldRegistry.register("settings", {
    create: ["key", "value"],
    update: ["key", "value"]
});
FieldRegistry.register("tagGroups", {
    create: ["name", "filterable", "visible", "order", "type"],
    update: ["name", "filterable", "visible", "order", "type"]
});
FieldRegistry.register("tags", {
    create: ["name", "groupId", "filterable", "order"],
    update: ["name", "filterable", "order"]
});
FieldRegistry.register("synonyms", {
    create: ["canonical", "synonym"],
    update: ["canonical", "synonym"]
});
FieldRegistry.register("banners", {
    create: ["tag", "name", "title", "description", "url", "link", "activeFrom", "activeTo", "order", "buttonText", "buttonLink", "buttonLocation", "buttonTextAlt", "buttonLinkAlt", "buttonLocationAlt"],
    update: ["tag", "name", "title", "description", "url", "link", "activeFrom", "activeTo", "order", "buttonText", "buttonLink", "buttonLocation", "buttonTextAlt", "buttonLinkAlt", "buttonLocationAlt"]
});
FieldRegistry.register("linkLists", {
    create: ["name", "key"],
    update: ["name", "key"]
});
FieldRegistry.register("links", {
    create: ["listId", "text", "url", "subMenuKey", "order"],
    update: ["text", "url", "subMenuKey", "order"]
});
FieldRegistry.register("content", {
    create: ["slug", "title", "type", "content", "layout", "format", "enabled", "publishDate"],
    update: ["slug", "title", "type", "content", "layout", "format", "enabled", "publishDate"]
});
FieldRegistry.register("media", {
    create: ["url", "altText", "title", "caption"],
    update: ["url", "altText", "title", "caption"]
});
FieldRegistry.register("plugins", {
    create: ["group", "key", "sortOrder", "settings"],
    update: ["group", "key", "sortOrder", "settings"]
});
