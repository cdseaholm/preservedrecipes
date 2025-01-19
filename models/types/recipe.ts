import { IComment } from "./comment";
import { IngredientType } from "./ingredientType";
import { StepType } from "./stepType";


export interface IRecipe {
    _id: string
    name: string;
    recipeType: string;
    image: string;
    creatorID: string;
    steps: StepType[];
    rating: number;
    comments: IComment[];
    secret: boolean;
    secretViewerIDs: string[];
    tags: string[];
    ingredients: IngredientType[];
    description: string
}