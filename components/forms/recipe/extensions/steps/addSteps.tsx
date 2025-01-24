import { Fieldset, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import ComboBoxMultiSelect from "@/components/misc/combobox/comboBoxMultiSelect";
import { StepType } from "@/models/types/stepType";
import { IngredientType } from "@/models/types/ingredientType";
import ErrorPopover from "@/components/popovers/errorPopover";
import { useStateStore } from "@/context/stateStore";
import { errorType } from "@/models/types/error";
import { RecipeFormType } from "../../recipeForm";

export default function AddSteps({ handleCloseChildAndSave, form, handleCancelChild, errors, ingredientPills, handleOpenAdd, thisStep, handleSetValuesUsed, valuesUsed }: { handleCloseChildAndSave: (which: string, newVals: IngredientType[] | StepType[], itemId: number) => void, form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, handleCancelChild: (which: string, currNewIndex: number) => void, errors: errorType[], ingredientPills: StepType[] | IngredientType[], handleOpenAdd: (which: string, index: number) => void, thisStep: StepType, handleSetValuesUsed: (newVals: IngredientType[]) => void, valuesUsed: IngredientType[] }) {
    
    const error = errors ? errors[0] : {} as errorType;
    const errorWhich = error ? error.which as string : '';
    const width = useStateStore(s => s.widthQuery);
    const index = thisStep ? thisStep.stepId as number : -1;
    const save = () => {
        handleCloseChildAndSave('steps', valuesUsed, index);
    }

    const saveAndOpen = () => {
        handleOpenAdd('ingredients', index);
    }

    return (
            <form id="modalAddSteps" className="w-full h-full">
                <Fieldset variant="unstyled" className="flex flex-col justify-center items-center w-full h-full border border-accent bg-altBack space-y-2" style={{ maxHeight: '90vh', overflow: 'hidden', borderRadius: '8px' }} radius={'sm'} px={'sm'} py={'sm'}>
                    <div className="w-full scrollbar-thin scrollbar-webkit space-y-2 flex flex-col" style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
                        <Fieldset className={`flex flex-col justify-start space-y-1 items-center h-fit w-full`} key={index}>
                            <div className="flex flex-row w-full justify-between items-center">
                                <p className="text-xs sm:text-base text-black font-semibold">{`Step #${index + 1}`}</p>
                                <ErrorPopover errors={errors} width={width} />
                            </div>
                            <div className="flex flex-row w-full justify-start items-center">
                                <p className="text-xs">Type: Text</p>
                            </div>
                            <Textarea
                                className={`w-full text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis`}
                                id={`modalStep-${index + 1}-description`}
                                name={`modalStep-${index + 1}-description`}
                                placeholder="Enter your descriptions here"
                                key={form.key(`steps.${index}.description`)}
                                {...form.getInputProps(`steps.${index}.description`)}
                                error={errorWhich === 'description'}
                            />
                            <ComboBoxMultiSelect which="ingredients" pills={ingredientPills} currentVals={valuesUsed} handleSetValuesUsed={handleSetValuesUsed} save={saveAndOpen} currValsLen={valuesUsed.length}/>
                        </Fieldset>
                    </div>
                </Fieldset>
                <section className="flex flex-row w-full justify-evenly items-center pt-5">
                    <button type="button" onClick={() => { handleCancelChild('steps', index); }} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
                        Back
                    </button>
                    <button type="button" className={`border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5`} onClick={save}>
                        Save
                    </button>
                </section>
            </form>
    )
}