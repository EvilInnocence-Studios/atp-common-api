import jwt from "jsonwebtoken";
import { secret } from "../../core/config";
import { error403 } from "../../core/express/errors";
import { getBody, getHeader, getParam, getQuery } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { executeDueTasks, executeTask } from "./runner";
import { ScheduledTaskService } from "./service";

export class ScheduledTaskHandlerClass {
    /**
     * Executes all due tasks (called periodically by AWS EventBridge or by admin)
     */
    public async executeAll(...args: HandlerArgs<undefined>): Promise<any> {
        const query: any = getQuery(args) || {};
        const body: any = getBody<any>(args) || {};
        const forceAll = query.force === "true" || body.force === true;

        const configuredSecret = process.env.SCHEDULED_TASK_SECRET;
        const providedSecret = getHeader("x-scheduled-task-secret")(args);
        const authHeader = getHeader("authorization")(args);

        let isAuthorized = process.env.ENV === "local";

        if (!isAuthorized && configuredSecret && providedSecret === configuredSecret) {
            isAuthorized = true;
        }

        if (!isAuthorized && authHeader) {
            const token = authHeader.split(" ")[1];
            if (token) {
                try {
                    const decoded = jwt.verify(token, secret()) as { userId?: string; uncached?: boolean };
                    if (decoded.userId || decoded.uncached) {
                        isAuthorized = true;
                    }
                } catch {
                    // Invalid token
                }
            }
        }

        const eventBridgeSource = getHeader("x-eventbridge-source")(args);
        if (!isAuthorized && !configuredSecret && eventBridgeSource === "aws.scheduler") {
            isAuthorized = true;
        }

        if (!isAuthorized) {
            throw error403;
        }

        const trigger = (authHeader ? "manual" : "eventbridge") as "manual" | "eventbridge";
        return executeDueTasks({
            forceAll,
            trigger
        });
    }

    @CheckPermissions("scheduledTask.view")
    public async search(...args: HandlerArgs<undefined>): Promise<any> {
        return ScheduledTaskService.search();
    }

    @CheckPermissions("scheduledTask.view")
    public async loadById(...args: HandlerArgs<undefined>): Promise<any> {
        const id = getParam<string>("id")(args);
        return ScheduledTaskService.loadById(id);
    }

    @CheckPermissions("scheduledTask.update")
    public async update(...args: HandlerArgs<undefined>): Promise<any> {
        const id = getParam<string>("id")(args);
        const body = getBody<any>(args);
        return ScheduledTaskService.update(id, body);
    }

    @CheckPermissions("scheduledTask.run")
    public async runSingle(...args: HandlerArgs<undefined>): Promise<any> {
        const id = getParam<string>("id")(args);
        return executeTask(id, "manual");
    }

    @CheckPermissions("scheduledTask.view")
    public async getLogs(...args: HandlerArgs<undefined>): Promise<any> {
        const id = getParam<string>("id")(args);
        const query: any = getQuery(args) || {};
        const limit = query.limit ? parseInt(String(query.limit), 10) : 50;
        const offset = query.offset ? parseInt(String(query.offset), 10) : 0;
        return ScheduledTaskService.getLogs(id, limit, offset);
    }
}

export const ScheduledTaskHandlers = new ScheduledTaskHandlerClass();
