'use client'

import { Modal, useModalsStack } from "@mantine/core";
import { toast } from "sonner";
import { useForm } from '@mantine/form';
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";
import { useEffect, useState } from "react";
import { IngredientType } from "@/models/types/ingredientType";
import MainRecipeModal from "./mainRecipeModal";
import { StepType } from "@/models/types/stepType";
import { CloseChildAndSaveAddition, CloseChildAndSaveEdits, HandleAddChildValues, RemoveChildValues } from "./functions";
import AddIngredients from "./ingredients/addIngredients";
import EditIngredients from "./ingredients/editIngredients";
import InfoPopover from "@/components/popovers/infoPopover";
import { errorType } from "@/models/types/error";
import { RecipeCreation } from "@/models/types/recipeCreation";
import AddSteps from "./steps/addSteps";
import EditSteps from "./steps/editSteps";

export default function ParentRecipeModal({ session, handleUpdate, open, handleCloseCreateRecipe }: { session: Session | null, handleUpdate: () => Promise<void>, open: boolean, handleCloseCreateRecipe: () => void }) {

    const width = useStateStore(state => state.widthQuery);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            description: '',
            ingredients: [] as IngredientType[],
            steps: [] as StepType[]
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
            }
        }
    });

    const stack = useModalsStack(['create-main', 'step', 'ingredient', 'edit-step', 'edit-ingredient']);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const [childErrors, setChildErrors] = useState<errorType[]>([]);
    const [valuesUsed, setValuesUsed] = useState<IngredientType[]>([] as IngredientType[]);
    const handleSetValuesUsed = (newVals: IngredientType[]) => {
        setValuesUsed([...newVals]);
    };
    const ingredientPills = form.getValues().ingredients.map((ingredient) => {
        return ingredient
    });
    const stepPills = form.getValues().steps.map((step) => {
        return step
    });

    const [ingredientCopy, setIngredientCopy] = useState<IngredientType | null>(null);
    const [stepCopy, setStepCopy] = useState<StepType | null>(null);

    const resetVals = () => {
        setChildErrors([]);
    }

    const handleCreateRecipe = async (initialValues: RecipeCreation) => {

        toast.info(`${initialValues}`);
        if (childErrors.length > 0) {
            toast.error('There are errors you need to deal with first!')
            return;
        }
        try {

            form.clearErrors();

            if (!session) {
                toast.warning("You need to be signed in to make a recipe!")
                return;
            }

            //         const validation = form.validate();

            //         if (!validation) {
            //             return;
            //         }

            //         // let creationAttempt = await CreateRecipe({ emailPassed: email, pwPassed: password }) as { status: boolean };

            //         let attemptStatus = creationAttempt ? creationAttempt.status : false;

            //         if (attemptStatus === false) {
            //             toast.error('Error creating recipe')
            //             return;
            //         }

            toast.success('Successfully created recipe!');
            await handleUpdate();
            resetZoom(width, false);
            handleCloseCreateRecipe();
            stack.closeAll();
            form.reset();
            form.clearErrors();

        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    }

    const addChildValues = async (which: string) => {
        const newVal = await HandleAddChildValues({ which: which, form: form }) as StepType | IngredientType;
        if (which === 'steps') {
            const stepCopy = newVal as StepType;
            setStepCopy(stepCopy)
        }
    };

    const handleRemoveChildValue = async (which: string, index: number) => {
        await RemoveChildValues({ which: which, form: form, index: index });

        if (which === 'ingredients') {
            stack.close('edit-ingredient');
        } else if (which === 'steps') {
            stack.close('edit-step');
        }
        setChildErrors([]);
    };

    const handleCancel = () => {
        form.reset();
        form.clearErrors();
        resetZoom(width, false);
        handleCloseCreateRecipe();
        resetVals();
        stack.closeAll();
        toast.info("Cancelled Creating Recipe");
    }

    const handleCloseChildAndSaveAdditions = async (which: string, newVals: IngredientType[] | StepType[], itemId: number) => {
        setChildErrors([]);
        try {
            let stepId = null;
            if (stack.state.step === true) {
                stepId = stepCopy?.stepId as number;
                console.log(stepId)
            }
            const attempt = await CloseChildAndSaveAddition({ which: which, form: form, newVals: newVals, itemId: itemId, stepId: stepId }) as errorType[];

            if (attempt && attempt.length > 0) {
                setChildErrors(attempt);
                return false;
            } else {
                if (which === 'steps') {
                    setStepCopy(null);
                    setValuesUsed([] as IngredientType[])
                    stack.close('step');
                    toast.info('Steps Saved');
                } else {
                    stack.close('ingredient');
                    if (stack.state.step === true) {
                        const item = form.getValues().ingredients[itemId];
                        const newIngVals = [...valuesUsed, item] as IngredientType[]
                        handleSetValuesUsed(newIngVals)
                        stack.open('step');
                    }
                    if (stack.state["edit-step"] === true) {
                        const item = form.getValues().steps[itemId];
                        const newIngVals = [...valuesUsed, item] as IngredientType[]
                        handleSetValuesUsed(newIngVals)
                        stack.open('edit-step');
                    }
                    toast.info('Ingredient Saved');
                }
                return true;
            }
        } catch (error: any) {
            console.log(error);
            return false;
        }
    }

    const handleCloseChildAndSaveEdits = async (which: string, newVals: IngredientType[] | StepType[], itemId: number) => {
        
        const attempt = await CloseChildAndSaveEdits({ which: which, form: form, newVals: newVals, itemId: itemId }) as errorType[];

        if (attempt && attempt.length > 0) {
            setChildErrors(attempt);
            return false;
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
            resetVals();
            return true;
        }
    }

    const handleCancelAdd = (which: string, currNewIndex: number) => {
        if (which === 'steps') {
            form.removeListItem(`steps`, currNewIndex);
            setStepCopy(null);
            setValuesUsed([] as IngredientType[])
            stack.close('step');
        } else {
            form.removeListItem(`ingredients`, currNewIndex);
            setIngredientCopy(null);
            stack.close('ingredient');
            if (stepCopy !== null) {
                stack.open('step')
            }
        }
        resetVals();
    };

    const handleCancelEdit = (which: string, currNewIndex: number) => {
        if (which === 'steps') {
            let resetStep = stepCopy;
            if (resetStep === null) {
                toast.error('Error canceling');
                return;
            }
            form.setFieldValue(`steps.${currNewIndex}`, resetStep);
            setStepCopy(null);
            setValuesUsed([] as IngredientType[])
            stack.close('edit-step');
        } else if (which === 'ingredients') {
            form.setFieldValue(`ingredients.${currNewIndex}`, ingredientCopy);
            setIngredientCopy(null)
            stack.close('edit-ingredient');
        }
        resetVals();
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
            setIngredientCopy(form.getValues().ingredients[index]);
            stack.open('edit-ingredient');
        } else if (which === 'steps') {
            setStepCopy(form.getValues().steps[index]);
            setValuesUsed(form.getValues().steps[index].ingredients)
            stack.open('edit-step')
        }
    }

    useEffect(() => {
        if (open) {
            stack.open('create-main');
        }
    }, [open, stack]);

    return (

        <Modal.Stack>
            <Modal {...stack.register('create-main')} onClose={handleCancel} title="Create Recipe" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'auto'}>
                <MainRecipeModal handleCancel={handleCancel} handleCreateRecipe={handleCreateRecipe} form={form} handleOpenAdd={handleOpenAdd} handleEditToggle={handleOpenEdit} ingredientPills={ingredientPills} stepPills={stepPills} errors={childErrors} />
            </Modal>

            <Modal {...stack.register('ingredient')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'auto'} title={
                <InfoPopover width={width} title="Create an Ingredient" infoOne="Here you can add ingredients, add the ingredient to a step within the recipe by selecting a step that is already made." infoTwo="If you're unsure where to begin you can add ingredients here first, or click BACK and add steps first and add ingredients to each step!" />
            }>
                <AddIngredients handleCloseChildAndSave={handleCloseChildAndSaveAdditions} form={form} handleCancelChild={handleCancelAdd} errors={childErrors} thisIngredient={form.getValues().ingredients[form.getValues().ingredients.length - 1]} />
            </Modal>

            <Modal {...stack.register('edit-ingredient')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'auto'} title={
                <InfoPopover width={width} title="Edit Recipe Ingredient" infoOne="Here you can edit ingredients, remove them by clicking delete, or just edit them directly" infoTwo="If you're unsure where to begin you can add ingredients here first, or click BACK and add steps first and add ingredients to each step!" />
            }>
                <EditIngredients handleCloseChildAndSave={handleCloseChildAndSaveEdits} form={form} handleCancelChild={handleCancelEdit} handleRemoveChildValue={handleRemoveChildValue} errors={childErrors} thisItem={ingredientCopy ? form.getValues().ingredients[ingredientCopy.ingredientId] : null} />
            </Modal>

            <Modal {...stack.register('step')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'auto'} title={
                <InfoPopover width={width} title="Create Recipe Step" infoOne="Here you can add steps, add ingredients to the step by selecting an ingredient from previously used ones or make a new one. The step direction cannot be empty as you need to give some sort of direction." infoTwo="If you're unsure where to begin you can give the step some directions then begin to add ingredients that this step requires!" />
            } py={'md'} px={'xs'}>
                <AddSteps handleCloseChildAndSave={handleCloseChildAndSaveAdditions} form={form} handleCancelChild={handleCancelAdd} errors={childErrors} ingredientPills={ingredientPills} handleOpenAdd={handleOpenAdd} thisStep={form.getValues().steps[form.getValues().steps.length - 1]} valuesUsed={valuesUsed} handleSetValuesUsed={handleSetValuesUsed} />
            </Modal>

            <Modal {...stack.register('edit-step')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'auto'} title={
                <InfoPopover width={width} title="Edit Recipe Steps" infoOne="Here you can edit steps, remove them by clicking delete, or just edit them directly" infoTwo="If you're unsure where to begin you can give the step some directions then begin to add ingredients that this step requires!" />
            } py={'md'} px={'xs'}>
                <EditSteps handleCloseChildAndSave={handleCloseChildAndSaveEdits} form={form} handleCancelChild={handleCancelEdit} handleRemoveChildValue={handleRemoveChildValue} errors={childErrors} ingredientPills={ingredientPills} handleOpenAdd={handleOpenAdd} handleSetValuesUsed={handleSetValuesUsed} valuesUsed={valuesUsed} thisItem={stepCopy ? form.getValues().steps[stepCopy.stepId] : null} />
            </Modal>
        </Modal.Stack>
    )
}