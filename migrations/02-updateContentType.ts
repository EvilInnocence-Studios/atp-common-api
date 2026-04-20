import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";

const db = database();

export const updateContentType: IMigration = {
    name: "updateContentType",
    module: "common",
    description: "Update content type enum from snippet to post",
    order: 5,
    version: "1.2.0",
    up: async () => {
        // Drop the constraint if it exists to avoid violations during data update
        // We drop multiple common names to handle different DB dialects (Postgres/CockroachDB)
        await db.raw('ALTER TABLE "content" DROP CONSTRAINT IF EXISTS content_type_check');
        await db.raw('ALTER TABLE "content" DROP CONSTRAINT IF EXISTS check_type');

        // Update data first: snippet -> post
        await db("content").where("type", "snippet").update({ type: "post" });

        // Re-add the constraint manually with a consistent name
        await db.raw('ALTER TABLE "content" ADD CONSTRAINT content_type_check CHECK (type IN (\'page\', \'post\'))');
    },
    down: async () => {
        // Drop the constraint if it exists to avoid violations during data update
        await db.raw('ALTER TABLE "content" DROP CONSTRAINT IF EXISTS content_type_check');
        await db.raw('ALTER TABLE "content" DROP CONSTRAINT IF EXISTS check_type');

        // Rollback data: post -> snippet
        await db("content").where("type", "post").update({ type: "snippet" });

        // Rollback the table constraint
        await db.raw('ALTER TABLE "content" ADD CONSTRAINT content_type_check CHECK (type IN (\'page\', \'snippet\'))');
    },
    initData: async () => {}
};
