import { insertPermissions, insertRolePermissions } from "../../../uac/migrations/util";
import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";
import { themesTable } from "../tables";

const db = database();

const permissions = [
    { name: "theme.view",      description: "Can view themes"           },
    { name: "theme.update",    description: "Can update themes"         },
    { name: "theme.create",    description: "Can create themes"         },
    { name: "theme.delete",    description: "Can delete themes"         },
];

const rolePermissions = [
    { roleName: "SuperUser", permissionName: "theme.view" },
    { roleName: "SuperUser", permissionName: "theme.update" },
    { roleName: "SuperUser", permissionName: "theme.create" },
    { roleName: "SuperUser", permissionName: "theme.delete" },
    { roleName: "Public", permissionName: "theme.view" },
];

export const addThemes:IMigration = {
    name: "add-themes",
    module: "common",
    description: "Add themes table",
    order: 1,
    down: () => {
        return db.schema.dropTableIfExists("themes");
    },
    up: () => db.schema.createTable("themes", themesTable),
    initData: async () => {
        await insertPermissions(db, permissions);
        await insertRolePermissions(db, rolePermissions);
    },
}
