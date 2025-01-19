
import { HeritageType } from "./inAppCreations/heritage";
import { IPermissions } from "./permission";
import { IRecipe } from "./recipe";


export interface IFamily {
    name: string;
    _id: string;
    recipes: IRecipe[];
    familyMemberIDs: IPermissions[];
    heritage: HeritageType[];
}