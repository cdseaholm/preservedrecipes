import { IRecipe } from "./recipe";


export interface IFamily {
    name: string;
    _id: string;
    recipes: IRecipe[];
    familyMemberIDs: string[]
}