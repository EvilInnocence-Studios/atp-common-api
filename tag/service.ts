import { ITag, ITagGroup } from "../../common-shared/tag/types";
import { basicCrudService } from "../../core/express/service/common";

export const TagGroup = {
    ...basicCrudService<ITagGroup>("tagGroups"),
}

export const Tag = {
    ...basicCrudService<ITag>("tags"),
}