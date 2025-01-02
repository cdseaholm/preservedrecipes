import { IngredientType } from "./ingredientType";

export type StepType = {
    stepId: number;
    stepType: string;
    description: string;
    ingredients: IngredientType[];
}