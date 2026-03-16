import { ISetting } from "@common-shared/setting/types";
import { Knex } from "knex";

export const insertSettings = async (db: Knex, settings: Partial<ISetting>[]): Promise<ISetting[]> =>
    db.insert(settings, "*").into("settings").onConflict().ignore();

