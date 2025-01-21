

import { IFamilyMember } from "./familyMember";
import { HeritageType } from "./inAppCreations/heritage";
import { IRecipe } from "./recipe";


export interface IFamily {
    name: string;
    _id: string;
    recipes: IRecipe[];
    familyMembers: IFamilyMember[];
    heritage: HeritageType[];
}