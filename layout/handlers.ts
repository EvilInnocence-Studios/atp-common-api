import { pipeTo } from "ts-functional";
import { ILayout } from "../../common-shared/layout/types";
import { Query } from "../../core-shared/express/types";
import { getBody, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Layout } from "./service";

class LayoutHandlerClass {
    @CheckPermissions("layout.create")
    public create (...args:HandlerArgs<Partial<ILayout>>):Promise<ILayout> {
        return pipeTo(Layout.create, getBody)(args);
    }

    @CheckPermissions("layout.view")
    public search (...args:HandlerArgs<undefined>):Promise<ILayout[]> {
        return pipeTo(Layout.search, getBody<Query>)(args);
    }

    @CheckPermissions("layout.view")
    public get (...args:HandlerArgs<undefined>):Promise<ILayout> {
        return pipeTo(Layout.loadById, getParam("layoutId"))(args);
    }

    @CheckPermissions("layout.update")
    public update (...args:HandlerArgs<Partial<ILayout>>):Promise<ILayout> {
        return pipeTo(Layout.update, getParam("layoutId"), getBody)(args);
    }

    @CheckPermissions("layout.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Layout.remove, getParam("layoutId"))(args);
    }
}

export const LayoutHandlers = new LayoutHandlerClass();
