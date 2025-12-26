import { optionalMediaService } from "../../core/express/service/media";
import { ITheme } from "../../common-shared/theme/types";
import { basicCrudService } from "../../core/express/service/common";
import { Setting } from "../../common/setting/service";

const ThemeBasic = basicCrudService<ITheme>("themes");

export const Theme = {
    ...ThemeBasic,
    image: optionalMediaService<ITheme>({
        dbTable: "themes",
        mediaColumn: "imageUrl",
        getFolder: () => Setting.get("themeThumbnailFolder"),
        getEntity: ThemeBasic.loadById,
        getFileName: (theme:ITheme) => theme.imageUrl,
    })
}
