'use client'

import { ChangeFamNameFormType } from "@/models/types/family/change-fam-types";
import { Fieldset, TextInput } from "@mantine/core";

export default function ChangeFamNameForm({ changeFormToUse }: { changeFormToUse: ChangeFamNameFormType }) {

    return (
        <form id={'modalChangeFamilyName'} className="w-full">
            <Fieldset legend={'Family Name Change Form'}>
                <TextInput
                    id={`modalChangeFamilyNameinput`}
                    name={`modalChangeFamilyNameinput`}
                    label={'Family Name'}
                    placeholder={'Appleseed'}
                    mt={'md'}
                    withAsterisk
                    key={changeFormToUse.key('name')}
                    {...changeFormToUse.getInputProps('name')}
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