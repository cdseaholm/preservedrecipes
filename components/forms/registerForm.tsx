'use client'

import { Fieldset, TextInput, PasswordInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";

export type RegisterFormType = {

    name: string;
    email: string;
    password: string;
    confirmPassword: string;

}


export default function RegisterForm({ handleRegister }: { handleRegister: ({ registerForm }: { registerForm: UseFormReturnType<RegisterFormType, (values: RegisterFormType) => RegisterFormType> }) => void }) {

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
            <Fieldset legend="Personal InregisterFormation">
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
            <div className="flex flex-row w-full justify-evenly items-center pt-5">
                <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                    Register
                </button>
            </div>
        </form>
    )
}