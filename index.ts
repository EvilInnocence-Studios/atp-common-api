import { FieldRegistry } from "../core/express/util";
import { init, initSettings } from "../common/migrations/00-init";
import { addTagType } from "../common/migrations/01-addTagType";
import { updateContentType } from "../common/migrations/02-updateContentType";

export { apiConfig } from "./endpoints";

export const migrations = [init, addTagType, updateContentType];
export const setupMigrations = [init, initSettings];

FieldRegistry.register("settings", {
    create: ["key", "value"],
    update: ["key", "value"]
});
FieldRegistry.register("tagGroups", {
    create: ["name", "filterable", "visible", "order", "type"],
    update: ["name", "filterable", "visible", "order", "type"]
});
FieldRegistry.register("tags", {
    create: ["name", "groupId", "filterable", "order"],
    update: ["name", "filterable", "order"]
});
FieldRegistry.register("synonyms", {
    create: ["canonical", "synonym"],
    update: ["canonical", "synonym"]
});
FieldRegistry.register("banners", {
    create: ["tag", "name", "title", "description", "url", "link", "activeFrom", "activeTo", "order", "buttonText", "buttonLink", "buttonLocation", "buttonTextAlt", "buttonLinkAlt", "buttonLocationAlt"],
    update: ["tag", "name", "title", "description", "url", "link", "activeFrom", "activeTo", "order", "buttonText", "buttonLink", "buttonLocation", "buttonTextAlt", "buttonLinkAlt", "buttonLocationAlt"]
});
FieldRegistry.register("linkLists", {
    create: ["name", "key"],
    update: ["name", "key"]
});
FieldRegistry.register("links", {
    create: ["listId", "text", "url", "subMenuKey", "order"],
    update: ["text", "url", "subMenuKey", "order"]
});
FieldRegistry.register("content", {
    create: ["slug", "title", "type", "content", "layout", "format", "enabled", "publishDate"],
    update: ["slug", "title", "type", "content", "layout", "format", "enabled", "publishDate"]
});
FieldRegistry.register("media", {
    create: ["url", "altText", "title", "caption"],
    update: ["url", "altText", "title", "caption"]
});
FieldRegistry.register("plugins", {
    create: ["group", "key", "sortOrder", "settings"],
    update: ["group", "key", "sortOrder", "settings"]
});
