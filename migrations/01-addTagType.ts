import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";

const db = database();

export const addTagType: IMigration = {
    name: "addTagType",
    module: "common",
    description: "Add the type column to the tagGroup table",
    order: 4,
    version: "1.1.0",
    up: async () => {
        const hasColumn = await db.schema.hasColumn("tagGroups", "type");
        if (!hasColumn) {
            return db.schema.alterTable("tagGroups", (table) => {
                table.string("type").nullable();
            });
        }
    },
    down: async () => {
        const hasColumn = await db.schema.hasColumn("tagGroups", "type");
        if (hasColumn) {
            return db.schema.alterTable("tagGroups", (table) => {
                table.dropColumn("type");
            });
        }
    },
    initData: async () => {}
};
