import { del, get, patch, post } from "../../core/express/wrappers";
import { LinkHandlers } from "./handlers";

export const LinkEndpoints = {
    linkList: {
        GET: get(LinkHandlers.getLists),
        POST: post(LinkHandlers.createList),
        ":listId": {
            PATCH: patch(LinkHandlers.updateList),
            DELETE: del(LinkHandlers.removeList),
            link: {
                GET: get(LinkHandlers.getLinks),
                POST: post(LinkHandlers.addLink),
                sort: {
                    POST: post(LinkHandlers.sortLinks),
                },
                ":linkId": {
                    GET: get(LinkHandlers.getLink),
                    PATCH: patch(LinkHandlers.updateLink),
                    DELETE: del(LinkHandlers.removeLink),
                }
            }
        }
    }
}