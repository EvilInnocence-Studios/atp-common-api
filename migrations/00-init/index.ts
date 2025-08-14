import { insertPermissions, insertRolePermissions, insertRoles } from "@uac/migrations/util";
import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";

const db = database();

const permissions = [
    { name: "tag.view",             description: "Can view tags"         },
    { name: "tag.update",           description: "Can update tags"       },
    { name: "tag.create",           description: "Can create tags"       },
    { name: "tag.delete",           description: "Can delete tags"       },

    { name: "synonym.view",         description: "Can view synonyms"     },
    { name: "synonym.update",       description: "Can update synonyms"   },
    { name: "synonym.create",       description: "Can create synonyms"   },
    { name: "synonym.delete",       description: "Can delete synonyms"   },

    { name: "banner.view",          description: "Can view banners"      },
    { name: "banner.update",        description: "Can update banners"    },
    { name: "banner.create",        description: "Can create banners"    },
    { name: "banner.delete",        description: "Can delete banners"    },
];

const rolePermissions = [
    { roleName: "SuperUser", permissionName: "tag.view" },
    { roleName: "SuperUser", permissionName: "tag.update" },
    { roleName: "SuperUser", permissionName: "tag.create" },
    { roleName: "SuperUser", permissionName: "tag.delete" },
    { roleName: "SuperUser", permissionName: "synonym.view" },
    { roleName: "SuperUser", permissionName: "synonym.update" },
    { roleName: "SuperUser", permissionName: "synonym.create" },
    { roleName: "SuperUser", permissionName: "synonym.delete" },
    { roleName: "SuperUser", permissionName: "banner.view" },
    { roleName: "SuperUser", permissionName: "banner.update" },
    { roleName: "SuperUser", permissionName: "banner.create" },
    { roleName: "SuperUser", permissionName: "banner.delete" },
    { roleName: "Public", permissionName: "tag.view" },
    { roleName: "Public", permissionName: "synonym.view" },
    { roleName: "Public", permissionName: "banner.view" },
];

export const init:IMigration = {
    name: "init",
    module: "common",
    description: "Install the common module",
    order: 0,
    down: () => {
        return db.schema
            .dropTableIfExists("banners")
            .dropTableIfExists("synonyms")
            .dropTableIfExists("tags")
            .dropTableIfExists("tagGroups")
            .dropTableIfExists("settings");
    },
    up: () => db.schema
        .createTable("settings", (table) => {
            table.bigIncrements();
            table.string("key").notNullable().unique();
            table.string("value");
        })
        .createTable("tagGroups", (table) => {
            table.bigIncrements();
            table.string("name").notNullable();
            table.boolean("filterable").notNullable().defaultTo(true);
            table.boolean("visible").notNullable().defaultTo(true);
            table.integer("order").notNullable().defaultTo(0);
        })
        .createTable("tags", (table) => {
            table.bigIncrements();
            table.string("name").notNullable();
            table.bigInteger("groupId").notNullable().references("tagGroups.id").onDelete("CASCADE");
            table.boolean("filterable").notNullable().defaultTo(true);
            table.integer("order").notNullable().defaultTo(0);
        })
        .createTable("synonyms", (table) => {
            table.bigIncrements();
            table.string("canonical").notNullable();
            table.string("synonym").notNullable();
        })
        .createTable("banners", (table) => {
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
        }),
    initData: async () => Promise.all([
        insertPermissions(db, permissions),
        insertRolePermissions(db, rolePermissions),
    ]),
}