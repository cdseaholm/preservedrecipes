import { IComment } from "./comment";
import { IRecipeStep } from "./recipeStep";


export interface IRecipe {
    name: string;
    recipeType: string;
    image: string;
    creatorID: string;
    steps: IRecipeStep[];
    rating: number;
    comments: IComment[];
    public: boolean;
    secret: boolean;
    secretViewerIDs: string[]
}