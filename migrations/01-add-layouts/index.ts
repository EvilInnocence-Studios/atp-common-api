import { insertPermissions, insertRolePermissions } from "../../../uac/migrations/util";
import { database } from "../../../core/database";
import { IMigration } from "../../../core/dbMigrations";
import { layoutsTable } from "../tables";

const db = database();

const permissions = [
    { name: "layout.view",      description: "Can view layouts"           },
    { name: "layout.update",    description: "Can update layouts"         },
    { name: "layout.create",    description: "Can create layouts"         },
    { name: "layout.delete",    description: "Can delete layouts"         },
];

const rolePermissions = [
    { roleName: "SuperUser", permissionName: "layout.view" },
    { roleName: "SuperUser", permissionName: "layout.update" },
    { roleName: "SuperUser", permissionName: "layout.create" },
    { roleName: "SuperUser", permissionName: "layout.delete" },
    { roleName: "Public", permissionName: "layout.view" },
];

export const addLayouts:IMigration = {
    name: "add-layouts",
    module: "common",
    description: "Add layouts table",
    order: 1,
    down: () => {
        return db.schema.dropTableIfExists("layouts");
    },
    up: () => db.schema.createTable("layouts", layoutsTable),
    initData: async () => {
        await insertPermissions(db, permissions);
        await insertRolePermissions(db, rolePermissions);
    },
}
