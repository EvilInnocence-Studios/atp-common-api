import { pipeTo } from "ts-functional";
import { IMedia, NewMedia } from "../../common-shared/media/types";
import { Query } from "../../core-shared/express/types";
import { getBody, getFile, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { MediaService } from "./service";

class MediaHandlerClass {
    @CheckPermissions("media.create")
    public upload (...args: HandlerArgs<NewMedia>): Promise<IMedia> {
        return pipeTo(MediaService.upload(false), getFile)(args);
    }

    @CheckPermissions("media.create")
    public replace (...args: HandlerArgs<IMedia>): Promise<IMedia> {
        return pipeTo(MediaService.upload(true), getFile)(args);
    }

    @CheckPermissions("media.view")
    public get (...args: HandlerArgs<undefined>): Promise<IMedia> {
        return pipeTo(MediaService.loadById, getParam("mediaId"))(args);
    }

    @CheckPermissions("media.view")
    public search (...args: HandlerArgs<undefined>): Promise<IMedia[]> {
        return pipeTo(MediaService.search, getBody<Query>)(args);
    }

    @CheckPermissions("media.update")
    public update (...args: HandlerArgs<Partial<IMedia>>): Promise<IMedia> {
        return pipeTo(MediaService.update, getParam("mediaId"), getBody)(args);
    }

    @CheckPermissions("media.update")
    public replaceMedia (...args: HandlerArgs<Partial<IMedia>>): Promise<IMedia> {
        return pipeTo(MediaService.replace, getParam("mediaId"), getFile)(args);
    }

    @CheckPermissions("media.delete")
    public remove (...args: HandlerArgs<undefined>): Promise<null> {
        return pipeTo(MediaService.remove, getParam("mediaId"))(args);
    }
}

export const MediaHandlers = new MediaHandlerClass();