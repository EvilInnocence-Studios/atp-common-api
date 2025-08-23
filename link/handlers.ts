import { pipeTo } from "ts-functional";
import { ILink, ILinkList, NewLinkList } from "../../common-shared/link/types";
import { Query } from "../../core-shared/express/types";
import { database } from "../../core/database";
import { getBody, getBodyParam, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Link, LinkList } from "./services";

const db = database();

class LinkHandlerClass {
    @CheckPermissions("link.view")
    public async getLists(...args:HandlerArgs<undefined>): Promise<ILinkList[]> {
        return pipeTo(LinkList.search, getBody<Query>)(args);
    }

    @CheckPermissions("link.create")
    public async createList(...args:HandlerArgs<NewLinkList>): Promise<ILinkList> {
        return pipeTo(LinkList.create, getBody)(args);
    }

    @CheckPermissions("link.update")
    public async updateList(...args:HandlerArgs<Partial<ILinkList>>): Promise<ILinkList> {
        return pipeTo(LinkList.update, getParam("listId"), getBody)(args);
    }

    @CheckPermissions("link.delete")
    public async removeList(...args:HandlerArgs<undefined>): Promise<null> {
        return pipeTo(LinkList.remove, getParam("listId"))(args);
    }

    @CheckPermissions("link.view")
    public async getLinks(...args:HandlerArgs<Query>): Promise<ILink[]> {
        return Link.search({ listId: getParam<string>("listId")(args) });
    }

    @CheckPermissions("link.create")
    public async addLink(...args:HandlerArgs<ILink>): Promise<ILink> {
        return Link.create(getBody(args));
    }

    @CheckPermissions("link.view")
    public async getLink(...args:HandlerArgs<Query>): Promise<ILink> {
        return pipeTo(Link.loadById, getParam("linkId"))(args);
    }

    @CheckPermissions("link.update")
    public async updateLink(...args:HandlerArgs<Partial<ILink>>): Promise<ILink> {
        return pipeTo(Link.update, getParam("linkId"), getBody)(args);
    }

    @CheckPermissions("link.delete")
    public async removeLink(...args:HandlerArgs<undefined>): Promise<null> {
        return pipeTo(Link.remove, getParam("linkId"))(args);
    }

    @CheckPermissions("link.update")
    public async sortLinks(...args:HandlerArgs<any>): Promise<ILink[]> {
        return pipeTo(Link.sort, getParam("listId"), getBodyParam("linkId"), getBodyParam("newIndex"))(args);
    }
}

export const LinkHandlers = new LinkHandlerClass();