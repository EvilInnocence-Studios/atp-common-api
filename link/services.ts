import { ILink, ILinkList } from "../../common-shared/link/types";
import { basicCrudService } from "../../core/express/service/common";
import { reorder } from "../../core/express/util";

export const LinkList = {
    ...basicCrudService<ILinkList>("linkLists"),
}

export const Link = {
    ...basicCrudService<ILink>("links", "text"),
    sort: async (listId: string, linkId: string, newIndex: string): Promise<ILink[]> => {
        await reorder("links", linkId, newIndex, { listId });
        return await Link.search({ listId });
    }
}
