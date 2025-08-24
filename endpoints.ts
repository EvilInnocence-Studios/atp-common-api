import { Index } from "ts-functional/dist/types";
import { IApiConfig } from "../core/endpoints";
import { getBody } from "../core/express/extractors";
import { HandlerArgs } from "../core/express/types";
import { post } from "../core/express/wrappers";
import { render } from "../core/render";
import { sendEmail } from "../core/sendEmail";
import { BannerEndpoints } from "./banner/endpoints";
import { CacheEndpoints } from "./cache/endpoints";
import { ErrorReport } from "./components/errorReport";
import { ContentEndpoints } from "./content/endpoints";
import { LinkEndpoints } from "./link/endpoints";
import { SettingEndpoints } from "./setting/endpoints";
import { SynonymEndpoints } from "./synonym/endpoints";
import { TagEndpoints } from "./tag/endpoints";

export const apiConfig:IApiConfig = {
    ...TagEndpoints,
    ...SynonymEndpoints,
    ...BannerEndpoints,
    ...CacheEndpoints,
    ...SettingEndpoints,
    ...LinkEndpoints,
    ...ContentEndpoints,
    errorReport: {
        POST: post((...args:HandlerArgs<undefined>):Promise<any> => {
            const props = getBody<Index<any>>(args);
            const html = render(ErrorReport, props);
            return sendEmail("Error Report", html, ["support@evilinnocence.com"])
        })
    }
}