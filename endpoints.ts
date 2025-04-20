import { IApiConfig } from "../core/endpoints";
import { BannerEndpoints } from "./banner/endpoints";
import { CacheEndpoints } from "./cache/endpoints";
import { SettingEndpoints } from "./setting/endpoints";
import { SynonymEndpoints } from "./synonym/endpoints";
import { TagEndpoints } from "./tag/endpoints";

export const apiConfig:IApiConfig = {
    ...TagEndpoints,
    ...SynonymEndpoints,
    ...BannerEndpoints,
    ...CacheEndpoints,
    ...SettingEndpoints,
}