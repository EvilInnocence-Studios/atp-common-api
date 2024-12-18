import { ITag, ITagGroup } from "../../common-shared/tag/types";
import { basicCrudService } from "../../core/express/service/common";

export const TagGroup = {
    ...basicCrudService<ITagGroup>("tagGroup"),
}

export const Tag = {
    ...basicCrudService<ITag>("tag"),
}