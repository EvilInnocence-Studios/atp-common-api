import { IBanner } from "../../common-shared/banner/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService } from "../../core/express/service/common";
import { mediaService } from "../../core/express/service/media";

const BannerBasic = basicCrudService<IBanner>("banners");

export const Banner = {
    ...BannerBasic,
    ...mediaService({
        dbTable: "banners",
        uniqueColumns: ["url"],
        newRecord: (file:File) => ({ url: file.name, name: file.name }),
        updateRecord: (file:File) => ({ url: file.name, name: file.name }),
        getFolder: () => Setting.get("bannerImageFolder"),
        getEntity: BannerBasic.loadById,
        getFileName: (banner:IBanner) => banner.url,

    }),
}
