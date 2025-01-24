'use client'

import ErrorPopover from "@/components/popovers/errorPopover";
import { Fieldset, TagsInput } from "@mantine/core";
import { useStateStore } from "@/context/stateStore";
import { errorType } from "@/models/types/error";
import { UseFormReturnType } from "@mantine/form";
import { RecipeFormType } from "../recipeForm";
import ModalTemplate from "@/components/modals/templates/modalTemplate";

export default function RecipeViewers({ handleSaveAndCloseViewers, errors, form, handleCancelViewers }: { handleSaveAndCloseViewers: () => Promise<void>, errors: errorType[], form: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, handleCancelViewers: () => void }) {

    const width = useStateStore(s => s.widthQuery);

    const error = errors ? errors[0] : {} as errorType;
    const errorWhich = error ? error.which as string : '';
    const minWidth = width < 800 ? '80vw' : '60vw';

    const save = async () => {
        await handleSaveAndCloseViewers();
    }
    
    return (
        <ModalTemplate subtitle={null} minHeight="15vh" minWidth={minWidth}>
            <form id="modalAddViewers" className="w-full h-full">
                <Fieldset variant="unstyled" className="flex flex-col justify-center items-center w-full h-full border border-accent bg-altBack space-y-2" style={{ maxHeight: '90vh', overflow: 'hidden', borderRadius: '8px' }} radius={'sm'} px={'sm'} py={'sm'}>
                    <div className="w-full scrollbar-thin scrollbar-webkit space-y-2 flex flex-col" style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
                        <Fieldset className={`flex flex-col justify-start space-y-1 items-center h-fit w-full`} key={'Recipe Viewers'}>
                            <div className="flex flex-row w-full justify-between items-center">
                                <p className="text-xs sm:text-base text-black font-semibold">{`Recipe Viewers`}</p>
                                <ErrorPopover errors={errors} width={width} />
                            </div>
                            <TagsInput
                                className={`w-full text-xs sm:text-sm`}
                                id={`modalRecipeViewers`}
                                name={`modalRecipeViewers`}
                                placeholder="Enter an email here to add a secret recipe viewer"
                                key={form.key(`secretViewerIDs`)}
                                {...form.getInputProps(`secretViewerIDs`)}
                                error={errorWhich === 'viewers'}
                            />
                        </Fieldset>
                    </div>
                </Fieldset>
                <section className="flex flex-row w-full justify-evenly items-center pt-5">
                    <button type="button" onClick={() => { handleCancelViewers(); }} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
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