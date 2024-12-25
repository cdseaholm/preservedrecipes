'use client'

import { Fieldset, Textarea, TextInput } from "@mantine/core"
import ModalTemplate from "../templates/modalTemplate"
import { UseFormReturnType } from "@mantine/form";
import { RecipeCreation } from "./parentRecipeModal";

export default function StepModal({ handleCancel, handleCreateRecipe, form }: { handleCancel: () => void, handleCreateRecipe: (initialValues: RecipeCreation) => void, form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>}) {
    return (
        <ModalTemplate subtitle={null} minHeight="15vh" minWidth="15vw">
            <form id="modalCreateRecipeForm" onSubmit={form.onSubmit((values) => handleCreateRecipe(values))} onAbort={handleCancel} className="w-full">
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
    )
}