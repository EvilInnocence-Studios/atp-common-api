import { IMedia } from "../../common-shared/media/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService } from "../../core/express/service/common";
import { mediaService } from "../../core/express/service/media";

const MediaBasic = basicCrudService<IMedia>("media", "title" );

export const MediaService = {
    ...MediaBasic,
    ...mediaService({
        dbTable: "media",
        uniqueColumns: ["url"],
        newRecord: (file: File) => ({ url: file.name, title: file.name, altText: "", caption: "" }),
        updateRecord: (file: File) => ({ url: file.name }),
        getFolder: () => Setting.get("mediaImageFolder"),
        getEntity: MediaBasic.loadById,
        getFileName: (media: IMedia) => media.url,
    })
}
