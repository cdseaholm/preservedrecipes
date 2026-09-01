'use client'

import CancelButton from "@/components/buttons/cancelButton";
import GoogleSignInButton from "@/components/buttons/googleSignInButton";
import SubmitButton from "@/components/buttons/submitButton";
import { Divider, Fieldset, PasswordInput, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";

export type SignInFormType = {
    email: string;
    password: string;
}

export default function SignInForm({ handleSignIn, handleCancel, loading = false }: { handleSignIn: ({ signInForm }: { signInForm: UseFormReturnType<SignInFormType, (values: SignInFormType) => SignInFormType> }) => void, handleCancel: () => void, loading?: boolean }) {

    const signInForm = useForm({
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
        <form id="modalLoginForm" onSubmit={signInForm.onSubmit(() => handleSignIn({ signInForm }))} onAbort={() => { signInForm.reset(); signInForm.clearErrors(); handleCancel(); }} className="w-full">
            <GoogleSignInButton />
            <Divider label="or sign in with email" labelPosition="center" my="md" />
            <Fieldset legend="Personal Information">
                <TextInput
                    id="modalLoginEmail"
                    name="modalLoginEmail"
                    label="Email"
                    placeholder="email@email.com"
                    mt={'md'}
                    withAsterisk
                    key={signInForm.key('email')}
                    {...signInForm.getInputProps('email')}
                />
                <PasswordInput
                    id="modalLoginPw"
                    name="modalLoginPw"
                    label="Password"
                    placeholder="******"
                    withAsterisk
                    key={signInForm.key('password')}
                    {...signInForm.getInputProps('password')}
                />
            </Fieldset>
            <section className="flex w-full flex-col items-stretch justify-evenly gap-3 pt-5 sm:flex-row sm:items-center">
                <CancelButton handleCancel={() => { signInForm.reset(); signInForm.clearErrors(); handleCancel(); }} />
                <SubmitButton buttonTitle="Sign In" loading={loading} loadingTitle="Signing in..." />
            </section>
        </form>
    )
}
