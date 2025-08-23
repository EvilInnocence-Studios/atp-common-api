import { Knex } from "knex";

export const settingsTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("key").notNullable().unique();
    table.string("value");
};

export const tagGroupsTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("name").notNullable();
    table.boolean("filterable").notNullable().defaultTo(true);
    table.boolean("visible").notNullable().defaultTo(true);
    table.integer("order").notNullable().defaultTo(0);
}

export const tagsTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("name").notNullable();
    table.bigInteger("groupId").notNullable().references("tagGroups.id").onDelete("CASCADE");
    table.boolean("filterable").notNullable().defaultTo(true);
    table.integer("order").notNullable().defaultTo(0);
};

export const synonymsTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("canonical").notNullable();
    table.string("synonym").notNullable();
};

export const bannersTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("tag");
    table.string("name");
    table.string("title");
    table.string("description");
    table.string("url").notNullable().unique();
    table.string("link");
    table.date("activeFrom");
    table.date("activeTo");
    table.integer("order");
    table.string("buttonText");
    table.string("buttonLink");
    table.string("buttonLocation");
    table.string("buttonTextAlt");
    table.string("buttonLinkAlt");
    table.string("buttonLocationAlt");
};

export const linkListsTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("name").notNullable();
    table.string("key").notNullable().unique();
}

export const linksTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.bigInteger("listId").notNullable().references("linkLists.id").onDelete("CASCADE");
    table.string("text").notNullable();
    table.string("url").notNullable();
    table.integer("order").notNullable().defaultTo(0);
};
