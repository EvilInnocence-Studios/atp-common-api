import { fromEnv } from "@aws-sdk/credential-providers";
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

export const CacheService = {
    clear: async (cacheTypes: string[] | string): Promise<any> => {
        const types = Array.isArray(cacheTypes) ? cacheTypes : [cacheTypes];
        const DistributionId = process.env.CLOUDFRONT_DISTRIBUTION_ID;

        const isAll = types.includes("all");
        const items = isAll
            ? ["/*"]
            : types.flatMap(type => {
                const cleaned = type.startsWith("/") ? type : `/${type}`;
                return [cleaned, `${cleaned}*`];
            });

        const uniqueItems = Array.from(new Set(items));

        if (!DistributionId) {
            console.log(`[CacheService] CLOUDFRONT_DISTRIBUTION_ID not set. Mocking invalidation for:`, uniqueItems);
            return {
                message: `CloudFront distribution ID not configured. Mocked cache clear for: ${uniqueItems.join(", ")}`,
                mocked: true,
                paths: uniqueItems
            };
        }

        const client = new CloudFrontClient({ region: process.env.AWS_REGION, credentials: fromEnv() });
        const command = new CreateInvalidationCommand({
            DistributionId,
            InvalidationBatch: {
                CallerReference: `${Date.now()}`,
                Paths: {
                    Quantity: uniqueItems.length,
                    Items: uniqueItems
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
};
