'use client'

import ErrorPopover from "@/components/popovers/errorPopover";
import { useStateStore } from "@/context/stateStore";
import { errorType } from "@/models/types/error";
import { Fieldset, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { FamilyCreation } from "@/models/types/inAppCreations/familyCreation";
import { MultiSelectCheckbox } from "@/components/misc/combobox/multiSelectChecks";

export default function DefaultFamilyModal({ handleCancel, handleCreateFamily, familyForm, errors }: { handleCancel: () => void, handleCreateFamily: (initialValues: FamilyCreation) => void, familyForm: UseFormReturnType<FamilyCreation, (values: FamilyCreation) => FamilyCreation>, errors: errorType[] }) {

    const width = useStateStore(s => s.widthQuery);
    const errorsExist = errors ? true : false;
    const errName = errorsExist && errors.find((err) => err.which === 'name') ? true : false;

    return (
        <form id="modalCreateFamilyForm" className="w-full h-full">
            <Fieldset legend="Family Details" mah={600}>
                <div className="flex flex-row w-full justify-end items-center">
                    <ErrorPopover errors={errors} width={width} />
                </div>
                <TextInput
                    id="modalFamilyName"
                    name="modalFamilyName"
                    label="Family Name"
                    placeholder="Seaholm"
                    mt={'md'}
                    withAsterisk
                    key={familyForm.key('name')}
                    {...familyForm.getInputProps('name')}
                    error={errName}
                    className="overflow-hidden whitespace-nowrap text-ellipsis pb-5"
                />
                <MultiSelectCheckbox form={familyForm} />
                <div className="flex flex-row justify-center items-center w-full h-content px-2 py-7">
                    <p className="text-center text-gray-700">{`Once you have created the family here, you can add members from your profile`}</p>
                </div>
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-12 pb-8">
                <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5 text-xs sm:text-sm">
                    Cancel
                </button>
                <button type='button' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5 text-xs sm:text-sm" onClick={() => handleCreateFamily(familyForm.getValues())}>
                    Create
                </button>
            </section>
        </form>
    )
}