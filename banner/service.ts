import { IBanner } from "../../common-shared/banner/types";
import { database } from "../../core/database";
import { basicCrudService } from "../../core/express/service/common";
import { error409, error500 } from "../../core/express/util";
import { downloadMedia, removeMedia, uploadMedia } from "../../core/s3Uploads";

const db = database();

export const Banner = {
    ...basicCrudService<IBanner>("banners"),
    upload: async (file:File):Promise<IBanner> => {
        console.log(file);
        // Upload file to S3
        try {
            await uploadMedia(`media/banner`, file, {failOnExist: true});
        } catch(e) {
            console.log(e);
            throw error409("File already exists");
        }

        // Create record in database
        // If url unique key already exists, just return the existing record instead
        const mediaToInsert = { url: file.name, name: file.name };
        console.log(mediaToInsert);
        const [newMedia] = await db("banners")
            .insert(mediaToInsert, "*")
            .onConflict(["url"]).ignore();

        return newMedia;
    },
    remove: async (bannerId: number):Promise<null> => {
        const banner:IBanner = await Banner.loadById(bannerId);

        // Remove file from S3
        await removeMedia(`media/banner`, banner.url);

        // Remove record from database
        await db("banners").where({ id: bannerId }).delete();

        return null;
    },
    download: async (bannerId:number) => {
        const banner:IBanner = await Banner.loadById(bannerId);
        return downloadMedia(`media/banner`, banner.url);
    }
}
