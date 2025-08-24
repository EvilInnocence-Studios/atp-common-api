import { database } from "@core/database";
import { CheckPermissions } from "@uac/permission/util";
import { Content } from "./services";

const db = database();

class ContentHandlerClass {
    @CheckPermissions("contents.view")
    public async search(...args: any[]): Promise<any[]> {
        return Content.search({ ...args[0] });
    }
}

export const ContentHandlers = new ContentHandlerClass();