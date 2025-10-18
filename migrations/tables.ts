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
    table.bigInteger("subMenuId").nullable().references("linkLists.id").onDelete("SET NULL");
    table.smallint("order").notNullable().defaultTo(0);
};

export const contentTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("slug").notNullable().unique();
    table.string("title");
    table.enum("type", ["page", "snippet"]).notNullable().defaultTo("page");
    table.text("content").notNullable().defaultTo("");
    table.boolean("enabled").notNullable().defaultTo(false);
    table.date("publishDate");
}

export const mediaTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("url").notNullable().unique();
    table.string("altText");
    table.string("title");
    table.string("caption");
 }

 export const pluginsTable = (table:Knex.TableBuilder) => {
    table.bigIncrements();
    table.string("group").notNullable();
    table.string("key").notNullable();
    table.smallint("sortOrder");
    table.json("settings").notNullable().defaultTo("{}");
    table.unique(["group", "identifier"]);
 }
 