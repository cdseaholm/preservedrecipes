import { errorType } from "@/models/types/error";
import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";
import { UseFormReturnType } from "@mantine/form";
import { CloseChildAndSaveEdits, CloseChildAndSaveAddition } from "../extensions/functions";
import { ValdiateViewerEmails } from "../extensions/validate";
import { RecipeFormType } from "../recipeForm";

export const handleCloseChildAndSaveEdits = async ({ which, newVals, itemId, form }: { which: string, newVals: IngredientType[] | StepType[], itemId: number, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => {

    try {

        const attempt = await CloseChildAndSaveEdits({ which: which, form: form, newVals: newVals, itemId: itemId }) as errorType[];

        if (attempt && attempt.length > 0) {
            return { saved: false, message: 'Error saving' };
        } else {
            if (which === 'steps') {
                return { saved: true, message: 'close steps' }
            } else {
                return { saved: true, message: 'no message' }
            }
        }

    } catch (error: any) {
        console.log(error);
        return { saved: false, message: 'Error catch' }
    }
}

export const handleCloseChildAndSaveAdditions = async ({ which, newVals, itemId, form, stepId }: { which: string, newVals: IngredientType[] | StepType[], itemId: number, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, stepId: null | number }) => {

    try {

        const attempt = await CloseChildAndSaveAddition({ which: which, form: form, newVals: newVals, itemId: itemId, stepId: stepId }) as errorType[];

        if (attempt && attempt.length > 0) {
            return { saved: false, message: 'Error saving', childErrors: attempt };
        } else {
            if (which === 'steps') {
                return { saved: true, message: 'close steps', childErrors: [] as errorType[] }
            } else {
                return { saved: true, message: 'no message', childErrors: [] as errorType[] }
            }
        }

    } catch (error: any) {
        console.log(error);
        return { saved: false, message: 'Error catch', childErrors: [] as errorType[] }
    }
}

export const handleCloseViewers = async ({ form }: { form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => {
    const validateViewers = await ValdiateViewerEmails(form.getValues().secretViewerIDs);
    if (validateViewers.length > 0) {
        return {success: true, childErrors: validateViewers};
    } else {
        return {success: false, childErrors: [] as errorType[]};
    }
}