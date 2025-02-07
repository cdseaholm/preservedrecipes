'use client'

import { Fieldset, TextInput, NumberInput, Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import ErrorPopover from "@/components/popovers/errorPopover";
import { StepType } from "@/models/types/stepType";
import { IngredientType } from "@/models/types/ingredientType";
import { useStateStore } from "@/context/stateStore";
import { errorType } from "@/models/types/error";
import { RecipeFormType } from "../../recipeForm";
import ActionButton from "@/components/buttons/basicActionButton";
import CancelButton from "@/components/buttons/cancelButton";

export default function AddIngredients({ handleCloseChildAndSave, form, handleCancelChild, errors, thisIngredient }: { handleCloseChildAndSave: (which: string, newVals: IngredientType[] | StepType[], itemId: number) => void, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, handleCancelChild: (which: string, currNewIndex: number) => void, errors: errorType[], thisIngredient: IngredientType }) {

    const errorsExist = errors ? true : false;
    const errIng = errorsExist && errors.find((err) => err.which === 'ingredient') ? true : false;
    const errQuant = errorsExist && errors.find((err) => err.which === 'quantity') ? true : false;
    const errType = errorsExist && errors.find((err) => err.which === 'type') ? true : false;
    const width = useStateStore(s => s.widthQuery);
    const index = thisIngredient ? thisIngredient.ingredientId : -1;
    const newIngId = thisIngredient ? thisIngredient.ingredientId : -1;

    const save = () => {
        handleCloseChildAndSave('ingredients', [], newIngId)
    }

    return (
        <form id="modalAddIngredients" className="w-full h-full">
            <Fieldset variant="unstyled" className="flex flex-col justify-center items-center w-full h-full border border-accent bg-altBack space-y-2" style={{ maxHeight: '90vh', overflow: 'hidden', borderRadius: '8px' }} radius={'sm'} px={'sm'} py={'sm'}>
                <div className="w-full scrollbar-thin scrollbar-webkit space-y-2 flex flex-col" style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    <Fieldset className={`flex flex-col justify-start space-y-1 items-center h-full w-full`} key={index}>
                        <div className="flex flex-row w-full justify-between items-center">
                            <p className="text-xs sm:text-base text-black font-semibold">{`Ingredient #${index + 1}`}</p>
                            <ErrorPopover errors={errors} width={width} />
                        </div>
                        <TextInput
                            className={`w-full text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis`}
                            id={`modalIngredient-${index + 1}`}
                            name={`modalIngredient-${index + 1}`}
                            placeholder="Sage"
                            key={form.key(`ingredients.${index}.ingredient`)}
                            {...form.getInputProps(`ingredients.${index}.ingredient`)}
                            error={errIng}
                        />
                        <div className={`flex flex-row w-full h-[36px] justify-end items-center space-x-1`}>
                            <NumberInput
                                className={`sm:w-3/4 w-1/2 text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis`}
                                placeholder="1"
                                key={form.key(`ingredients.${index}.quantity`)}
                                {...form.getInputProps(`ingredients.${index}.quantity`)}
                                error={errQuant}
                            />
                            <Select
                                className={`sm:w-1/4 w-1/2 text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis`}
                                placeholder="Tbs"
                                key={form.key(`ingredients.${index}.quantityType`)}
                                {...form.getInputProps(`ingredients.${index}.quantityType`)}
                                data={['cup', 'dash', 'fl oz', 'g', 'kg', 'lb', 'liter', 'ml', 'oz', 'pinch', 'pint', 'quart', 'tablespoon', 'teaspoon', 'tsp', 'Tbs', 'tbsp',]}
                                error={errType}
                            />
                        </div>
                    </Fieldset>
                </div>
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-5">
                <CancelButton handleCancel={() => { handleCancelChild('ingredients', newIngId); }} />
                <ActionButton buttonTitle="Save" action={save} />
            </section>
        </form>
    )
}