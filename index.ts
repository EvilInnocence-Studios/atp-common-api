import { setupMigrations as commonSetup, migrations as commonMigrations } from "./migrations";

export {apiConfig} from "./endpoints";

export const migrations = commonMigrations;
export const setupMigrations = commonSetup;
