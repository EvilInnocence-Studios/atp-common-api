import { del, get, patch, post } from "../../core/express/wrappers";
import { SettingHandlerClass, SettingHandlers } from "./handlers";

export const SettingEndpoints = {
    setting: {
        GET: get(SettingHandlers.get),
        POST: post(SettingHandlers.create),
        ":settingId": {
            GET: get(SettingHandlers.get),
            PATCH: patch(SettingHandlers.update),
            DELETE: del(SettingHandlers.remove),
        }
    }
}