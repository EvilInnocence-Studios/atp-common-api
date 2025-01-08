import { del, get, patch, post } from "../../core/express/wrappers";
import { BannerHandlers } from "./handlers";

export const BannerEndpoints = {
    banner: {
        GET: get(BannerHandlers.search),
        POST: post(BannerHandlers.create),
        ":bannerId": {
            GET: get(BannerHandlers.get),
            PATCH: patch(BannerHandlers.update),
            DELETE: del(BannerHandlers.remove),
        }
    }
}
