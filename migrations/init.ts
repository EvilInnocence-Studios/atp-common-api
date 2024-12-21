import { Index } from "ts-functional/dist/types";
import { database } from "../../core/database";
import { IMigration } from "../../core/database.d";

const db = database();

const tagGroups:Index<string[]> = {
    "Figures"  : ["Wapi Pu","Vincent Parker","Vicky 4 Male","Vicky 3","Vicky 2","Vicky 1","Ugly Boy","Ug!","Toon Baby","The Girl 4","The Girl","The Freak","Terai Yuki 2","Sydney","Stephanie 3 Petite","Staci","Skye","Sara","Sam","Sadie","Rosy Cheeks Lina","Ralphling","Pygmy","Pretty3D Base (V4)","Pretty3D Base (V3)","Preteen Girl","Preteen Boy","Preschool Girl","Preschool Boy","PaperDoll Male","PaperDoll Female","P6 Kate","P6 Jessi","P6 James","P6 Ben","P5 Will","P5 Penny","P5 Judy","P5 Don","P4 Male","P4 Infant","P4 Girl","P4 Female","P4 Boy","Obama","Near Me","Nana","Minotaur","Millennium Baby 3","Miki 2","Miki 1","Mike 3","Mike 2","Mike 1","Maybe","Maya Doll","Matt 3","Mannequin","Maddie 3","Luke 3","Loik","Lil' Bub","Laura 3","LaRoo 2","Kyle 1.5","Kururu","Krystal SF","Krystal","Koshini 2","Koshini","Kit","Kiki","Jinkie","Jager","Ichiro 2","Ichiro","Hiro 4","Hiro 3","HER","Gumdrops","Gramps","Gloria","G2 Koji","G2 Kelvin","G2 Jessi","G2 James","Furrette","Furraldo","FemaSu","F202 Dollie","Evelinne","Eva","E.B.E.","Dennis","Decoco","David 3","CS Raptoid","Clark","Chip","Chibibel","Britta","Bong","Ball Joint Doll","Bacon","Apollo Maximus","Anime Doll","Amanda","Alice 2.0","Alice 1.5","Alexa 2","Aiko 4","Aiko 3","AF Diana","La Femme","Genesis 9","Genesis 8","Genesis 3","Dusk","SuzyQ 2","Michelle","Mike 4","Star","Cookie","Vicky 4","Dawn",],
    "Types"    : ["Dress",     "Shirt",     "Pants",      "Shoes",     "Accessory", "Hair",   "Prop",   "Poses",  "Materials",   "Character", "Morphs", "Utilities", "Sets"],
    "Genres"   : ["Fantasy",   "Sci-Fi",    "Historical", "Modern",    "Horror"],
    "Themes"   : ["Christmas", "Halloween", "Valentines"],
    "Programs" : ["Poser",     "DAZ Studio", "CrossDresser 2", "CrossDresser 3", "CrossDresser 4"],
};

export const init:IMigration = {
    down: () => {
        return db.schema
            .dropTableIfExists("tags")
            .dropTableIfExists("tagGroups");
    },
    up: () => {
        return db.schema
            .createTable("tagGroups", (table) => {
                table.increments("id").primary();
                table.string("name").notNullable();
            })
            .createTable("tags", (table) => {
                table.increments("id").primary();
                table.string("name").notNullable();
                table.integer("groupId").notNullable();
                table.foreign("groupId").references("tagGroups.id");
            })
            .then(() => db("tagGroups")
                .insert(Object.keys(tagGroups).map((name) => ({ name })), "*")
                .then((groups) => db("tags")
                    .insert(groups.reduce((acc, group) => [
                        ...acc,
                        ...tagGroups[group.name].map((tagName) => ({ name: tagName, groupId: group.id }))
                    ], []))
                )
            );
    }
}