'use client'

import { Fieldset, TextInput, Textarea } from "@mantine/core";
import ModalTemplate from "../templates/modalTemplate";
import { UseFormReturnType } from "@mantine/form";
import { useStateStore } from "@/context/stateStore";
import ComboBox from "@/components/misc/combobox/comboBox";
import { StepType } from "@/models/types/stepType";
import { IngredientType } from "@/models/types/ingredientType";
import { RecipeCreation } from "@/models/types/recipeCreation";
import ErrorPopover from "@/components/popovers/errorPopover";
import { errorType } from "@/models/types/error";

export default function MainRecipeModal({ handleCancel, handleCreateRecipe, form, handleOpenAdd, handleEditToggle, stepPills, ingredientPills, errors }: { handleCancel: () => void, handleCreateRecipe: (initialValues: RecipeCreation) => void, form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>, handleOpenAdd: (which: string) => void, handleEditToggle: (which: string, index: number) => void, stepPills: StepType[], ingredientPills: IngredientType[], errors: errorType[] }) {

    const width = useStateStore(s => s.widthQuery);
    const minWidth = width < 800 ? '80vw' : '60vw';

    return (
        <ModalTemplate subtitle={null} minHeight="15vh" minWidth={minWidth}>
            <form id="modalCreateRecipeForm" onSubmit={form.onSubmit((values) => handleCreateRecipe(values))} className="w-full h-full">
                <Fieldset legend="Recipe Structure">
                    <div className="flex flex-row w-full justify-end items-center">
                        <ErrorPopover errors={errors} width={width} />
                    </div>
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
                        mt={'md'}
                        key={form.key('description')}
                        {...form.getInputProps('description')}
                    />
                    <Fieldset className="flex flex-row justify-between items-center w-full h-full" legend='Steps' mt={'md'} variant="unstyled">
                        <ComboBox which="steps" handleOpenAdd={handleOpenAdd} pills={stepPills} handleEditToggle={handleEditToggle} />
                    </Fieldset>
                    <Fieldset className="flex flex-row justify-between items-center w-full h-full" legend='Ingredients' mt={'md'} variant="unstyled">
                        <ComboBox which="ingredients" handleOpenAdd={handleOpenAdd} pills={ingredientPills} handleEditToggle={handleEditToggle} />
                    </Fieldset>
                </Fieldset>
                <section className="flex flex-row w-full justify-evenly items-center pt-5">
                    <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
                        Cancel
                    </button>
                    <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5">
                        Create
                    </button>
                </section>
            </form>
        </ModalTemplate>
    )
}