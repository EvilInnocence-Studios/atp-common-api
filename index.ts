import { FieldRegistry } from "@core/express/util";
import { init, initSettings } from "../common/migrations/00-init";
import { addTagType } from "../common/migrations/01-addTagType";
import { updateContentType } from "../common/migrations/02-updateContentType";

export { apiConfig } from "./endpoints";

export const migrations = [init, addTagType, updateContentType];
export const setupMigrations = [init, initSettings];

FieldRegistry.register("settings", ["key", "value"]);
FieldRegistry.register("tagGroups", ["name", "filterable", "visible", "order", "type"]);
FieldRegistry.register("tags", ["name", "filterable", "order"]);
FieldRegistry.register("synonyms", ["canonical", "synonym"]);
FieldRegistry.register("banners", ["tag", "name", "title", "description", "url", "link", "activeFrom", "activeTo", "order", "buttonText", "buttonLink", "buttonLocation", "buttonTextAlt", "buttonLinkAlt", "buttonLocationAlt"]);
FieldRegistry.register("linkLists", ["name", "key"]);
FieldRegistry.register("links", ["text", "url", "subMenuKey", "order"]);
FieldRegistry.register("content", ["slug", "title", "type", "content", "layout", "format", "enabled", "publishDate"]);
FieldRegistry.register("media", ["url", "altText", "title", "caption"]);
FieldRegistry.register("plugins", ["group", "key", "sortOrder", "settings"]);
