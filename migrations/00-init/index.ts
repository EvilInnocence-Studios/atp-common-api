import { insertPermissions, insertRolePermissions, insertRoles } from "../../../uac/migrations/util";
import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";
import { bannersTable, contentTable, linkListsTable, linksTable, settingsTable, synonymsTable, tagGroupsTable, tagsTable } from "../tables";

const db = database();

const permissions = [
    { name: "tag.view",         description: "Can view tags"              },
    { name: "tag.update",       description: "Can update tags"            },
    { name: "tag.create",       description: "Can create tags"            },
    { name: "tag.delete",       description: "Can delete tags"            },
    { name: "tag.unfilterable", description: "Can view unfilterable tags" },
    { name: "tag.unviewable",   description: "Can view unviewable tags"   },

    { name: "synonym.view",     description: "Can view synonyms"          },
    { name: "synonym.update",   description: "Can update synonyms"        },
    { name: "synonym.create",   description: "Can create synonyms"        },
    { name: "synonym.delete",   description: "Can delete synonyms"        },

    { name: "banner.view",      description: "Can view banners"           },
    { name: "banner.update",    description: "Can update banners"         },
    { name: "banner.create",    description: "Can create banners"         },
    { name: "banner.delete",    description: "Can delete banners"         },

    { name: "settings.view",   description: "Can view settings"          },
    { name: "settings.update", description: "Can update settings"        },
    { name: "settings.create", description: "Can create settings"        },
    { name: "settings.delete", description: "Can delete settings"        },

    { name: "links.view",       description: "Can view links"             },
    { name: "links.update",     description: "Can update links"           },
    { name: "links.create",     description: "Can create links"           },
    { name: "links.delete",     description: "Can delete links"           },

    { name: "content.view",      description: "Can view content"          },
    { name: "content.update",    description: "Can update content"        },
    { name: "content.create",    description: "Can create content"        },
    { name: "content.delete",    description: "Can delete content"        },
    { name: "content.disabled",  description: "Can view disabled content" },

    {name: "cache.clear",       description: "Can clear the cache"        },
];

const rolePermissions = [
    { roleName: "SuperUser", permissionName: "tag.view" },
    { roleName: "SuperUser", permissionName: "tag.update" },
    { roleName: "SuperUser", permissionName: "tag.create" },
    { roleName: "SuperUser", permissionName: "tag.delete" },
    { roleName: "SuperUser", permissionName: "tag.unfilterable" },
    { roleName: "SuperUser", permissionName: "tag.unviewable" },
    { roleName: "SuperUser", permissionName: "synonym.view" },
    { roleName: "SuperUser", permissionName: "synonym.update" },
    { roleName: "SuperUser", permissionName: "synonym.create" },
    { roleName: "SuperUser", permissionName: "synonym.delete" },
    { roleName: "SuperUser", permissionName: "banner.view" },
    { roleName: "SuperUser", permissionName: "banner.update" },
    { roleName: "SuperUser", permissionName: "banner.create" },
    { roleName: "SuperUser", permissionName: "banner.delete" },
    { roleName: "SuperUser", permissionName: "settings.view" },
    { roleName: "SuperUser", permissionName: "settings.update" },
    { roleName: "SuperUser", permissionName: "settings.create" },
    { roleName: "SuperUser", permissionName: "settings.delete" },
    { roleName: "SuperUser", permissionName: "links.view" },
    { roleName: "SuperUser", permissionName: "links.update" },
    { roleName: "SuperUser", permissionName: "links.create" },
    { roleName: "SuperUser", permissionName: "links.delete" },
    { roleName: "SuperUser", permissionName: "content.view" },
    { roleName: "SuperUser", permissionName: "content.update" },
    { roleName: "SuperUser", permissionName: "content.create" },
    { roleName: "SuperUser", permissionName: "content.delete" },
    { roleName: "SuperUser", permissionName: "content.disabled" },
    { roleName: "SuperUser", permissionName: "cache.clear" },
    { roleName: "Public", permissionName: "tag.view" },
    { roleName: "Public", permissionName: "synonym.view" },
    { roleName: "Public", permissionName: "banner.view" },
    { roleName: "Public", permissionName: "settings.view" },
    { roleName: "Public", permissionName: "links.view" },
    { roleName: "Public", permissionName: "content.view" },
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
            .dropTableIfExists("settings")
            .dropTableIfExists("links")
            .dropTableIfExists("linkLists")
            .dropTableIfExists("content");
    },
    up: () => db.schema
        .createTable("settings", settingsTable)
        .createTable("tagGroups", tagGroupsTable)
        .createTable("tags", tagsTable)
        .createTable("synonyms", synonymsTable)
        .createTable("banners", bannersTable)
        .createTable("linkLists", linkListsTable)
        .createTable("links", linksTable)
        .createTable("content", contentTable),
    initData: async () => {
        await insertPermissions(db, permissions);
        await insertRolePermissions(db, rolePermissions);
    },
}

export const links:IMigration = {
    name: "links",
    module: "common",
    description: "Create links table",
    order: 1,
    down: () => db.schema
        .dropTableIfExists("links")
        .dropTableIfExists("linkLists"),
    up: () => db.schema
        .createTable("linkLists", linkListsTable)
        .createTable("links", linksTable),
    initData: async () => {
        await insertPermissions(db, [
            { name: "links.view", description: "Can view links" },
            { name: "links.update", description: "Can update links" },
            { name: "links.create", description: "Can create links" },
            { name: "links.delete", description: "Can delete links" },
        ]);
        await insertRolePermissions(db, [
            { roleName: "SuperUser", permissionName: "links.view" },
            { roleName: "SuperUser", permissionName: "links.update" },
            { roleName: "SuperUser", permissionName: "links.create" },
            { roleName: "SuperUser", permissionName: "links.delete" },
            { roleName: "Public", permissionName: "links.view" },
        ]);
    }
};

export const content:IMigration = {
    name: "content",
    module: "common",
    description: "Create content table",
    order: 2,
    down: () => db.schema
        .dropTableIfExists("content"),
    up: () => db.schema
        .createTable("content", contentTable),
    initData: async () => {
        await insertPermissions(db, [
            { name: "content.view", description: "Can view content" },
            { name: "content.update", description: "Can update content" },
            { name: "content.create", description: "Can create content" },
            { name: "content.delete", description: "Can delete content" },
            { name: "content.disabled", description: "Can view disabled content" },
        ]);
        await insertRolePermissions(db, [
            { roleName: "SuperUser", permissionName: "content.view" },
            { roleName: "SuperUser", permissionName: "content.update" },
            { roleName: "SuperUser", permissionName: "content.create" },
            { roleName: "SuperUser", permissionName: "content.delete" },
            { roleName: "SuperUser", permissionName: "content.disabled" },
            { roleName: "Public", permissionName: "content.view" },
        ]);
    }
};
