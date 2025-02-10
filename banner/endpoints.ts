import { del, get, patch, upload } from "../../core/express/wrappers";
import { BannerHandlers } from "./handlers";

export const BannerEndpoints = {
    banner: {
        GET: get(BannerHandlers.search),
        POST: upload(BannerHandlers.create),
        replace: {
            POST: upload(BannerHandlers.replace),
        },
        ":bannerId": {
            GET: get(BannerHandlers.get),
            PATCH: patch(BannerHandlers.update),
            DELETE: del(BannerHandlers.remove),
        }
    }
}
