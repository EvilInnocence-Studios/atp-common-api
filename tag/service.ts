import { ITag, ITagGroup } from "../../common-shared/tag/types";
import { basicCrudService } from "../../core/express/service/common";
import { reorder } from "../../core/express/util";

export const TagGroup = {
    ...basicCrudService<ITagGroup>("tagGroups"),
    sort: async (groupId: string, newIndex: string):Promise<ITagGroup[]> => {
        await reorder("tagGroups", groupId, newIndex);
        return await TagGroup.search();
    }
}

export const Tag = {
    ...basicCrudService<ITag>("tags"),
    sort: async (groupId:string, tagId: string, newIndex: string):Promise<ITag[]> => {
        await reorder("tags", tagId, newIndex, {groupId});
        return await Tag.search({groupId});
    }
}