import { del, get, patch, post, upload } from "../../core/express/wrappers";
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
                POST: upload(ThemeHandlers.uploadImage),
                DELETE: post(ThemeHandlers.removeImage),
                PATCH: upload(ThemeHandlers.replaceImage),
            }
        }
    }
}
