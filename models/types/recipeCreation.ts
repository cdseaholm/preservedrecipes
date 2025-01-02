import { IngredientType } from "./ingredientType";
import { StepType } from "./stepType";

export type RecipeCreation = {
    name: string;
    description: string;
    ingredients: IngredientType[];
    steps: StepType[]
}