'use client'

import { Fieldset, NumberInput, Select, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import ErrorPopover from "@/components/popovers/errorPopover";
import { StepType } from "@/models/types/stepType";
import { IngredientType } from "@/models/types/ingredientType";
import { useStateStore } from "@/context/stateStore";
import ModalTemplate from "../../templates/modalTemplate";
import { errorType } from "@/models/types/error";
import { RecipeCreation } from "@/models/types/recipeCreation";

export default function EditIngredients({ handleCloseChildAndSave, form, handleCancelChild, handleRemoveChildValue, errors, thisItem }: { handleCloseChildAndSave: (which: string, newVals: IngredientType[] | StepType[], itemId: number) => void, form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>, handleCancelChild: (which: string, currNewIndex: number) => void, handleRemoveChildValue: (which: string, index: number) => void, errors: errorType[], thisItem: IngredientType | null }) {

    const width = useStateStore(s => s.widthQuery);

    if (thisItem === null) {
        return;
    }

    const errorsExist = errors ? true : false;
    const errIng = errorsExist && errors.find((err) => err.which === 'ingredient') ? true : false;
    const errQuant = errorsExist && errors.find((err) => err.which === 'quantity') ? true : false;
    const errType = errorsExist && errors.find((err) => err.which === 'type') ? true : false;
    const minWidth = width < 800 ? '80vw' : '60vw';
    const indexToEdit = thisItem.ingredientId;

    const save = () => {
        handleCloseChildAndSave('ingredients', [], indexToEdit);
    }

    return (
        <ModalTemplate subtitle={null} minHeight="15vh" minWidth={minWidth}>
            <form id="modalAddIngredients" className="w-full h-full">
                <Fieldset variant="unstyled" className="flex flex-col justify-center items-center w-full h-full border border-accent bg-altBack space-y-2" style={{ maxHeight: '90vh', overflow: 'hidden', borderRadius: '8px' }} radius={'sm'} px={'sm'} py={'sm'}>
                    <div className="w-full scrollbar-thin scrollbar-webkit space-y-2 flex flex-col" style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
                        <Fieldset className={`flex flex-col justify-start space-y-1 items-center h-full w-full`} key={indexToEdit}>
                            <div className="flex flex-row w-full justify-between items-center">
                                <p className="text-xs sm:text-base text-black font-semibold">{`Ingredient #${indexToEdit + 1}`}</p>
                                <ErrorPopover errors={errors} width={width} />
                            </div>
                            <TextInput
                                variant="unstyled"
                                className={`w-full text-xs sm:text-sm h-fit ${errIng ? 'border border-red-600' : 'border border-[#CED4DA]'} rounded-[4px] pe-[12px] ps-[12px]`}
                                id={`modalIngredient-${indexToEdit + 1}`}
                                name={`modalIngredient-${indexToEdit + 1}`}
                                placeholder="Sage"
                                key={form.key(`ingredients.${indexToEdit}.ingredient`)}
                                {...form.getInputProps(`ingredients.${indexToEdit}.ingredient`)}
                            />
                            <div className={`flex flex-row w-full h-fit justify-center items-center space-x-1`}>
                                <NumberInput
                                    variant="unstyled"
                                    className={`sm:w-3/4 w-1/2 h-full text-xs sm:text-sm ${errQuant ? 'border border-red-600' : 'border border-[#CED4DA]'} rounded-[4px] pe-[12px] ps-[12px]`}
                                    placeholder="1"
                                    key={form.key(`ingredients.${indexToEdit}.quantity`)}
                                    {...form.getInputProps(`ingredients.${indexToEdit}.quantity`)}
                                />
                                <Select
                                    variant="unstyled"
                                    className={`sm:w-1/4 w-1/2 h-full text-xs sm:text-sm ${errType ? 'border border-red-600' : 'border border-[#CED4DA]'} rounded-[4px] pe-[12px] ps-[12px]`}
                                    placeholder="Tbs"
                                    key={form.key(`ingredients.${indexToEdit}.quantityType`)}
                                    {...form.getInputProps(`ingredients.${indexToEdit}.quantityType`)}
                                    data={['cup', 'dash', 'fl oz', 'g', 'kg', 'lb', 'liter', 'ml', 'oz', 'pinch', 'pint', 'quart', 'tablespoon', 'teaspoon', 'tsp', 'Tbs', 'tbsp',]}
                                />
                            </div>
                            <div className="flex flex-row w-full justify-end items-center">
                                <button type="button" onClick={() => {
                                    handleRemoveChildValue('ingredients', indexToEdit);
                                }} title="Delete Ingredient" className={`h-fit w-fit hover:border hover:border-accent hover:text-red-600 rounded-md border border-transparent p-1 cursor-pointer text-sm text-red-400`}>Delete</button>
                            </div>
                        </Fieldset>
                    </div>
                </Fieldset>
                <section className="flex flex-row w-full justify-evenly items-center pt-5">
                    <button type="button" onClick={() => { handleCancelChild('ingredients', indexToEdit); }} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
                        Back
                    </button>
                    <button type="button" className={`border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5`} onClick={save}>
                        Save
                    </button>
                </section>
            </form>
        </ModalTemplate>
    )
}