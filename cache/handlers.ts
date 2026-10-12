import { getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { CacheService } from "./service";

class CacheHandlerClass {
    @CheckPermissions("cache.clear")
    public async clear(...args: HandlerArgs<undefined>): Promise<any> {
        const cacheType = getParam<string>("cacheType")(args);
        return CacheService.clear(cacheType);
    }
}

export const CacheHandlers = new CacheHandlerClass();