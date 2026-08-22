'use client'

import CancelButton from "@/components/buttons/cancelButton";
import SubmitButton from "@/components/buttons/submitButton";
import { Button, Divider, Fieldset, PasswordInput, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export type SignInFormType = {
    email: string;
    password: string;
}

export default function SignInForm({ handleSignIn, handleCancel }: { handleSignIn: ({ signInForm }: { signInForm: UseFormReturnType<SignInFormType, (values: SignInFormType) => SignInFormType> }) => void, handleCancel: () => void }) {

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
            <Button
                type="button"
                variant="default"
                fullWidth
                leftSection={<FcGoogle />}
                onClick={() => signIn('google', { callbackUrl: '/u/profile' })}
            >
                Continue with Google
            </Button>
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
            <section className="flex flex-row w-full justify-evenly items-center pt-5">
                <CancelButton handleCancel={() => { signInForm.reset(); signInForm.clearErrors(); handleCancel(); }} />
                <SubmitButton buttonTitle={'Sign In'} />
            </section>
        </form>
    )
}
