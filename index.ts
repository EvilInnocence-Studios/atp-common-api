import { init, initSettings } from "../common/migrations/00-init";
import { addTagType } from "../common/migrations/01-addTagType";
import { updateContentType } from "../common/migrations/02-updateContentType";

export { apiConfig } from "./endpoints";

export const migrations = [init, addTagType, updateContentType];
export const setupMigrations = [init, initSettings];
