import { ILayout } from "../../common-shared/layout/types";
import { basicCrudService } from "../../core/express/service/common";

const LayoutBasic = basicCrudService<ILayout>("layouts");

export const Layout = {
    ...LayoutBasic,
}
