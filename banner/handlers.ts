import { pipeTo } from "serverless-api-boilerplate";
import { IBanner } from "../../common-shared/banner/types";
import { database } from "../../core/database";
import { getBody, getFile, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Banner } from "./service";

const db = database();

class BannerHandlerClass {
    @CheckPermissions("banner.create")
    public create (...args:HandlerArgs<Partial<any>>):Promise<IBanner> {
        console.log(args);
        return pipeTo(Banner.upload(false), getFile)(args);
    }

    @CheckPermissions("banner.create")
    public replace (...args:HandlerArgs<Partial<any>>):Promise<IBanner> {
        console.log(args);
        return pipeTo(Banner.upload(true), getFile)(args);
    }

    @CheckPermissions("banner.view")
    public search (...args:HandlerArgs<undefined>):Promise<IBanner[]> {
        return pipeTo(Banner.search, getBody)(args);
    }

    @CheckPermissions("banner.view")
    public get (...args:HandlerArgs<undefined>):Promise<IBanner> {
        return pipeTo(Banner.loadById, getParam("bannerId"))(args);
    }

    @CheckPermissions("banner.update")
    public update (...args:HandlerArgs<Partial<IBanner>>):Promise<IBanner> {
        return pipeTo(Banner.update, getParam("bannerId"), getBody)(args);
    }

    @CheckPermissions("banner.update")
    public replaceBanner (...args:HandlerArgs<Partial<IBanner>>):Promise<IBanner> {
        return pipeTo(Banner.replace, getParam("bannerId"), getFile)(args);
    }

    @CheckPermissions("banner.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Banner.remove, getParam("bannerId"))(args);
    }
}

export const BannerHandlers = new BannerHandlerClass();