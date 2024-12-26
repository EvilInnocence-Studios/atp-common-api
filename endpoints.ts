import { IApiConfig } from "../core/endpoints";
import { SynonymEndpoints } from "./synonym/endpoints";
import { TagEndpoints } from "./tag/endpoints";

export const apiConfig:IApiConfig = {
    ...TagEndpoints,
    ...SynonymEndpoints,
}