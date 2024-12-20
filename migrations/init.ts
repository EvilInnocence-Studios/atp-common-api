import { Index } from "ts-functional/dist/types";
import { database } from "../../core/database";
import { IMigration } from "../../core/database.d";

const db = database();

const tagGroups:Index<string[]> = {
    "Figures": ["Vicky 4",   "Vicky 3",   "Michael 4",  "Michael 3", "Aiko 4",    "Aiko 3", "Hiro 4", "Hiro 3", "Stephanie 4", "Stephanie 3"],
    "Types"  : ["Dress",     "Shirt",     "Pants",      "Shoes",     "Accessory", "Hair",   "Prop",   "Poses",  "Materials",   "Character", "Morphs", "Utilities", "Sets"],
    "Genres" : ["Fantasy",   "Sci-Fi",    "Historical", "Modern",    "Horror"],
    "Themes" : ["Christmas", "Halloween", "Valentines"],
};

export const init:IMigration = {
    down: () => {
        return db.schema
            .dropTableIfExists("tags")
            .dropTableIfExists("tagGroups");
    },
    up: () => {
        return db.schema
            .createTable("tagGroups", (table) => {
                table.increments("id").primary();
                table.string("name").notNullable();
            })
            .createTable("tags", (table) => {
                table.increments("id").primary();
                table.string("name").notNullable();
                table.integer("groupId").notNullable();
                table.foreign("groupId").references("tagGroups.id");
            })
            .then(() => db("tagGroups")
                .insert(Object.keys(tagGroups).map((name) => ({ name })), "*")
                .then((groups) => db("tags")
                    .insert(groups.reduce((acc, group) => [
                        ...acc,
                        ...tagGroups[group.name].map((tagName) => ({ name: tagName, groupId: group.id }))
                    ], []))
                )
            );
    }
}