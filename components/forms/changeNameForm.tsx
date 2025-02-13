'use client'

import { Fieldset, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { RegisterFormType } from "./registerForm";

export default function ChangeNameForm({ changeNameForm }: { changeNameForm: UseFormReturnType<RegisterFormType, (values: RegisterFormType) => RegisterFormType> }) {

    return (
        <form id="modalRegisterForm" className="w-full" >
            <Fieldset legend="Personal Invite Register">
                <TextInput
                    id="modalInviteRegisterName"
                    name="modalInviteRegisterName"
                    label="Name"
                    placeholder="Johnny Appleseed"
                    mt={'md'}
                    withAsterisk
                    key={changeNameForm.key('name')}
                    {...changeNameForm.getInputProps('name')}
                />
            </Fieldset>
        </form>
    )
}