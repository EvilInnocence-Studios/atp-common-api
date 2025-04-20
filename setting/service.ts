import { ISetting } from "../../common-shared/setting/types";
import { database } from "../../core/database";
import { basicCrudService } from "../../core/express/service/common";

const db = database();

export const Setting = {
    ...basicCrudService<ISetting>("settings"),
};