'use client'

import { Fieldset, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import ErrorPopover from "@/components/popovers/errorPopover";
import ComboBoxMultiSelect from "@/components/misc/combobox/comboBoxMultiSelect";
import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";
import { useStateStore } from "@/context/stateStore";
import { errorType } from "@/models/types/error";
import { RecipeFormType } from "../../recipeForm";
import ActionButton from "@/components/buttons/basicActionButton";
import CancelButton from "@/components/buttons/cancelButton";

export default function EditSteps({ handleCloseChildAndSave, form, handleCancelChild, handleRemoveChildValue, errors, ingredientPills, handleOpenAdd, handleSetValuesUsed, valuesUsed, thisItem }: { handleCloseChildAndSave: (which: string, newVals: IngredientType[] | StepType[], itemId: number) => void, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, handleCancelChild: (which: string, currNewIndex: number) => void, handleRemoveChildValue: (which: string, index: number) => void, errors: errorType[], ingredientPills: IngredientType[], handleOpenAdd: (which: string, addEndValTo: number) => void, handleSetValuesUsed: (newVals: IngredientType[]) => void, valuesUsed: IngredientType[], thisItem: StepType | null }) {

    const width = useStateStore(s => s.widthQuery);

    if (thisItem === null) {
        return;
    }

    const error = errors ? errors[0] : {} as errorType;
    const errorWhich = error ? error.which as string : '';
    const indexToEdit = thisItem ? thisItem.stepId : -1;

    const save = () => {
        handleCloseChildAndSave('steps', valuesUsed, indexToEdit);
    }

    const saveAndOpen = () => {
        handleOpenAdd('ingredients', indexToEdit);
    }

    return (
        <form id="modalAddSteps" className="w-full h-full">
            <Fieldset variant="unstyled" className="flex flex-col justify-center items-center w-full h-full border border-accent bg-altBack space-y-2" style={{ maxHeight: '90vh', overflow: 'hidden', borderRadius: '8px' }} radius={'sm'} px={'sm'} py={'sm'}>
                <div className="w-full scrollbar-thin scrollbar-webkit space-y-2 flex flex-col" style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
                    <Fieldset className={`flex flex-col justify-start space-y-1 items-center h-fit w-full`} key={indexToEdit}>
                        <div className="flex flex-row w-full justify-between items-center">
                            <p className="text-xs sm:text-base text-black font-semibold">{`Step #${indexToEdit + 1}`}</p>
                            <ErrorPopover errors={errors} width={width} />
                        </div>
                        <div className="flex flex-row w-full justify-start items-center">
                            <p className="text-xs">Type: Text</p>
                        </div>
                        <Textarea
                            className={`w-full text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis`}
                            id={`modalStep-${indexToEdit + 1}`}
                            name={`modalStep-${indexToEdit + 1}`}
                            placeholder="Enter your step instructions here"
                            key={form.key(`steps.${indexToEdit}`)}
                            {...form.getInputProps(`steps.${indexToEdit}.description`)}
                            error={errorWhich === 'description'}
                        />
                        <ComboBoxMultiSelect pills={ingredientPills} which={"ingredients"} currentVals={valuesUsed} handleSetValuesUsed={handleSetValuesUsed} save={saveAndOpen} currValsLen={valuesUsed.length} />
                        <div className="flex flex-row w-full justify-end items-center">
                            <button type="button" onClick={() => {
                                handleRemoveChildValue('steps', indexToEdit)
                            }} title="Delete Step" className={`h-fit w-fit hover:border hover:border-accent hover:text-red-600 rounded-md border border-transparent p-1 cursor-pointer text-sm text-red-400`} aria-label="Remove step">Delete</button>
                        </div>
                    </Fieldset>
                </div>
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-5">
                <CancelButton handleCancel={() => { handleCancelChild('steps', indexToEdit); }} />
                <ActionButton buttonTitle="Save" action={save} />
            </section>
        </form>
    )
}