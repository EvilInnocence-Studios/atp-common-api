import { pipeTo } from "ts-functional";
import { IContent, NewContent } from "../../common-shared/content/types";
import { Query } from "../../core-shared/express/types";
import { database } from "../../core/database";
import { getBody, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Content } from "./services";

const db = database();

class ContentHandlerClass {
    @CheckPermissions("content.view")
    public async search(...args: HandlerArgs<Query>): Promise<any[]> {
        return pipeTo(Content.search, getBody<Query>)(args);
    }

    @CheckPermissions("content.create")
    public async create(...args: HandlerArgs<NewContent>): Promise<any> {
        return pipeTo(Content.create, getBody)(args);
    }

    @CheckPermissions("content.view")
    public async get(...args: HandlerArgs<Query>): Promise<any> {
        return pipeTo(Content.loadById, getParam("contentId"))(args);
    }

    @CheckPermissions("content.update")
    public async update(...args: HandlerArgs<Partial<IContent>>): Promise<any> {
        return pipeTo(Content.update, getParam("contentId"), getBody)(args);
    }

    @CheckPermissions("content.delete")
    public async remove(...args: HandlerArgs<undefined>): Promise<null> {
        return pipeTo(Content.remove, getParam("contentId"))(args);
    }
}

export const ContentHandlers = new ContentHandlerClass();