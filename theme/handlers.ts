import { pipeTo } from "ts-functional";
import { ITheme } from "../../common-shared/theme/types";
import { Query } from "../../core-shared/express/types";
import { getBody, getBodyParam, getParam } from "../../core/express/extractors";
import { HandlerArgs } from "../../core/express/types";
import { CheckPermissions } from "../../uac/permission/util";
import { Theme } from "./service";

class ThemeHandlerClass {
    @CheckPermissions("theme.create")
    public create (...args:HandlerArgs<Partial<ITheme>>):Promise<ITheme> {
        return pipeTo(Theme.create, getBody)(args);
    }

    @CheckPermissions("theme.view")
    public search (...args:HandlerArgs<undefined>):Promise<ITheme[]> {
        return pipeTo(Theme.search, getBody<Query>)(args);
    }

    @CheckPermissions("theme.view")
    public get (...args:HandlerArgs<undefined>):Promise<ITheme> {
        return pipeTo(Theme.loadById, getParam("themeId"))(args);
    }

    @CheckPermissions("theme.update")
    public update (...args:HandlerArgs<Partial<ITheme>>):Promise<ITheme> {
        return pipeTo(Theme.update, getParam("themeId"), getBody)(args);
    }

    @CheckPermissions("theme.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Theme.remove, getParam("themeId"))(args);
    }

    @CheckPermissions("theme.update")
    public uploadImage (...args:HandlerArgs<undefined>):Promise<ITheme> {
        return pipeTo(Theme.image.upload, getParam("themeId"), getBodyParam("overwrite"), getBody<File>)(args);
    }

    @CheckPermissions("theme.update")
    public removeImage (...args:HandlerArgs<undefined>):Promise<ITheme> {
        return pipeTo(Theme.image.remove, getParam("themeId"))(args);
    }

    @CheckPermissions("theme.update")
    public replaceImage (...args:HandlerArgs<undefined>):Promise<ITheme> {
        return pipeTo(Theme.image.replace, getParam("themeId"), getBody<File>)(args);
    }
}

export const ThemeHandlers = new ThemeHandlerClass();
