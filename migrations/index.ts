import { init } from "./00-init";
import { addLayouts } from "./01-add-layouts";

export const migrations = [
    init,
    addLayouts,
];
