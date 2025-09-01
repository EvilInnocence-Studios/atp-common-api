import { del, get, patch, upload } from "../../core/express/wrappers";
import { MediaHandlers } from "./handlers";

export const MediaEndpoints = {
    media: {
        GET: get(MediaHandlers.search),
        POST: upload(MediaHandlers.upload),
        replace: {
            POST: upload(MediaHandlers.replace),
        },
        ":mediaId": {
            replace: {
                POST: upload(MediaHandlers.replaceMedia),
            },
            GET: get(MediaHandlers.get),
            PATCH: patch(MediaHandlers.update),
            DELETE: del(MediaHandlers.remove),
        }
    }
}
