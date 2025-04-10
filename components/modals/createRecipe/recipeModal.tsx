'use client'

import { toast } from "sonner";
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";
import { useState } from "react";
import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";
import { errorType } from "@/models/types/error";
import { ValdiateViewerEmails, ValidateNameAndDescription } from "../../forms/recipe/extensions/validate";
import { AttemptCreateRecipe } from "@/utils/apihelpers/create/createRecipe";
import RecipeForm, { RecipeFormType } from "@/components/forms/recipe/recipeForm";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { UseFormReturnType } from "@mantine/form";
import { CloseChildAndSaveAddition, CloseChildAndSaveEdits } from "@/components/forms/recipe/extensions/functions";
import { useUserStore } from "@/context/userStore";

export default function ParentRecipeModal({ session, open, handleCloseCreateRecipe }: { session: Session | null, open: boolean, handleCloseCreateRecipe: () => void }) {

    const width = useStateStore(state => state.widthQuery);
    const [loading, setLoading] = useState<boolean>(false);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const [childErrors, setChildErrors] = useState<errorType[]>([]);
    const userInfo = useUserStore(state => state.userInfo);

    const handleCreateRecipe = async ({ recipeForm }: { recipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => {
        setLoading(true);
        try {
            setChildErrors([]);

            if (!session) {
                toast.warning("You need to be signed in to make a recipe!");
                setLoading(false);
                return false;
            }

            const validation = await ValidateNameAndDescription(recipeForm.getValues().name, recipeForm.getValues().description);

            if (validation && validation.length > 0) {
                setChildErrors(validation);
                setLoading(false);
                return false;
            }

            if (!recipeForm) {
                toast.error("Something is wrong with your Recipe information, please try again");
                setLoading(false);
                return false;
            }

            const initialValues = recipeForm.getValues();
            const recipeName = initialValues.name;
            const recipeDescription = initialValues.description;
            const recipeIngredients = initialValues.ingredients;
            const recipeSteps = initialValues.steps;
            const recipeTags = initialValues.tags;
            const recipeType = initialValues.type;
            const recipeSecret = initialValues.secret;
            const recipeSecretViewerIDs = recipeSecret ? initialValues.secretViewerIDs : [] as string[];
            const familyRecipe = initialValues.familyRecipe;

            if (recipeIngredients.length <= 0 || recipeSteps.length <= 0) {
                const userConfirmed = window.confirm(`Either Recipe Ingredients or Steps are empty. Are you sure you want to save your recipe?`);
                if (!userConfirmed) {
                    setLoading(false);
                    return false;
                }
            }

            const newRecipe = {
                name: recipeName,
                description: recipeDescription,
                ingredients: recipeIngredients,
                steps: recipeSteps,
                tags: recipeTags,
                type: recipeType,
                secretViewerIDs: recipeSecretViewerIDs,
                secret: recipeSecret,
                familyRecipe: familyRecipe
            } as RecipeFormType;

            let creationAttempt = await AttemptCreateRecipe({ recipeToAdd: newRecipe }) as { status: boolean, message: string };

            let attemptStatus = creationAttempt ? creationAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error creating recipe');
                console.log(creationAttempt ? creationAttempt.message : 'Error with message');
                setLoading(false);
                return false;
            }

            toast.success('Successfully created recipe!');
            resetZoom(width, false);
            handleCloseCreateRecipe();
            setLoading(false);
            return true;

        } catch (error) {
            console.error('Error creating recipe:', error);
            setLoading(false);
            return false;
        }
    }

    const handleCloseChildAndSaveAdditions = async ({ which, newVals, itemId, form, stepId }: { which: string, newVals: IngredientType[] | StepType[], itemId: number, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, stepId: null | number }) => {

        setChildErrors([]);

        try {

            const attempt = await CloseChildAndSaveAddition({ which: which, form: form, newVals: newVals, itemId: itemId, stepId: stepId }) as errorType[];

            if (attempt && attempt.length > 0) {
                setChildErrors(attempt);
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

    const handleCloseChildAndSaveEdits = async ({ which, newVals, itemId, form }: { which: string, newVals: IngredientType[] | StepType[], itemId: number, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => {

        setChildErrors([]);

        try {

            const attempt = await CloseChildAndSaveEdits({ which: which, form: form, newVals: newVals, itemId: itemId }) as errorType[];

            if (attempt && attempt.length > 0) {
                setChildErrors(attempt);
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

    const handleCloseViewers = async ({ form }: { form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => {
        setChildErrors([])
        const validateViewers = await ValdiateViewerEmails(form.getValues().secretViewerIDs);
        if (validateViewers.length > 0) {
            setChildErrors(validateViewers);
            return true;
        } else {
            return false;
        }
    }

    const resetChildErrors = () => {
        setChildErrors([]);
    }

    return (
        loading ? (
            <LoadingSpinner screen={false} />
        ) : (
            <RecipeForm handleCreateRecipe={handleCreateRecipe} handleCloseCreateRecipe={handleCloseCreateRecipe} childErrors={childErrors} resetChildErrors={resetChildErrors} handleCloseChildAndSaveAdditions={handleCloseChildAndSaveAdditions} open={open} handleCloseChildAndSaveEdits={handleCloseChildAndSaveEdits} handleCloseViewers={handleCloseViewers} userInfo={userInfo} />
        )
    )
}