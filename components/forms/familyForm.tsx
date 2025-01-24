'use client'

import { useStateStore } from "@/context/stateStore";
import { Fieldset, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";
import { MultiSelectCheckbox } from "../misc/combobox/multiSelectChecks";
import { HeritageType } from "@/models/types/inAppCreations/heritage";
import ErrorPopover from "../popovers/errorPopover";
import { errorType } from "@/models/types/error";

export type FamilyFormType = {
    name: string;
    heritage: HeritageType[];
}


export default function FamilyForm({ handleCreateFamily, handleCancel, errors }: { handleCreateFamily: ({ familyForm }: { familyForm: UseFormReturnType<FamilyFormType, (values: FamilyFormType) => FamilyFormType> }) => void, handleCancel: () => void, errors: errorType[] }) {

    const width = useStateStore(s => s.widthQuery);
    const errorsExist = errors ? true : false;
    const errName = errorsExist && errors.find((err) => err.which === 'name') ? true : false;

    const familyForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            heritage: [] as HeritageType[],
        },
        validate: {
            name: (value) => (
                value ? (value.length > 100 ? 'Invalid name too long' : null) : 'Name cannot be empty'
            ),
            heritage: (_value) => null,
        }
    });

    return (
        <form id="modalCreateFamilyForm" className="w-full h-full" onSubmit={familyForm.onSubmit(() => handleCreateFamily({ familyForm }))}>
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
                <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5 text-xs sm:text-sm">
                    Create
                </button>
            </section>
        </form>
    )
}