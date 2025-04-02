'use client'

import { useStateStore } from "@/context/stateStore";
import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";
import { Modal, useModalsStack } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";
import InfoPopover from "../../popovers/infoPopover";
import { errorType } from "@/models/types/error";
import AddIngredients from "./extensions/ingredients/addIngredients";
import EditIngredients from "./extensions/ingredients/editIngredients";
import AddSteps from "./extensions/steps/addSteps";
import EditSteps from "./extensions/steps/editSteps";
import RecipeViewers from "./extensions/viewers";
import MainRecipeForm from "./extensions/mainRecipeForm";
import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { HandleAddChildValues, RemoveChildValues } from "./extensions/functions";
import { IUser } from "@/models/types/user";

export type RecipeFormType = {
    name: string;
    description: string;
    ingredients: IngredientType[];
    steps: StepType[];
    type: string;
    tags: string[];
    secret: boolean;
    secretViewerIDs: string[];
    familyRecipe: boolean;
}


export default function RecipeForm({
    handleCreateRecipe,
    handleCloseCreateRecipe,
    childErrors,
    resetChildErrors,
    handleCloseChildAndSaveAdditions,
    open,
    handleCloseChildAndSaveEdits,
    handleCloseViewers,
    userInfo
}: {

    handleCreateRecipe: ({ recipeForm }: { recipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => Promise<boolean>,
    handleCloseCreateRecipe: () => void,
    childErrors: errorType[],
    resetChildErrors: () => void,
    handleCloseChildAndSaveAdditions: ({ which, newVals, itemId, form, stepId, }: { which: string, newVals: IngredientType[] | StepType[], itemId: number, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, stepId: null | number }) => Promise<{ saved: boolean, message: string }>,
    open: boolean,
    handleCloseChildAndSaveEdits: ({ which, newVals, itemId, form, }: { which: string, newVals: IngredientType[] | StepType[], itemId: number, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, }) => Promise<{ saved: boolean, message: string }>,
    handleCloseViewers: ({ form }: { form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => Promise<boolean>,
    userInfo: IUser
}) {

    const recipeForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            description: '',
            ingredients: [] as IngredientType[],
            steps: [] as StepType[],
            type: `Misc`,
            tags: [] as string[],
            secret: false,
            secretViewerIDs: [] as string[],
            familyRecipe: false
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
            },
            familyRecipe: (_value) => (
                null
            )
        }
    });

    const width = useStateStore(state => state.widthQuery);

    const stack = useModalsStack(['create-main', 'step', 'ingredient', 'edit-step', 'edit-ingredient', 'add-viewers']);
    const hasOpenedMain = useRef(false);

    const handleOpenMain = useCallback(() => {
        if (!hasOpenedMain.current) {
            stack.open('create-main');
            hasOpenedMain.current = true;
        }
    }, [stack]);

    const resetZoom = useStateStore(state => state.handleZoomReset);
    const [valuesUsed, setValuesUsed] = useState<IngredientType[]>([] as IngredientType[]);
    const [viewersCurr, setViewersCurr] = useState<string[]>([])
    const handleSetValuesUsed = (newVals: IngredientType[]) => {
        setValuesUsed([...newVals]);
    };
    const ingredientPills = recipeForm.getValues().ingredients.map((ingredient) => {
        return ingredient
    });
    const stepPills = recipeForm.getValues().steps.map((step) => {
        return step
    });

    const [ingredientCopy, setIngredientCopy] = useState<IngredientType | null>(null);
    const [stepCopy, setStepCopy] = useState<StepType | null>(null);

    const resetVals = () => {
        resetChildErrors();
        hasOpenedMain.current = false;
    }

    const addChildValues = async (which: string) => {
        const newVal = await HandleAddChildValues({ which: which, form: recipeForm }) as StepType | IngredientType;
        if (which === 'steps') {
            const stepCopy = newVal as StepType;
            setStepCopy(stepCopy)
        }
    };

    const handleRemoveChildValue = async (which: string, index: number) => {
        await RemoveChildValues({ which: which, form: recipeForm, index: index });

        if (which === 'ingredients') {
            stack.close('edit-ingredient');
        } else if (which === 'steps') {
            stack.close('edit-step');
        }
        resetChildErrors();
    };

    const handleCancel = () => {
        recipeForm.reset();
        recipeForm.clearErrors();
        resetZoom(width, false);
        stack.closeAll();
        resetVals();
        toast.info("Cancelled Creating Recipe");
        handleCloseCreateRecipe();
    }

    const handleCloseChildAndSaveAdditionsInit = async (which: string, newVals: IngredientType[] | StepType[], itemId: number) => {

        let stepId = null;
        if (stack.state.step === true) {
            stepId = stepCopy?.stepId as number;
        }

        const saved = await handleCloseChildAndSaveAdditions({ stepId: stepId, which: which, newVals: newVals, itemId: itemId, form: recipeForm }) as { saved: boolean, message: string };

        if (!saved) {
            console.log('Issue saving')
            return;
        }

        if (saved.saved === false) {
            console.log('Returned false')
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
                    const item = recipeForm.getValues().ingredients[itemId];
                    const newIngVals = [...valuesUsed, item] as IngredientType[]
                    handleSetValuesUsed(newIngVals)
                    stack.open('step');
                }
                if (stack.state["edit-step"] === true) {
                    const item = recipeForm.getValues().steps[itemId];
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

        const saved = await handleCloseChildAndSaveEdits({ which: which, newVals: newVals, itemId: itemId, form: recipeForm });

        if (!saved) {
            console.log('Issue saving')
            return;
        }

        if (saved.saved === false) {
            console.log('Returned false')
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
            resetVals();
            return;
        }
    }

    const handleCancelAdd = (which: string, currNewIndex: number) => {
        if (which === 'steps') {
            recipeForm.removeListItem(`steps`, currNewIndex);
            setStepCopy(null);
            setValuesUsed([] as IngredientType[])
            stack.close('step');
        } else {
            recipeForm.removeListItem(`ingredients`, currNewIndex);
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
            recipeForm.setFieldValue(`steps.${currNewIndex}`, resetStep);
            setStepCopy(null);
            setValuesUsed([] as IngredientType[])
            stack.close('edit-step');
        } else if (which === 'ingredients') {
            recipeForm.setFieldValue(`ingredients.${currNewIndex}`, ingredientCopy);
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
            setIngredientCopy(recipeForm.getValues().ingredients[index]);
            stack.open('edit-ingredient');
        } else if (which === 'steps') {
            setStepCopy(recipeForm.getValues().steps[index]);
            setValuesUsed(recipeForm.getValues().steps[index].ingredients)
            stack.open('edit-step')
        }
    }

    const handleOpenViewers = () => {
        setViewersCurr(recipeForm.getValues().secretViewerIDs)
        stack.open('add-viewers');
    };

    const handleCloseViewersInit = async () => {
        const validateErrors = await handleCloseViewers({ form: recipeForm }) as boolean;
        if (validateErrors) {
            return;
        } else {
            stack.close('add-viewers');
        }
    }

    const handleCancelViewers = () => {
        recipeForm.setFieldValue(`secretViewerIDs`, viewersCurr);
        setViewersCurr([]);
        stack.close('add-viewers');
    }

    const handleCreateRecipeInit = async () => {
        const created = await handleCreateRecipe({ recipeForm }) as boolean;
        if (created) {
            hasOpenedMain.current = false;
            stack.closeAll();
            recipeForm.reset();
            recipeForm.clearErrors();
        } else {
            return;
        }
    }

    useEffect(() => {
        if (open) {
            handleOpenMain();
        }
    }, [open, handleOpenMain]);

    return (
        <Modal.Stack>
            <Modal {...stack.register('create-main')} onClose={handleCancel} title="Create Recipe" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} transitionProps={{ transition: hasOpenedMain ? `slide-up` : `pop` }}>
                <MainRecipeForm handleCancel={handleCancel} handleCreateRecipe={handleCreateRecipeInit} errors={childErrors} recipeForm={recipeForm} stepPills={stepPills} ingredientPills={ingredientPills} handleOpenViewers={handleOpenViewers} secret={recipeForm.getValues().secret} handleOpenAdd={handleOpenAdd} handleEditToggle={handleOpenEdit} creating={true} handleEditRecipe={handleCreateRecipeInit} userInfo={userInfo} familyRecipe={recipeForm.getValues().familyRecipe} />
            </Modal>

            <Modal {...stack.register('ingredient')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Create an Ingredient" infoOne="Here you can add ingredients, add the ingredient to a step within the recipe by selecting a step that is already made." infoTwo="If you're unsure where to begin you can add ingredients here first, or click BACK and add steps first and add ingredients to each step!" />
            }>
                <AddIngredients handleCloseChildAndSave={handleCloseChildAndSaveAdditionsInit} form={recipeForm} handleCancelChild={handleCancelAdd} errors={childErrors} thisIngredient={recipeForm.getValues().ingredients[recipeForm.getValues().ingredients.length - 1]} />
            </Modal>

            <Modal {...stack.register('edit-ingredient')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Edit Recipe Ingredient" infoOne="Here you can edit ingredients, remove them by clicking delete, or just edit them directly" infoTwo="If you're unsure where to begin you can add ingredients here first, or click BACK and add steps first and add ingredients to each step!" />
            }>
                <EditIngredients handleCloseChildAndSave={handleCloseChildAndSaveEditsInit} form={recipeForm} handleCancelChild={handleCancelEdit} handleRemoveChildValue={handleRemoveChildValue} errors={childErrors} thisItem={ingredientCopy ? recipeForm.getValues().ingredients[ingredientCopy.ingredientId] : null} />
            </Modal>

            <Modal {...stack.register('step')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Create Recipe Step" infoOne="Here you can add steps, add ingredients to the step by selecting an ingredient from previously used ones or make a new one. The step direction cannot be empty as you need to give some sort of direction." infoTwo="If you're unsure where to begin you can give the step some directions then begin to add ingredients that this step requires!" />
            } py={'md'} px={'xs'}>
                <AddSteps handleCloseChildAndSave={handleCloseChildAndSaveAdditionsInit} form={recipeForm} handleCancelChild={handleCancelAdd} errors={childErrors} ingredientPills={ingredientPills} handleOpenAdd={handleOpenAdd} thisStep={recipeForm.getValues().steps[recipeForm.getValues().steps.length - 1]} valuesUsed={valuesUsed} handleSetValuesUsed={handleSetValuesUsed} />
            </Modal>

            <Modal {...stack.register('edit-step')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Edit Recipe Steps" infoOne="Here you can edit steps, remove them by clicking delete, or just edit them directly" infoTwo="If you're unsure where to begin you can give the step some directions then begin to add ingredients that this step requires!" />
            } py={'md'} px={'xs'}>
                <EditSteps handleCloseChildAndSave={handleCloseChildAndSaveEditsInit} form={recipeForm} handleCancelChild={handleCancelEdit} handleRemoveChildValue={handleRemoveChildValue} errors={childErrors} ingredientPills={ingredientPills} handleOpenAdd={handleOpenAdd} handleSetValuesUsed={handleSetValuesUsed} valuesUsed={valuesUsed} thisItem={stepCopy ? recipeForm.getValues().steps[stepCopy.stepId] : null} />
            </Modal>

            <Modal {...stack.register('add-viewers')} onClose={handleCancel} centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} title={
                <InfoPopover title="Edit Recipe Steps" infoOne="Here you can edit and add viewers to this recipe. Make sure the viewer you're adding has an account, then add their email address. " infoTwo="Be aware this recipe must be private." />
            } py={'md'} px={'xs'}>
                <RecipeViewers handleSaveAndCloseViewers={handleCloseViewersInit} errors={childErrors} form={recipeForm} handleCancelViewers={handleCancelViewers} />
            </Modal>
        </Modal.Stack>
    )
}