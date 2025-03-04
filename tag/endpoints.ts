import { del, get, patch, post } from "../../core/express/wrappers";
import { TagHandlers } from "./handlers";

export const TagEndpoints = {
    group: {
        GET: get(TagHandlers.getGroups),
        POST: post(TagHandlers.createGroup),
        sort: {
            POST: post(TagHandlers.sortGroups),
        },
        ":groupId": {
            PATCH: patch(TagHandlers.updateGroup),
            DELETE: del(TagHandlers.removeGroup),
            tag: {
                GET: get(TagHandlers.getTags),
                POST: post(TagHandlers.addTag),
                sort: {
                    POST: post(TagHandlers.sortTags),
                },
                ":tagId": {
                    GET: get(TagHandlers.getTag),
                    PATCH: patch(TagHandlers.updateTag),
                    DELETE: del(TagHandlers.removeTag),
                }
            },
        }
    },
    tag: {
        GET: get(TagHandlers.getAllTags),
    }
}