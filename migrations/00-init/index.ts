import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";
import { insertPermissions, insertRolePermissions } from "../../../uac/migrations/util";
import {
    bannersTable, contentTable, linkListsTable, linksTable, mediaTable, settingsTable,
    synonymsTable, tagGroupsTable, tagsTable, themesTable,
} from "../tables";
import { insertSettings } from "../util";

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

    { name: "media.view",       description: "Can view media"             },
    { name: "media.update",     description: "Can update media"           },
    { name: "media.create",     description: "Can create media"           },
    { name: "media.delete",     description: "Can delete media"           },

    { name: "theme.view",       description: "Can view themes"            },
    { name: "theme.update",     description: "Can update themes"          },
    { name: "theme.create",     description: "Can create themes"          },
    { name: "theme.delete",     description: "Can delete themes"          },

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
    { roleName: "SuperUser", permissionName: "media.view" },
    { roleName: "SuperUser", permissionName: "media.update" },
    { roleName: "SuperUser", permissionName: "media.create" },
    { roleName: "SuperUser", permissionName: "media.delete" },
    { roleName: "SuperUser", permissionName: "cache.clear" },
    { roleName: "SuperUser", permissionName: "theme.view" },
    { roleName: "SuperUser", permissionName: "theme.update" },
    { roleName: "SuperUser", permissionName: "theme.create" },
    { roleName: "SuperUser", permissionName: "theme.delete" },
    { roleName: "Public", permissionName: "tag.view" },
    { roleName: "Public", permissionName: "synonym.view" },
    { roleName: "Public", permissionName: "banner.view" },
    { roleName: "Public", permissionName: "settings.view" },
    { roleName: "Public", permissionName: "links.view" },
    { roleName: "Public", permissionName: "content.view" },
    { roleName: "Public", permissionName: "media.view" },
    { roleName: "Public", permissionName: "theme.view" },
];

const settings = [
    {key: "defaultPageSize", value: "12"},
    {key: "pageSizeOptions", value: "12,24,48,96"},
    {key: "awsRegion", value: "us-east-1"},
    {key: "forgotLoginSubject", value: "Forgot Login"},
    {key: "roleChangeSubject", value: "Role Change"},
    {key: "newAccountSubject", value: "New Account"},
    {key: "bannerImageFolder", value: "media/banner"},
    {key: "mediaImageFolder", value: "media/image"},
    {key: "themeThumbnailFolder", value: "media/theme"},
]

export const init:IMigration = {
    name: "init",
    module: "common",
    description: "Install the common module",
    order: 1,
    version: "1.0.0",
    down: (params?: Record<string, string>) => {
        return db.schema
            .dropTableIfExists("banners")
            .dropTableIfExists("synonyms")
            .dropTableIfExists("tags")
            .dropTableIfExists("tagGroups")
            .dropTableIfExists("settings")
            .dropTableIfExists("links")
            .dropTableIfExists("linkLists")
            .dropTableIfExists("content")
            .dropTableIfExists("media")
            .dropTableIfExists("themes");
    },
    parameters: [
        {name: "mediaBucket",   description: "The AWS bucket to use for media storage"},
        {name: "siteName",      description: "The name of the site"},
        {name: "adminAppName",  description: "The name of the admin app"},
        {name: "publicAppName", description: "The name of the public app"},
        {name: "imageHost",     description: "The hostname for the image server"},
    ],
    up: (params) => {
        console.log("---- RECEIVED PARAMS ----", params);
        return db.schema

        .createTable("settings", settingsTable)
        .createTable("tagGroups", tagGroupsTable)
        .createTable("tags", tagsTable)
        .createTable("synonyms", synonymsTable)
        .createTable("banners", bannersTable)
        .createTable("linkLists", linkListsTable)
        .createTable("links", linksTable)
        .createTable("content", contentTable)
        .createTable("media", mediaTable)
        .createTable("themes", themesTable);
    },
    initData: async (params?: Record<string, string>) => {
        await insertPermissions(db, permissions);
        await insertRolePermissions(db, rolePermissions);
        await insertSettings(db, [
            ...settings,
            ...Object.entries(params || {}).map(([key, value]) => ({key, value})),
        ]);
    },
}
