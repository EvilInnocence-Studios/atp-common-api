import { getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

class CacheHandlerClass {
    @CheckPermissions("cache.clear")
    public async clear(...args:HandlerArgs<undefined>):Promise<any> {
        const cacheType = getParam("cacheType")(args);
        const DistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;

        const client = new CloudFrontClient({ region: process.env.AWS_REGION });
        const command = new CreateInvalidationCommand({
            DistributionId,
            InvalidationBatch: {
                CallerReference: `${Date.now()}`,
                Paths: {
                    Quantity: 1,
                    Items: [
                        `/${cacheType}`,
                        `/${cacheType}*`,
                    ]
                }
            }
        });

        try {
            const response = await client.send(command);
            return response;
        } catch (error) {
            console.error("Error invalidating cache:", error);
            throw error;
        }
    }
}

export const CacheHandlers = new CacheHandlerClass();