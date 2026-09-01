'use client'

import SubmitButton from "@/components/buttons/submitButton";
import { RegisterFormType } from "@/models/types/misc/register";
import { Fieldset, TextInput, PasswordInput } from "@mantine/core"
import { useForm } from "@mantine/form";


export default function RegisterForm({ handleRegister, loading = false }: { handleRegister: ({ registerForm }: { registerForm: RegisterFormType }) => void, loading?: boolean }) {

    const registerForm = useForm({
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
        <form id="modalRegisterForm" onSubmit={registerForm.onSubmit(() => handleRegister({ registerForm }))} className="w-full" >
            <Fieldset legend="Personal Information">
                <TextInput
                    id="modalRegisterName"
                    name="modalRegisterName"
                    label="Name"
                    placeholder="Johnny Appleseed"
                    mt={'md'}
                    withAsterisk
                    key={registerForm.key('name')}
                    {...registerForm.getInputProps('name')}
                />
                <TextInput
                    id="modalRegisterEmail"
                    name="modalRegisterEmail"
                    label="Email"
                    placeholder="email@email.com"
                    mt={'md'}
                    withAsterisk
                    key={registerForm.key('email')}
                    {...registerForm.getInputProps('email')}
                />
                <PasswordInput
                    id="modalRegisterPw"
                    name="modalRegisterPw"
                    label="Password"
                    placeholder="******"
                    withAsterisk
                    mt={'md'}
                    key={registerForm.key('password')}
                    {...registerForm.getInputProps('password')}
                />
                <PasswordInput
                    id="modalRegisterConfirmPw"
                    name="modalRegisterConfirmPw"
                    label="Confirm Password"
                    placeholder="******"
                    withAsterisk
                    mt={'md'}
                    key={registerForm.key('confirmPassword')}
                    {...registerForm.getInputProps('confirmPassword')}
                />
            </Fieldset>
            <div className="flex w-full flex-col items-stretch justify-evenly gap-3 pt-5 sm:flex-row sm:items-center">
                <SubmitButton buttonTitle="Register" loading={loading} loadingTitle="Creating account..." />
            </div>
        </form>
    )
}
