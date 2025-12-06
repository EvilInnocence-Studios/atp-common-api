import { del, get, patch, post } from "../../core/express/wrappers";
import { LayoutHandlers } from "./handlers";

export const LayoutEndpoints = {
    layout: {
        GET: get(LayoutHandlers.search),
        POST: post(LayoutHandlers.create),
        ":layoutId": {
            GET: get(LayoutHandlers.get),
            PATCH: patch(LayoutHandlers.update),
            DELETE: del(LayoutHandlers.remove),
        }
    }
}
