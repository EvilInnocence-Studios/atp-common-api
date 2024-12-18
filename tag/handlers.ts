import { pipeTo } from "serverless-api-boilerplate";
import { ITag, ITagGroup, NewTagGroup } from "../../common-shared/tag/types";
import { database } from "../../core/database";
import { HandlerArgs } from "../../core/express/types";
import { getBody, getParam } from "../../core/express/util";
import { CheckPermissions } from "../../uac/permission/util";
import { TagGroup, Tag} from "./service";

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
    public getTags (...args:HandlerArgs<undefined>):Promise<ITag[]> {
        return Tag.search();
    }

    @CheckPermissions("tag.create")
    public addTag (...args:HandlerArgs<ITag>):Promise<ITag> {
        return Tag.create(getBody(args));
    }

    @CheckPermissions("tag.delete")
    public removeTag (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Tag.remove, getParam("groupId"), getParam("tagId"))(args);
    }
};

export const TagHandlers = new TagHandlerClass();
