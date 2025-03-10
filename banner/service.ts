import { IBanner } from "../../common-shared/banner/types";
import { database } from "../../core/database";
import { error409 } from "../../core/express/errors";
import { basicCrudService } from "../../core/express/service/common";
import { downloadMedia, removeMedia, uploadMedia } from "../../core/s3Uploads";

const db = database();

export const Banner = {
    ...basicCrudService<IBanner>("banners"),
    upload: (overwrite: boolean) => async (file:File):Promise<IBanner> => {
        // Upload file to S3
        try {
            await uploadMedia(`media/banner`, file, {failOnExist: !overwrite});
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
    remove: async (bannerId: string):Promise<null> => {
        const banner:IBanner = await Banner.loadById(bannerId);

        // Remove file from S3
        await removeMedia(`media/banner`, banner.url);

        // Remove record from database
        await db("banners").where({ id: bannerId }).delete();

        return null;
    },
    replace: async (bannerId: string, file:File):Promise<IBanner> => {
        const banner:IBanner = await Banner.loadById(bannerId);

        // Remove existing file from S3
        await removeMedia(`media/banner`, banner.url);

        // Upload new file to S3
        await uploadMedia(`media/banner`, file);

        // Update record in database
        const mediaToUpdate = { url: file.name, name: file.name };
        const [updatedMedia] = await db("banners")
            .where({ id: bannerId })
            .update(mediaToUpdate, "*");

        return updatedMedia;
    },
    download: async (bannerId:string) => {
        const banner:IBanner = await Banner.loadById(bannerId);
        return downloadMedia(`media/banner`, banner.url);
    }
}
