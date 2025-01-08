import { IBanner } from "../../common-shared/banner/types";
import { database } from "../../core/database";
import { basicCrudService } from "../../core/express/service/common";
import { downloadMedia, removeMedia, uploadMedia } from "../../core/s3Uploads";

const db = database();

export const Banner = {
    ...basicCrudService<IBanner>("banners"),
    upload: async (file:Express.Multer.File):Promise<IBanner> => {
        // Upload file to S3
        uploadMedia(`media/banner`, file, {failOnExist: true});

        // Create record in database
        // If url unique key already exists, just return the existing record instead
        const [newMedia] = await db("banners")
            .insert({ url: file.filename, name: file.filename }, "*")
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
