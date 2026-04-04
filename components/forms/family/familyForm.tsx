'use client'

import { Fieldset, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";
import { MultiSelectCheckbox } from "../../misc/combobox/multiSelectChecks";
import { HeritageType } from "@/models/types/inAppCreations/heritage";
import ErrorPopover from "../../popovers/errorPopover";
import SubmitButton from "../../buttons/submitButton";
import CancelButton from "../../buttons/cancelButton";
import { errorType } from "@/models/types/misc/error";
import { useWindowSizes } from "@/context/width-height-store";

export type FamilyFormType = {
    name: string;
    heritage: HeritageType[];
}


export default function FamilyForm({ handleCreateFamily, handleCancel, errors }: { handleCreateFamily: ({ familyForm }: { familyForm: UseFormReturnType<FamilyFormType, (values: FamilyFormType) => FamilyFormType> }) => void, handleCancel: () => void, errors: errorType[] }) {

    const { width } = useWindowSizes();
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
                    placeholder="Addams"
                    mt={'md'}
                    withAsterisk
                    key={familyForm.key('name')}
                    {...familyForm.getInputProps('name')}
                    error={errName}
                    className="overflow-hidden whitespace-nowrap text-ellipsis pb-5"
                />
                <MultiSelectCheckbox form={familyForm} />
                <div className="flex flex-col justify-start items-center w-full h-content px-2 py-7">
                    <p className="text-center text-gray-700">{`Once you have created the family here, you can add members from your profile.`}</p>
                    <p className="text-center text-gray-700">{`Looking to join a family? Have one of the family admins send an invite to your email. Once you accept the invite, you'll be added to the family.`}</p>
                </div>
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-12 pb-8">
                <CancelButton handleCancel={handleCancel} />
                <SubmitButton buttonTitle="Create"/>
            </section>
        </form>
    )
}