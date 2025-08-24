import { IContent } from "@common-shared/content/types";
import { basicCrudService } from "@core/express/service/common";

export const Content = {
    ...basicCrudService<IContent>("contents", "title"),
};
