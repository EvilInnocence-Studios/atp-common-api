import { del, get, patch, post } from "../../core/express/wrappers";
import { ThemeHandlers } from "./handlers";

export const ThemeEndpoints = {
    theme: {
        GET: get(ThemeHandlers.search),
        POST: post(ThemeHandlers.create),
        ":themeId": {
            GET: get(ThemeHandlers.get),
            PATCH: patch(ThemeHandlers.update),
            DELETE: del(ThemeHandlers.remove),
            "image": {
                POST: post(ThemeHandlers.uploadImage),
                DELETE: post(ThemeHandlers.removeImage),
                PATCH: patch(ThemeHandlers.replaceImage),
            }
        }
    }
}
