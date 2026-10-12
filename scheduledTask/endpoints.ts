import { get, patch, post } from "../../core/express/wrappers";
import { ScheduledTaskHandlers } from "./handlers";

export const ScheduledTaskEndpoints = {
    "scheduled-tasks": {
        POST: post(ScheduledTaskHandlers.executeAll),
        GET: get(ScheduledTaskHandlers.search),
        ":id": {
            GET: get(ScheduledTaskHandlers.loadById),
            PATCH: patch(ScheduledTaskHandlers.update),
            run: {
                POST: post(ScheduledTaskHandlers.runSingle),
            },
            logs: {
                GET: get(ScheduledTaskHandlers.getLogs),
            }
        }
    }
};
