'use client'

import { Fieldset, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

export type ChangeFormType = {
    name: string,
    email: string
    password: string
}

export default function ChangeForm({ changeFormToUse, which }: { changeFormToUse: (UseFormReturnType<ChangeFormType, (values: ChangeFormType) => ChangeFormType>), which: string }) {

    const idToUse = which === 'name' ? 'modalChangeUserName' : which === 'email' ? 'modalChangeUserEmail' : 'modalChangeFamilyName'
    const legendToUse = which === 'name' ? 'Name Change Form' : which === 'email' ? 'Email Change Form' : 'Family Name Change Form'
    const labelToUse = which === 'name' ? 'Name' : which === 'email' ? 'Email' : 'Family Name'
    const placeholderToUse = which === 'name' ? 'Johnny Appleseed' : which === 'email' ? 'johnny@appleseed.com' : 'Appleseed'

    return (
        <form id={idToUse} className="w-full">
            <Fieldset legend={legendToUse}>
                <TextInput
                    id={idToUse}
                    name={idToUse}
                    label={labelToUse}
                    placeholder={placeholderToUse}
                    mt={'md'}
                    withAsterisk
                    key={which === 'email' ? changeFormToUse.key('email') : changeFormToUse.key('name')}
                    {...changeFormToUse.getInputProps(which === 'email' ? 'email' : 'name')}
                />
                <TextInput
                    id={'modalChangePassword'}
                    name={'modalChangePassword'}
                    label={'Password'}
                    placeholder={'123Password'}
                    mt={'md'}
                    withAsterisk
                    key={changeFormToUse.key('password')}
                    {...changeFormToUse.getInputProps('password')}
                />
            </Fieldset>
        </form>
    )
}