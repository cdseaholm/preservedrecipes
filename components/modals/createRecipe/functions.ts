import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";
import { UseFormReturnType } from "@mantine/form";
import { ValidateIngredients, ValidateSteps } from "./validate";
import { errorType } from "@/models/types/error";
import { RecipeCreation } from "@/models/types/recipeCreation";

export async function CloseChildAndSaveAddition({ which, form, newVals, itemId, stepId }: { form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>, which: string, newVals: IngredientType[] | StepType[], itemId: number, stepId: number | null }) {

    if (which === 'ingredients') {

        const ingItem = form.getValues().ingredients[itemId]
        const ingId = ingItem ? ingItem.ingredientId : -1;
        const result = await ValidateIngredients(ingItem, ingId)

        console.log(result)

        if (result) {

            return result;

        } else {

            if (stepId !== null) {
                form.insertListItem(`steps.${stepId}.ingredients`, ingItem);
            };

            return [] as errorType[]
        }

    } else if (which === 'steps') {

        const stepItem = form.getValues().steps[itemId]
        const localErrors = await ValidateSteps(stepItem, stepItem.stepId);


        if (localErrors.length > 0) {

            return localErrors;

        } else {

            let ingVals = newVals as IngredientType[]
            form.setFieldValue(`steps.${stepItem.stepId}.ingredients`, ingVals);

            return [] as errorType[]
        }
    }
};


export async function CloseChildAndSaveEdits({ which, form, newVals, itemId }: { form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>, which: string, newVals: IngredientType[] | StepType[], itemId: number }) {

    if (which === 'ingredients') {

        const ingItem = form.getValues().ingredients[itemId]
        const ingToEditId = ingItem.ingredientId;
        const localErrors = await ValidateIngredients(ingItem, ingItem.ingredientId);
        console.log('localErrors: ', localErrors)
        if (localErrors.length > 0) {

            return localErrors;

        } else {

            const steps = form.getValues().steps as StepType[];
            if (steps.length > 0) {
                steps.map((step) => {
                    const thisIngs = step.ingredients;
                    thisIngs.forEach((ing) => {
                        if (ing.ingredientId === ingItem.ingredientId) {
                            form.setFieldValue(`steps.${step.stepId}.ingredients.${ingToEditId}`, ingItem);
                        }
                    })
                })
            };

            return [] as errorType[]
        }

    } else if (which === 'steps') {

        const stepItem = form.getValues().steps[itemId]
        const stepEditId = stepItem ? stepItem.stepId : -1;
        const localErrors = await ValidateSteps(stepItem, stepEditId);


        if (localErrors.length > 0) {

            return localErrors;

        } else {

            let ingVals = newVals as IngredientType[];
            stepItem.ingredients = ingVals ? ingVals : [] as IngredientType[];
            form.setFieldValue(`steps.${stepEditId}.ingredients`, ingVals);

            return [] as errorType[]
        }
    }
};

export async function HandleAddChildValues({ which, form }: { which: string, form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation> }) {
    if (which === 'ingredients') {
        let id = form.getValues().ingredients.length;
        let blankIngredient = { ingredientId: id, ingredient: '', quantity: '', quantityType: '' } as IngredientType
        form.insertListItem('ingredients', blankIngredient);
        return blankIngredient;
    } else if (which === 'steps') {
        let id = form.getValues().steps.length;
        //later on add images, videos, etc for steptype
        let blankStep = { stepId: id, stepType: 'text', description: '' as string, ingredients: [] as IngredientType[] } as StepType
        form.insertListItem('steps', blankStep);
        return blankStep;
    }
}

export async function RemoveChildValues({ which, form, index }: { which: string, form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>, index: number }) {
    const userConfirmed = window.confirm(`Are you sure you want to delete this ${which === 'steps' ? 'step' : 'ingredient'}?`);
    if (!userConfirmed) {
        return;
    }
    if (which === 'ingredients') {
        const steps = form.getValues().steps;
        steps.forEach((step, stepIndex) => {
            const ingredientIndex = step.ingredients.findIndex((ing) => ing.ingredientId === index);
            if (ingredientIndex !== -1) {
                form.removeListItem(`steps.${stepIndex}.ingredients`, ingredientIndex);
            }
        });
        form.removeListItem('ingredients', index);
    } else if (which === 'steps') {
        form.removeListItem('steps', index);
    }
}