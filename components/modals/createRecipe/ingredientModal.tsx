'use client'

import { IngredientType } from "@/models/types/ingredientType"
import { Fieldset, TextInput, NumberInput, Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import ModalTemplate from "../templates/modalTemplate"
import { RecipeCreation } from "./parentRecipeModal"

export default function IngredientModal({ handleCancel, handleCreateRecipe, form, handleCancelIngredients }: { handleCancel: () => void, handleCreateRecipe: (initialValues: RecipeCreation) => void, form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>, handleCancelIngredients: () => void}) {
    return (
        <ModalTemplate subtitle={null} minHeight="40vh" minWidth="40vw">
            <form id="modalCreateRecipeForm" onSubmit={form.onSubmit((values) => handleCreateRecipe(values))} onAbort={handleCancel} className="w-full">
                <Fieldset legend="Ingredients" className="flex flex-col justify-center items-center w-full h-full border border-accent sm:p-1 rounded-md">
                    {form.getValues().ingredients.map((ingredient: IngredientType, index: number) => {
                        return (
                            <div className="flex flex-row justify-evenly items-center h-full w-full space-x-1 sm:space-x-2" key={index}>
                                <TextInput
                                    className="w-1/2 h-full text-xs sm:text-sm"
                                    id={`modalIngredient-${index + 1}`}
                                    name={`modalIngredient-${index + 1}`}
                                    label={`Ingredient #${index + 1}`}
                                    placeholder="Sage"
                                    key={form.key(`ingredients.${index}.name`)}
                                    {...form.getInputProps(`${ingredient.ingredient}`)}
                                />
                                <NumberInput
                                    className="w-1/4 h-full text-xs sm:text-sm"
                                    label="Amt"
                                    placeholder="1"
                                    {...form.getInputProps(`${ingredient.quantity}`)}
                                />
                                <Select
                                    className="w-1/4 h-full text-xs sm:text-sm"
                                    label="Amt Type"
                                    placeholder="Tbs"
                                    data={[
                                        'cup',
                                        'dash',
                                        'fl oz',
                                        'g',
                                        'kg',
                                        'lb',
                                        'liter',
                                        'ml',
                                        'oz',
                                        'pinch',
                                        'pint',
                                        'quart',
                                        'tablespoon',
                                        'teaspoon',
                                        'tsp',
                                        'Tbs',
                                        'tbsp',
                                    ]}
                                    {...form.getInputProps(`${ingredient.quantityType}`)}
                                />
                            </div>
                        )
                    })}
                </Fieldset>
                <div className="flex flex-row justify-center items-center w-full h-full px-12 py-2">
                    <button className="w-3/4 sm:w-1/2 text-xs sm:text-sm hover:bg-altContent rounded-md hover:border hover:border-accent border border-transparent" type='button'>
                        Add Ingredient +
                    </button>
                </div>
                <section className="flex flex-row w-full justify-evenly items-center pt-5">
                    <button type="button" onClick={handleCancelIngredients} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
                        Back
                    </button>
                    <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5">
                        Save
                    </button>
                </section>
            </form>
        </ModalTemplate>
    )
}