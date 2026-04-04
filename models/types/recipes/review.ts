import { UseFormReturnType } from "@mantine/form";
import { IRecipe } from "./recipe";

export type RecipeStackType = "step-one" | "step-two" | "step-three" | "step-four" | "step-five";
//(step-one: Basic Info, step-two: Ingredients, step-three: Steps, step-four: Type & Tags, step-five: Privacy & Share)

export type RecipeFormType = UseFormReturnType<IRecipe, (values: IRecipe) => IRecipe>;

// Helper type for save result
export type SaveResult = Promise<{ saved: boolean, message: string }>;

export type RecipeFormStepState = 'untouched' | 'errors' | 'completed' | 'opened';