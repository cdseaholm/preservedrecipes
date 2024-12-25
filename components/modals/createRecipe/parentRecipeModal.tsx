'use client'

import { Fieldset, Modal, NumberInput, Select, Textarea, TextInput, useModalsStack } from "@mantine/core";
import ModalTemplate from "../templates/modalTemplate";
import { toast } from "sonner";
import { useForm } from '@mantine/form';
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";
import { useEffect, useState } from "react";
import StepModal from "./stepModal";
import { IngredientType } from "@/models/types/ingredientType";
import IngredientModal from "./ingredientModal";

export type RecipeCreation = {
    name: string;
    description: string;
    ingredients: IngredientType[];
    steps: stepType[]
}

type stepType = {
    stepName: string;
    stepType: string;
    ingredientsUsed: string[];
}

export default function ParentRecipeModal({ session, handleUpdate, open, handleCloseCreateRecipe }: { session: Session | null, handleUpdate: () => Promise<void>, open: boolean, handleCloseCreateRecipe: () => void }) {

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            description: '',
            ingredients: [] as IngredientType[],
            steps: [] as stepType[]
        },
        validate: {
            name: (value) => (
                value.length > 100 ? 'Invalid name too long'
                    : null
            ),
            description: (value: string) => (
                value.length > 1000 ? 'Description too long, try something short and sweet just to get the point across' : null
            )
        }
    });

    const stack = useModalsStack(['create-main', 'create-step', 'ingredients']);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);
    const [prevValues, setPrevValues] = useState(form.values);
    const [stepNumber, setStepNumber] = useState<number>(1);
    const [newSteps, setNewSteps] = useState<stepType[]>([]);

    const handleCreateRecipe = async (initialValues: RecipeCreation) => {

        toast.info(`${initialValues}`);

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
            form.reset();
            form.clearErrors();
            await handleUpdate();
            resetZoom(width, false);
            handleCloseCreateRecipe();
            stack.closeAll();

        } catch (error) {
            console.error('Error creating recipe:', error);
        }
    }

    const addIngredient = () => {
        let blankIngredient = { ingredient: '', quantity: 0, quantityType: '' } as IngredientType
        form.insertListItem('ingredients', blankIngredient);
    };

    const removeIngredient = (index: number) => {
        form.removeListItem('ingredients', index);
    };

    const handleCancel = () => {
        form.reset();
        form.clearErrors();
        resetZoom(width, false);
        handleCloseCreateRecipe();
        stack.closeAll();
        toast.info("Cancelled Creating Recipe");
    }

    const handleCancelIngredients = () => {
        form.setValues(prevValues);
        stack.close('ingredients');
    };

    const handleOpenIngredients = () => {
        setPrevValues(form.values);
        addIngredient();
        stack.open('ingredients');
    };

    useEffect(() => {
        if (open) {
            stack.open('create-main');
        }
    }, [open]);

    return (

        <Modal.Stack>
            <Modal {...stack.register('create-main')} title="Create Recipe" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false}>
                <ModalTemplate subtitle={null} minHeight="15vh" minWidth="15vw">
                    <form id="modalCreateRecipeForm" onSubmit={form.onSubmit((values) => handleCreateRecipe(values))} className="w-full">
                        <Fieldset legend="Personal Information">
                            <TextInput
                                id="modalRecipeName"
                                name="modalRecipeName"
                                label="Recipe Name"
                                placeholder="Grandma's Apple Pie"
                                mt={'md'}
                                withAsterisk
                                key={form.key('name')}
                                {...form.getInputProps('name')}
                            />
                            <Textarea
                                id="modalRecipeDescription"
                                name="modalRecipeDescription"
                                label="Recipe Description"
                                placeholder="Grandma's secret Apple Pie she made for us when we were younger"
                                withAsterisk
                                key={form.key('description')}
                                {...form.getInputProps('description')}
                            />
                        </Fieldset>
                        <section className="flex flex-row justify-center items-center w-full h-full p-2" onClick={() => handleOpenIngredients()}>
                            <button className="w-1/2 md:w-1/3" type='button'>
                                Add Ingredients
                            </button>
                        </section>
                        <section className="flex flex-row w-full justify-evenly items-center pt-5">
                            <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2">
                                Cancel
                            </button>
                            <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                                Create
                            </button>
                        </section>
                    </form>
                </ModalTemplate>
            </Modal>

            <Modal {...stack.register('ingredients')} onClose={handleCancel} title="Create Recipe" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'auto'}>
                <IngredientModal handleCancel={handleCancel} handleCreateRecipe={handleCreateRecipe} form={form} handleCancelIngredients={handleCancelIngredients} />
            </Modal>

            <Modal {...stack.register('create-step')} onClose={handleCancel} title="Create Recipe" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false}>
                <StepModal handleCancel={handleCancel} handleCreateRecipe={handleCreateRecipe} form={form} />
            </Modal>

        </Modal.Stack>
    )
}