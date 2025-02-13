import { pipeTo } from "serverless-api-boilerplate";
import { ISynonym, NewSynonym } from "../../common-shared/synonym/types";
import { database } from "../../core/database";
import { HandlerArgs } from "../../core/express/types";
import { getBody, getParam } from "../../core/express/extractors";
import { CheckPermissions } from "../../uac/permission/util";
import { Synonym } from "./service";

const db = database();

class SynonymHandlerClass {
    @CheckPermissions("synonym.view")
    public search():Promise<ISynonym[]> {
        return Synonym.search();
    }

    @CheckPermissions("synonym.create")
    public create(...args:HandlerArgs<NewSynonym>):Promise<ISynonym> {
        return Synonym.create(getBody(args));
    }

    @CheckPermissions("synonym.update")
    public update(...args:HandlerArgs<Partial<ISynonym>>):Promise<ISynonym> {
        return pipeTo(Synonym.update, getParam("synonymId"), getBody)(args);
    }

    @CheckPermissions("synonym.delete")
    public remove(...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Synonym.remove, getParam("synonymId"))(args);
    }
}

export const SynonymHandlers = new SynonymHandlerClass();
