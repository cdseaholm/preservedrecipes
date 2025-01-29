'use client'

import { Fieldset, PasswordInput, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";

export type InviteSignInFormType = {
    email: string;
    password: string;
}

export default function InviteSignInForm({ handleSignIn, handleCancel, accepting }: { handleSignIn: ({ inviteSignInForm }: { inviteSignInForm: UseFormReturnType<InviteSignInFormType, (values: InviteSignInFormType) => InviteSignInFormType> }) => void, handleCancel: () => void, accepting: boolean }) {

    const inviteSignInForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        },
        validate: {
            email: (value) => (
                !/^\S+@\S+$/.test(value) ? 'Invalid email'
                    : value.length < 5 ? 'Invalid email'
                        : null
            ),
            password: (value: string) => (
                value.length < 5 ? 'Password length must be greater than 5 characters' : null
            )
        }
    });

    return (
        <form id="modalLoginForm" onSubmit={inviteSignInForm.onSubmit(() => handleSignIn({ inviteSignInForm }))} onAbort={() => { inviteSignInForm.reset(); inviteSignInForm.clearErrors(); handleCancel(); }} className="w-full">
            <Fieldset legend="Personal Information">
                <TextInput
                    id="modalInviteLoginEmail"
                    name="modalLoginEmail"
                    label="Email"
                    placeholder="email@email.com"
                    mt={'md'}
                    withAsterisk
                    key={inviteSignInForm.key('email')}
                    {...inviteSignInForm.getInputProps('email')}
                />
                <PasswordInput
                    id="modalInviteLoginPw"
                    name="modalLoginPw"
                    label="Password"
                    placeholder="******"
                    withAsterisk
                    key={inviteSignInForm.key('password')}
                    {...inviteSignInForm.getInputProps('password')}
                />
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-5">
                <button type="button" onClick={() => { inviteSignInForm.reset(); inviteSignInForm.clearErrors(); handleCancel(); }} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2">
                    Cancel
                </button>
                <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                    {accepting ? 'Accept Invite' : 'Sign In'}
                </button>
            </section>
        </form>
    )
}