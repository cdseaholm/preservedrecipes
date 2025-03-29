'use client'

import { errorType } from "@/models/types/error";
import { IRecipe } from "@/models/types/recipe";
import { UseFormReturnType, useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ValidateNameAndDescription } from "../extensions/validate";
import { RecipeFormType } from "../recipeForm";
import EditRecipeForm from "./editRecipeForm";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useSession } from "next-auth/react";
import { AttemptEditRecipe } from "@/utils/apihelpers/edit/editRecipe";

export default function EditRecipeInit({ currentRecipe, handleSeeItem }: { currentRecipe: IRecipe, handleSeeItem: (index: number) => void }) {
    const { data: session } = useSession();
    const [changesMade, setChangesMade] = useState(false);
    const viewRecipeForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: currentRecipe.name,
            description: currentRecipe.description,
            ingredients: currentRecipe.ingredients,
            steps: currentRecipe.steps,
            type: `Misc`,
            tags: currentRecipe.tags,
            secret: currentRecipe.secret,
            secretViewerIDs: currentRecipe.secretViewerIDs
        },
        validate: {
            name: (value) => (
                value ? (value.length > 100 ? 'Invalid name too long' : null) : 'Name cannot be empty'
            ),
            description: (value: string) => (
                value ? ((value.length > 1000) ? 'Description too long, try something short and sweet just to get the point across' : null) : 'Description cannot be empty'
            ),
            ingredients: {
                ingredient: (value) =>
                    value ? ((value.length === 0 || value === '') ? `Can't be empty` : null) : 'Cannot be empty',
                quantity: (value) =>
                    value ? ((value.length === 0 || value === '') ? `Can't be empty` : null) : 'Cannot be empty',
                quantityType: (value) =>
                    value ? ((value.length === 0 || value === '') ? `Can't be empty` : null) : 'Cannot be empty'
            },
            steps: {
                stepId: (_value) => null,
                stepType: (_value) => null,
                description: (value) =>
                    value ? ((value.length === 0 || value[0] === '') ? `Each step needs some instruction` : null) : 'Description cannot be empty',
                ingredients: (_value) => null
            },
            type: (_value: string) => null,
            tags: (_value: string[]) => null,
            secretViewerIDs: (value) => {
                for (let val of value) {
                    if (!/^\S+@\S+$/.test(val)) {
                        return 'Invalid email';
                    }
                }
                return null;
            }
        }
    });
    const [childErrors, setChildErrors] = useState<errorType[]>([]);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async ({ viewRecipeForm }: { viewRecipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>; }) => {
        setLoading(true);
        try {
            setChildErrors([]);

            if (!session) {
                toast.warning("You need to be signed in to edit a recipe!");
                setLoading(false);
                return false;
            }

            const validation = await ValidateNameAndDescription(viewRecipeForm.getValues().name, viewRecipeForm.getValues().description);

            if (validation && validation.length > 0) {
                setChildErrors(validation);
                setLoading(false);
                return false;
            }

            if (!viewRecipeForm) {
                toast.error("Something is wrong with your Recipe information, please try again");
                setLoading(false);
                return false;
            }

            const initialValues = viewRecipeForm.getValues();
            const recipeName = initialValues.name;
            const recipeDescription = initialValues.description;
            const recipeIngredients = initialValues.ingredients;
            const recipeSteps = initialValues.steps;
            const recipeTags = initialValues.tags;
            const recipeType = initialValues.type;
            const recipeSecret = initialValues.secret;
            const recipeSecretViewerIDs = recipeSecret ? initialValues.secretViewerIDs : [] as string[];

            if (recipeIngredients.length <= 0 || recipeSteps.length <= 0) {
                const userConfirmed = window.confirm(`Either Recipe Ingredients or Steps are empty. Are you sure you want to save your recipe?`);
                if (!userConfirmed) {
                    setLoading(false);
                    return false;
                }
            }

            const newRecipe = {
                _id: currentRecipe._id,
                name: recipeName,
                image: currentRecipe.image,
                creatorID: currentRecipe.creatorID,
                rating: currentRecipe.rating,
                comments: currentRecipe.comments,
                description: recipeDescription,
                ingredients: recipeIngredients,
                steps: recipeSteps,
                tags: recipeTags,
                recipeType: recipeType,
                secretViewerIDs: recipeSecretViewerIDs,
                secret: recipeSecret,
            } as IRecipe;

            if (newRecipe === currentRecipe) {
                toast.info('No changes made');
                setLoading(false);
                return false;
            }

            let editAttempt = await AttemptEditRecipe({ recipeToEdit: newRecipe }) as { status: boolean, message: string };

            let attemptStatus = editAttempt ? editAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error editing recipe');
                console.log(editAttempt ? editAttempt.message : 'Error with message');
                setLoading(false);
                return false;
            }

            toast.success('Successfully edited recipe!');
            setLoading(false);
            handleSeeItem(-1)
            return true;

        } catch (error) {
            console.error('Error editing recipe:', error);
            setLoading(false);
            return false;
        }
    };

    const handleChildErrors = (errorsToSet: errorType[] | null) => {
        if (errorsToSet) {
            setChildErrors(errorsToSet);
        } else {
            setChildErrors([]);
        }
    }

    useEffect(() => {
        if (viewRecipeForm.isDirty()) {
            setChangesMade(true);
            console.log(viewRecipeForm.getTransformedValues())
        }
    }, [viewRecipeForm, setChangesMade])

    return (
        loading ? (
            <LoadingSpinner screen={true} />
        ) : (
            <EditRecipeForm handleUpdate={handleUpdate} childErrors={childErrors} handleChildErrors={handleChildErrors} viewRecipeForm={viewRecipeForm} changesMade={changesMade} handleSeeItem={handleSeeItem} />
        )
    )
}