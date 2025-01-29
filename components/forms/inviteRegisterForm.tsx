'use client'

import { Fieldset, TextInput, PasswordInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";

export type InviteRegisterFormType = {

    name: string;
    email: string;
    password: string;
    confirmPassword: string;

}


export default function InviteRegisterForm({ handleRegister }: { handleRegister: ({ inviteRegisterForm }: { inviteRegisterForm: UseFormReturnType<InviteRegisterFormType, (values: InviteRegisterFormType) => InviteRegisterFormType> }) => void }) {

    const inviteRegisterForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validate: {
            name: (value) => (
                !value ? 'Name is required' : null
            ),
            email: (value) => (
                !value ? 'Email is required'
                    : !/^\S+@\S+$/.test(value) ? 'Invalid email'
                        : value.length < 5 ? 'Invalid email'
                            : null
            ),
            password: (value) => (
                !value ? 'Password is required'
                    : value.length < 5 ? 'Password length must be greater than 5 characters' : null
            ),
            confirmPassword: (value, values) => (
                !value ? 'Must confirm your password'
                    : value.length < 5 ? 'Password length must be greater than 5 characters'
                        : value !== values.password ? 'Confirm Password and Password must match'
                            : null
            )
        }
    });

    return (
        <form id="modalRegisterForm" onSubmit={inviteRegisterForm.onSubmit(() => handleRegister({ inviteRegisterForm }))} className="w-full" >
            <Fieldset legend="Personal Invite Register">
                <TextInput
                    id="modalInviteRegisterName"
                    name="modalInviteRegisterName"
                    label="Name"
                    placeholder="Johnny Appleseed"
                    mt={'md'}
                    withAsterisk
                    key={inviteRegisterForm.key('name')}
                    {...inviteRegisterForm.getInputProps('name')}
                />
                <TextInput
                    id="modalInviteRegisterEmail"
                    name="modalInviteRegisterEmail"
                    label="Email"
                    placeholder="email@email.com"
                    mt={'md'}
                    withAsterisk
                    key={inviteRegisterForm.key('email')}
                    {...inviteRegisterForm.getInputProps('email')}
                />
                <PasswordInput
                    id="modalInviteRegisterPw"
                    name="modalInviteRegisterPw"
                    label="Password"
                    placeholder="******"
                    withAsterisk
                    mt={'md'}
                    key={inviteRegisterForm.key('password')}
                    {...inviteRegisterForm.getInputProps('password')}
                />
                <PasswordInput
                    id="modalInviteRegisterConfirmPw"
                    name="modalInviteRegisterConfirmPw"
                    label="Confirm Password"
                    placeholder="******"
                    withAsterisk
                    mt={'md'}
                    key={inviteRegisterForm.key('confirmPassword')}
                    {...inviteRegisterForm.getInputProps('confirmPassword')}
                />
            </Fieldset>
            <div className="flex flex-row w-full justify-evenly items-center pt-5">
                <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                    Register
                </button>
            </div>
        </form>
    )
}