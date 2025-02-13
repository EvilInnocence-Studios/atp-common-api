import { pipeTo } from "serverless-api-boilerplate";
import { ITag, ITagGroup, NewTagGroup } from "../../common-shared/tag/types";
import { database } from "../../core/database";
import { HandlerArgs } from "../../core/express/types";
import { getBody, getParam, getParams } from "../../core/express/extractors";
import { CheckPermissions } from "../../uac/permission/util";
import { TagGroup, Tag} from "./service";
import { Query } from "../../core-shared/express/types";

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

    @CheckPermissions("tag.update")
    public updateTag (...args:HandlerArgs<Partial<ITag>>):Promise<ITag> {
        return pipeTo(Tag.update, getParam("tagId"), getBody)(args);
    }

    @CheckPermissions("tag.delete")
    public removeTag (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Tag.remove, getParam("tagId"))(args);
    }
};

export const TagHandlers = new TagHandlerClass();
