import { init, initSettings } from "./migrations/00-init";
import { addTagType } from "./migrations/01-addTagType";
import { updateContentType } from "./migrations/02-updateContentType";

export { apiConfig } from "./endpoints";

export const migrations = [init, addTagType, updateContentType];
export const setupMigrations = [init, initSettings];
