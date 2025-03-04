import { pipeTo } from "serverless-api-boilerplate";
import { ITag, ITagGroup, NewTagGroup } from "../../common-shared/tag/types";
import { Query } from "../../core-shared/express/types";
import { database } from "../../core/database";
import { getBody, getBodyParam, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Tag, TagGroup } from "./service";

const db = database();

class TagHandlerClass {
    @CheckPermissions("tag.create")
    public createGroup (...args:HandlerArgs<NewTagGroup>):Promise<ITagGroup> {
        return TagGroup.create(getBody(args));
    }

    @CheckPermissions("tag.view")
    public getGroups (...args:HandlerArgs<undefined>):Promise<ITagGroup[]> {
        return TagGroup.search();
    }

    @CheckPermissions("tag.update")
    public updateGroup (...args:HandlerArgs<Partial<ITagGroup>>):Promise<ITagGroup> {
        return pipeTo(TagGroup.update, getParam("groupId"), getBody)(args);
    }

    @CheckPermissions("tag.delete")
    public removeGroup (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(TagGroup.remove, getParam("groupId"))(args);
    }

    @CheckPermissions("tag.update")
    public sortGroups (...args:HandlerArgs<any>):Promise<ITagGroup[]> {
        return pipeTo(TagGroup.sort, getBodyParam("groupId"), getBodyParam("newIndex"))(args);
    }

    @CheckPermissions("tag.view")
    public getAllTags (...args:HandlerArgs<Query>):Promise<ITag[]> {
        return Tag.search();
    }

    @CheckPermissions("tag.view")
    public getTags (...args:HandlerArgs<Query>):Promise<ITag[]> {
        return Tag.search({groupId: getParam<string>("groupId")(args)});
    }

    @CheckPermissions("tag.create")
    public addTag (...args:HandlerArgs<ITag>):Promise<ITag> {
        return Tag.create(getBody(args));
    }

    @CheckPermissions("tag.view")
    public getTag (...args:HandlerArgs<Query>):Promise<ITag> {
        return pipeTo(Tag.loadById, getParam("tagId"))(args);
    }

    @CheckPermissions("tag.update")
    public updateTag (...args:HandlerArgs<Partial<ITag>>):Promise<ITag> {
        return pipeTo(Tag.update, getParam("tagId"), getBody)(args);
    }

    @CheckPermissions("tag.delete")
    public removeTag (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Tag.remove, getParam("tagId"))(args);
    }

    @CheckPermissions("tag.update")
    public sortTags (...args:HandlerArgs<any>):Promise<ITag[]> {
        return pipeTo(Tag.sort, getParam("groupId"), getBodyParam("tagId"), getBodyParam("newIndex"))(args);
    }
};

export const TagHandlers = new TagHandlerClass();
