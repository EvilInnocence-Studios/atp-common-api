import { IApiConfig } from "../core/endpoints";
import { TagEndpoints } from "./tag/endpoints";

export const apiConfig:IApiConfig = {
    ...TagEndpoints,
}