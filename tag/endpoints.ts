import { del, get, patch, post } from "../../core/express/wrappers";
import { TagHandlers } from "./handlers";

export const TagEndpoints = {
    group: {
        GET: get(TagHandlers.getGroups),
        POST: post(TagHandlers.createGroup),
        ":groupId": {
            PATCH: patch(TagHandlers.updateGroup),
            DELETE: del(TagHandlers.removeGroup),
            tag: {
                GET: get(TagHandlers.getTags),
                POST: post(TagHandlers.addTag),
                ":tagId": {
                    PATCH: patch(TagHandlers.updateTag),
                    DELETE: del(TagHandlers.removeTag),
                }
            },
        }
    },
}