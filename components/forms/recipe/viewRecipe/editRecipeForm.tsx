'use client'

import { useStateStore } from "@/context/stateStore";
import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";
import { Modal, useModalsStack } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form";
import InfoPopover from "../../../popovers/infoPopover";
import { errorType } from "@/models/types/error";
import AddIngredients from "../extensions/ingredients/addIngredients";
import EditIngredients from "../extensions/ingredients/editIngredients";
import AddSteps from "../extensions/steps/addSteps";
import EditSteps from "../extensions/steps/editSteps";
import RecipeViewers from "../extensions/viewers";
import MainRecipeForm from "../extensions/mainRecipeForm";
import { useState } from "react";
import { toast } from "sonner";
import { HandleAddChildValues, RemoveChildValues } from "../extensions/functions";
import ViewSpecificIitemHead from "@/components/templates/viewSpecificItemHead";
import { handleCloseChildAndSaveAdditions, handleCloseChildAndSaveEdits, handleCloseViewers } from "./functions";

export type RecipeFormType = {
    name: string;
    description: string;
    ingredients: IngredientType[];
    steps: StepType[];
    type: string;
    tags: string[];
    secret: boolean;
    secretViewerIDs: string[];
}


export default function EditRecipeForm({
    handleUpdate,
    childErrors,
    handleChildErrors,
    viewRecipeForm,
    changesMade,
    handleSeeItem
}: {
    handleUpdate: ({ viewRecipeForm }: { viewRecipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => Promise<boolean>,
    childErrors: errorType[],
    handleChildErrors: (errorsToSet: errorType[] | null) => void,
    viewRecipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>,
    changesMade: boolean,
    handleSeeItem: (index: number) => void
}) {

    const width = useStateStore(state => state.widthQuery);
    const stack = useModalsStack(['step', 'ingredient', 'edit-step', 'edit-ingredient', 'add-viewers']);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const [valuesUsed, setValuesUsed] = useState<IngredientType[]>([] as IngredientType[]);
    const [viewersCurr, setViewersCurr] = useState<string[]>([])
    const handleSetValuesUsed = (newVals: IngredientType[]) => {
        setValuesUsed([...newVals]);
    };

    const ingredientPills = viewRecipeForm.getValues().ingredients.map((ingredient) => {
        return ingredient
    });
    const stepPills = viewRecipeForm.getValues().steps.map((step) => {
        return step
    });

    const [ingredientCopy, setIngredientCopy] = useState<IngredientType | null>(null);
    const [stepCopy, setStepCopy] = useState<StepType | null>(null);

    const addChildValues = async (which: string) => {
        const newVal = await HandleAddChildValues({ which: which, form: viewRecipeForm }) as StepType | IngredientType;
        if (which === 'steps') {
            const stepCopy = newVal as StepType;
            setStepCopy(stepCopy)
        }
    };

    const handleRemoveChildValue = async (which: string, index: number) => {
        await RemoveChildValues({ which: which, form: viewRecipeForm, index: index });

        if (which === 'ingredients') {
            stack.close('edit-ingredient');
        } else if (which === 'steps') {
            stack.close('edit-step');
        }
        handleChildErrors(null)
    };

    const handleCancel = () => {
        viewRecipeForm.reset();
        viewRecipeForm.clearErrors();
        resetZoom(width, false);
        stack.closeAll();
        handleChildErrors(null)
        toast.info("Cancelled Creating Recipe");
    }

    const handleCloseChildAndSaveAdditionsInit = async (which: string, newVals: IngredientType[] | StepType[], itemId: number) => {

        handleChildErrors(null);

        let stepId = null;
        if (stack.state.step === true) {
            stepId = stepCopy?.stepId as number;
        }

        const saved = await handleCloseChildAndSaveAdditions({ stepId: stepId, which: which, newVals: newVals, itemId: itemId, form: viewRecipeForm }) as { saved: boolean, message: string, childErrors: errorType[] };

        if (!saved) {
            console.log('Issue saving')
            return;
        }

        if (saved.saved === false) {
            console.log('Returned false')
            handleChildErrors(saved.childErrors)
            return;
        } else {
            if (saved.message === 'close steps') {
                setStepCopy(null);
                setValuesUsed([] as IngredientType[])
                stack.close('step');
                toast.info('Steps Saved');
            } else {
                stack.close('ingredient');
                if (stack.state.step === true) {
                    const item = viewRecipeForm.getValues().ingredients[itemId];
                    const newIngVals = [...valuesUsed, item] as IngredientType[]
                    handleSetValuesUsed(newIngVals)
                    stack.open('step');
                }
                if (stack.state["edit-step"] === true) {
                    const item = viewRecipeForm.getValues().steps[itemId];
                    const newIngVals = [...valuesUsed, item] as IngredientType[]
                    handleSetValuesUsed(newIngVals)
                    stack.open('edit-step');
                }
                toast.info('Ingredient Saved');
            }
            return;
        }
    }

    const handleCloseChildAndSaveEditsInit = async (which: string, newVals: IngredientType[] | StepType[], itemId: number) => {

        handleChildErrors(null);
        
        const saved = await handleCloseChildAndSaveEdits({ which: which, newVals: newVals, itemId: itemId, form: viewRecipeForm }) as { saved: boolean, message: string, childErrors: errorType[] };

        if (!saved) {
            console.log('Issue saving')
            return;
        }

        if (saved.saved === false) {
            console.log('Returned false')
            handleChildErrors(saved.childErrors)
            return;
        } else {
            if (which === 'steps') {
                setStepCopy(null);
                setValuesUsed([] as IngredientType[])
                stack.close('edit-step');
                toast.info('Step Saved');
            } else {
                setIngredientCopy(null)
                stack.close('edit-ingredient');
                toast.info('Ingredient Saved');
            }
            handleChildErrors(null);
            return;
        }
    }

    const handleCancelAdd = (which: string, currNewIndex: number) => {
        if (which === 'steps') {
            viewRecipeForm.removeListItem(`steps`, currNewIndex);
            setStepCopy(null);
            setValuesUsed([] as IngredientType[])
            stack.close('step');
        } else {
            viewRecipeForm.removeListItem(`ingredients`, currNewIndex);
            setIngredientCopy(null);
            stack.close('ingredient');
            if (stepCopy !== null) {
                stack.open('step')
            }
        }
        handleChildErrors(null)
    };

    const handleCancelEdit = (which: string, currNewIndex: number) => {
        if (which === 'steps') {
            let resetStep = stepCopy;
            if (resetStep === null) {
                toast.error('Error canceling');
                return;
            }
            viewRecipeForm.setFieldValue(`steps.${currNewIndex}`, resetStep);
            setStepCopy(null);
            setValuesUsed([] as IngredientType[])
            stack.close('edit-step');
        } else if (which === 'ingredients') {
            viewRecipeForm.setFieldValue(`ingredients.${currNewIndex}`, ingredientCopy);
            setIngredientCopy(null)
            stack.close('edit-ingredient');
        }
        handleChildErrors(null)
    }

    const handleOpenAdd = (which: string) => {
        if (which === 'ingredients') {
            addChildValues('ingredients');
            stack.open('ingredient');
        } else if (which === 'steps') {
            addChildValues('steps');
            stack.open('step');
        }
    };

    const handleOpenEdit = (which: string, index: number) => {
        if (which === 'ingredients') {
            setIngredientCopy(viewRecipeForm.getValues().ingredients[index]);
            stack.open('edit-ingredient');
        } else if (which === 'steps') {
            setStepCopy(viewRecipeForm.getValues().steps[index]);
            setValuesUsed(viewRecipeForm.getValues().steps[index].ingredients)
            stack.open('edit-step')
        }
    }

    const handleOpenViewers = () => {
        setViewersCurr(viewRecipeForm.getValues().secretViewerIDs)
        stack.open('add-viewers');
    };

    const handleCloseViewersInit = async () => {
        handleChildErrors(null);
        const validateErrors = await handleCloseViewers({ form: viewRecipeForm }) as { success: boolean, childErrors: errorType[] };
        if (validateErrors) {
            handleChildErrors(validateErrors.childErrors)
            return;
        } else {
            stack.close('add-viewers');
        }
    }

    const handleCancelViewers = () => {
        viewRecipeForm.setFieldValue(`secretViewerIDs`, viewersCurr);
        setViewersCurr([]);
        stack.close('add-viewers');
    }

    const handleUpdateRecipe = async () => {
        const created = await handleUpdate({ viewRecipeForm }) as boolean;
        if (created) {
            stack.closeAll();
            viewRecipeForm.reset();
            viewRecipeForm.clearErrors();
            handleSeeItem(-1)
        } else {
            return;
        }
    }

    return (
        <Modal.Stack>
            <ViewSpecificIitemHead handleSeeItem={handleSeeItem} saveItemChanges={handleUpdateRecipe} changesMade={changesMade} />
            <MainRecipeForm handleCancel={handleCancel} handleCreateRecipe={handleUpdateRecipe} errors={childErrors} recipeForm={viewRecipeForm} stepPills={stepPills} ingredientPills={ingredientPills} handleOpenViewers={handleOpenViewers} secret={viewRecipeForm.getValues().secret} handleOpenAdd={handleOpenAdd} handleEditToggle={handleOpenEdit} creating={false} handleEditRecipe={handleUpdateRecipe}/>

            <Modal {...stack.register('ingredient')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Create an Ingredient" infoOne="Here you can add ingredients, add the ingredient to a step within the recipe by selecting a step that is already made." infoTwo="If you're unsure where to begin you can add ingredients here first, or click BACK and add steps first and add ingredients to each step!" />
            }>
                <AddIngredients handleCloseChildAndSave={handleCloseChildAndSaveAdditionsInit} form={viewRecipeForm} handleCancelChild={handleCancelAdd} errors={childErrors} thisIngredient={viewRecipeForm.getValues().ingredients[viewRecipeForm.getValues().ingredients.length - 1]} />
            </Modal>

            <Modal {...stack.register('edit-ingredient')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Edit Recipe Ingredient" infoOne="Here you can edit ingredients, remove them by clicking delete, or just edit them directly" infoTwo="If you're unsure where to begin you can add ingredients here first, or click BACK and add steps first and add ingredients to each step!" />
            }>
                <EditIngredients handleCloseChildAndSave={handleCloseChildAndSaveEditsInit} form={viewRecipeForm} handleCancelChild={handleCancelEdit} handleRemoveChildValue={handleRemoveChildValue} errors={childErrors} thisItem={ingredientCopy ? viewRecipeForm.getValues().ingredients[ingredientCopy.ingredientId] : null} />
            </Modal>

            <Modal {...stack.register('step')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Create Recipe Step" infoOne="Here you can add steps, add ingredients to the step by selecting an ingredient from previously used ones or make a new one. The step direction cannot be empty as you need to give some sort of direction." infoTwo="If you're unsure where to begin you can give the step some directions then begin to add ingredients that this step requires!" />
            } py={'md'} px={'xs'}>
                <AddSteps handleCloseChildAndSave={handleCloseChildAndSaveAdditionsInit} form={viewRecipeForm} handleCancelChild={handleCancelAdd} errors={childErrors} ingredientPills={ingredientPills} handleOpenAdd={handleOpenAdd} thisStep={viewRecipeForm.getValues().steps[viewRecipeForm.getValues().steps.length - 1]} valuesUsed={valuesUsed} handleSetValuesUsed={handleSetValuesUsed} />
            </Modal>

            <Modal {...stack.register('edit-step')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Edit Recipe Steps" infoOne="Here you can edit steps, remove them by clicking delete, or just edit them directly" infoTwo="If you're unsure where to begin you can give the step some directions then begin to add ingredients that this step requires!" />
            } py={'md'} px={'xs'}>
                <EditSteps handleCloseChildAndSave={handleCloseChildAndSaveEditsInit} form={viewRecipeForm} handleCancelChild={handleCancelEdit} handleRemoveChildValue={handleRemoveChildValue} errors={childErrors} ingredientPills={ingredientPills} handleOpenAdd={handleOpenAdd} handleSetValuesUsed={handleSetValuesUsed} valuesUsed={valuesUsed} thisItem={stepCopy ? viewRecipeForm.getValues().steps[stepCopy.stepId] : null} />
            </Modal>

            <Modal {...stack.register('add-viewers')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Edit Recipe Steps" infoOne="Here you can edit and add viewers to this recipe. Make sure the viewer you're adding has an account, then add their email address. " infoTwo="Be aware this recipe must be private." />
            } py={'md'} px={'xs'}>
                <RecipeViewers handleSaveAndCloseViewers={handleCloseViewersInit} errors={childErrors} form={viewRecipeForm} handleCancelViewers={handleCancelViewers} />
            </Modal>
        </Modal.Stack>
    )
}