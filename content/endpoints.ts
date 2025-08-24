import { del, get, patch, post } from "../../core/express/wrappers";
import { ContentHandlers } from "./handlers";

export const ContentEndpoints = {
    content: {
        GET: get(ContentHandlers.search),
        POST: post(ContentHandlers.create),
        ":contentId": {
            GET: get(ContentHandlers.get),
            PATCH: patch(ContentHandlers.update),
            DELETE: del(ContentHandlers.remove),
        }
    }
};
