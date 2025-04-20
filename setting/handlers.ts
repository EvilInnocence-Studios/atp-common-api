import { pipeTo } from "ts-functional";
import { Query } from "../../core-shared/express/types";
import { getBody, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Setting } from "./service";

export class SettingHandlerClass {
    @CheckPermissions("settings.view")
    public async get (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Setting.search, getBody<Query>)(args);
    }

    @CheckPermissions("settings.update")
    public async update (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Setting.update, getParam("settingId"), getBody)(args);
    }

    @CheckPermissions("settings.create")
    public async create (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Setting.create, getBody)(args);
    }

    @CheckPermissions("settings.delete")
    public async remove (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Setting.remove, getParam("settingId"))(args);
    }
}

export const SettingHandlers = new SettingHandlerClass();