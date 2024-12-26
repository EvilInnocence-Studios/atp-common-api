import { get, patch, post, del } from "../../core/express/wrappers";
import { SynonymHandlers } from "./handlers";

export const SynonymEndpoints = {
    synonym: {
        GET: get(SynonymHandlers.search),
        POST: post(SynonymHandlers.create),
        ":synonymId": {
            PATCH: patch(SynonymHandlers.update),
            DELETE: del(SynonymHandlers.remove),
        }
    }
}