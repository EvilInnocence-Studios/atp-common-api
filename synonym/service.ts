import { ISynonym } from "../../common-shared/synonym/types";
import { basicCrudService } from "../../core/express/service/common";

export const Synonym = {
    ...basicCrudService<ISynonym>("synonyms", "canonical"),
}