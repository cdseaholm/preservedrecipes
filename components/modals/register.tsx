'use client'

import { useModalStore } from "@/context/modalStore";
import RegisterHelper from "@/utils/userHelpers/registerHelper";
import { Fieldset, Modal, PasswordInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useState } from "react";
import { toast } from "sonner";
import ModalTemplate from "./templates/modalTemplate";
import { IUser } from "@/models/types/user";
import SignInHelper from "@/utils/userHelpers/signInHelper";
import { LoadingSpinner } from "../misc/loadingSpinner";
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";

export default function RegisterModal({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const openRegisterModal = useModalStore(state => state.openRegisterModal);
    const setOpenRegisterModal = useModalStore(state => state.setOpenRegisterModal);
    const [loading, setLoading] = useState<boolean>(false);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);

    const form = useForm({
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

    const handleRegister = async ({ name, email, password }: { name: string, email: string, password: string }) => {

        setLoading(true)
        try {

            form.clearErrors();

            if (session) {
                toast.warning("You are already signed in!")
                return;
            }

            const validation = form.validate();

            if (!validation) {
                return;
            }

            let signInAttempt = await RegisterHelper({ namePassed: name, emailPassed: email, pwPassed: password }) as { status: boolean, newUser: IUser };

            let attemptStatus = false;
            let createdUser = {} as IUser;

            if (!signInAttempt) {
                toast.error('Error registering');
                return
            }

            attemptStatus = signInAttempt.status;
            createdUser = signInAttempt.newUser;

            if (attemptStatus === false || createdUser === {} as IUser) {
                toast.error('Error Registering')
                return;
            } else {

                let signInAttempt = await SignInHelper({ emailPassed: email, pwPassed: password }) as { status: boolean };

                if (!signInAttempt) {
                    toast.error('Error signing in')
                    return;
                }

                toast.success('Registered and Signed in!');
                form.reset();
                form.clearErrors();
                await handleUpdate();
                resetZoom(width, false);
                setOpenRegisterModal(false)
                //setOpenPref(true)
            }

        } catch (error) {
            console.error('Error Registering in:', error);
        }
    }

    const handleCancel = () => {
        form.reset();
        form.clearErrors();
        resetZoom(width, false);
        setOpenRegisterModal(false);
        toast.info("Cancelled Registering");
    }

    return (
        <Modal.Stack>
            <Modal opened={openRegisterModal} onClose={handleCancel} title="Register" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false}>
                <ModalTemplate subtitle={null} minHeight="15vh" minWidth="15vw">
                    {loading ? (
                        <LoadingSpinner screen={true} />
                    ) : (
                        <form id="modalRegisterForm" onSubmit={form.onSubmit((values) => handleRegister(values))} onAbort={handleCancel} className="w-full">
                            <Fieldset legend="Personal Information">
                                <TextInput
                                    id="modalRegisterName"
                                    name="modalRegisterName"
                                    label="Name"
                                    placeholder="Johnny Appleseed"
                                    mt={'md'}
                                    withAsterisk
                                    key={form.key('name')}
                                    {...form.getInputProps('name')}
                                />
                                <TextInput
                                    id="modalRegisterEmail"
                                    name="modalRegisterEmail"
                                    label="Email"
                                    placeholder="email@email.com"
                                    mt={'md'}
                                    withAsterisk
                                    key={form.key('email')}
                                    {...form.getInputProps('email')}
                                />
                                <PasswordInput
                                    id="modalRegisterPw"
                                    name="modalRegisterPw"
                                    label="Password"
                                    placeholder="******"
                                    withAsterisk
                                    mt={'md'}
                                    key={form.key('password')}
                                    {...form.getInputProps('password')}
                                />
                                <PasswordInput
                                    id="modalRegisterConfirmPw"
                                    name="modalRegisterConfirmPw"
                                    label="Confirm Password"
                                    placeholder="******"
                                    withAsterisk
                                    mt={'md'}
                                    key={form.key('confirmPassword')}
                                    {...form.getInputProps('confirmPassword')}
                                />
                            </Fieldset>
                            <section className="flex flex-row w-full justify-evenly items-center pt-5">
                                <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2">
                                    Cancel
                                </button>
                                <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                                    Register
                                </button>
                            </section>
                        </form>
                    )}
                </ModalTemplate>
            </Modal>
        </Modal.Stack>
    )
}