import { get, patch, post, del } from "../../core/express/wrappers";
import { CacheHandlers } from "./handlers";

export const CacheEndpoints = {
    cache: {
        ":cacheType": {
            POST: post(CacheHandlers.clear),
        }
    }
}