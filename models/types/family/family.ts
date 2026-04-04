

import { HeritageType } from "../inAppCreations/heritage";
import { IFamilyMember } from "./familyMember";


export interface IFamily {
    name: string;
    _id: string;
    recipeIDs: string[];
    familyMembers: IFamilyMember[];
    heritage: HeritageType[];
}