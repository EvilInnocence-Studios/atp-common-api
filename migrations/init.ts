import { database } from "../../core/database";
import { IMigration } from "../../core/database.d";

const db = database();

export const init:IMigration = {
    down: () => {
        return db.schema
            .dropTableIfExists("tag")
            .dropTableIfExists("tagGroup");
    },
    up: () => {
        return db.schema
            .createTable("tagGroup", (table) => {
                table.increments("id").primary();
                table.string("name").notNullable();
            })
            .createTable("tag", (table) => {
                table.increments("id").primary();
                table.string("name").notNullable();
                table.integer("groupId").notNullable();
                table.foreign("groupId").references("tagGroup.id");
            });
    }
}