import { IMedia } from "../../common-shared/media/types";
import { Setting } from "../../common/setting/service";
import { basicCrudService, mediaService } from "../../core/express/service/common";

const MediaBasic = basicCrudService<IMedia>("media");

export const MediaService = {
    ...MediaBasic,
    ...mediaService({
        dbTable: "media",
        uniqueColumns: ["url"],
        newRecord: (file: File) => ({ url: file.name, title: file.name, altText: "", caption: "" }),
        updateRecord: (file: File) => ({ url: file.name }),
        getFolder: () => Setting.get("mediaFolder"),
        getEntity: MediaBasic.loadById,
        getFileName: (media: IMedia) => media.url,
    })
}
