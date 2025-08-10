import { memoizePromise } from "ts-functional";
import { ISetting } from "../../common-shared/setting/types";
import { database } from "../../core/database";
import { basicCrudService } from "../../core/express/service/common";

const db = database();

export const Setting = {
    ...basicCrudService<ISetting>("settings", "key"),
    get: memoizePromise(async (key: string): Promise<string> => {
        const setting = await db
            .select("*")
            .from("settings")
            .where({ key })
            .first();
        if (!setting) {
            return "";
        }
        return setting.value;
    }, {ttl: 5000}),
};

