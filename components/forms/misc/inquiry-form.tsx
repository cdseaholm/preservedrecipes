'use client'

import CancelButton from "@/components/buttons/cancelButton";
import SubmitButton from "@/components/buttons/submitButton";
import { IInquiry, InquirySubmitFormType } from "@/models/types/misc/inquiry";
import { Checkbox, Fieldset, Select, Textarea, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function InquiryForm({ handleCreateInquiry, handleCancel, inquiry, handleEditInquiries, handleDeleteInquiries }: { handleCreateInquiry: ({ inquiryForm }: { inquiryForm: InquirySubmitFormType }) => void, handleCancel: () => void, inquiry: IInquiry | null, handleEditInquiries: ({ inquirysToEdit }: { inquirysToEdit: IInquiry[] }) => Promise<void>, handleDeleteInquiries: ({ inquirysToDelete }: { inquirysToDelete: IInquiry[] }) => Promise<void> }) {

    const inquiryForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: inquiry ? inquiry._id : '',
            inquiryTitle: inquiry ? inquiry.inquiryTitle : '',
            inquirerName: inquiry ? inquiry.inquirerName : '',
            inquirerEmail: inquiry ? inquiry.inquirerEmail : '',
            inquiryType: inquiry ? inquiry.inquiryType : '' as 'General' | 'Bug Report' | 'Feature Request' | 'Suggestion' | 'Other' | '',
            inquiryMessage: inquiry ? inquiry.inquiryMessage : '',
            handled: inquiry ? inquiry.handled : false,
            createdAt: inquiry ? inquiry.createdAt : new Date(),
            updatedAt: inquiry ? inquiry.updatedAt : new Date(),
        },
        validate: {
            inquiryType: (value) => (
                value === '' || !value ? 'Please select a topic' : null
            ),
            inquirerName: (value) => (
                value ? null : 'Name cannot be empty'
            ),
            inquirerEmail: (value) => (
                /^\S+@\S+$/.test(value) ? null : 'Invalid email'
            ),
            inquiryMessage: (value) => (
                value ? null : 'Message cannot be empty'
            )
        }
    });

    useEffect(() => {
        if (inquiry) {
            inquiryForm.setValues({
                inquiryTitle: inquiry.inquiryTitle,
                inquiryMessage: inquiry.inquiryMessage,
                inquirerEmail: inquiry.inquirerEmail,
                inquirerName: inquiry.inquirerName,
                createdAt: inquiry.createdAt,
                updatedAt: inquiry.updatedAt,
                id: inquiry._id,
                handled: inquiry.handled,
            });
        } else {
            inquiryForm.reset();
        }
    }, [inquiry?._id]);

    const handleCancelClick = () => {
        inquiryForm.reset();
        inquiryForm.clearErrors();
        handleCancel();
    };

    return (
        <form
            id="modalInquiryForm"
            className="w-full h-content"
            onSubmit={inquiryForm.onSubmit((values) => {
                if (values.id === '') {
                    console.log('values:', values);
                    handleCreateInquiry({ inquiryForm: inquiryForm });
                } else {
                    console.log('values:', values.id);
                    handleEditInquiries({
                        inquirysToEdit: [{
                            _id: values.id,
                            inquiryTitle: values.inquiryTitle,
                            inquiryMessage: values.inquiryMessage,
                            inquirerEmail: values.inquirerEmail,
                            inquirerName: values.inquirerName,
                            createdAt: values.createdAt,
                            updatedAt: new Date(),
                            handled: values.handled,
                        } as IInquiry]
                    });
                }
            })}
        >
            <Fieldset legend="Inquiry Details">
                {inquiryForm.getValues().id !== '' && (
                    <div className="flex flex-row justify-between items-center w-full h-content mt-4 px-6">
                        <Checkbox
                            id="modalInquiryHandled"
                            name="modalInquiryHandled"
                            label="Mark as Completed"
                            key={inquiryForm.key('handled')}
                            {...inquiryForm.getInputProps('handled', { type: 'checkbox' })}
                        />
                        <button type="button" className="text-red-600 underline text-sm hover:text-red-800 cursor-pointer" onClick={async () => {
                            if (inquiry) {
                                await handleDeleteInquiries({ inquirysToDelete: [inquiry] as IInquiry[] });
                            }
                        }}>
                            Delete Inquiry
                        </button>
                    </div>
                )}
                <TextInput
                    id="modalInquiryName"
                    name="modalInquiryName"
                    label={inquiryForm.getValues().id === '' ? "Enter Your Name" : "Inquirer's Name"}
                    placeholder="John Doe"
                    error={inquiryForm.errors.inquirerName}
                    mt={'md'}
                    withAsterisk
                    key={inquiryForm.key('inquirerName')}
                    {...inquiryForm.getInputProps('inquirerName')}
                />
                <TextInput
                    id="modalInquiryEmail"
                    name="modalInquiryEmail"
                    label={inquiryForm.getValues().id === '' ? "Enter Your Email" : "Inquirer's Email"}
                    placeholder="john.doe@example.com"
                    mt={'md'}
                    error={inquiryForm.errors.inquirerEmail}
                    withAsterisk
                    key={inquiryForm.key('inquirerEmail')}
                    {...inquiryForm.getInputProps('inquirerEmail')}
                />
                <Select
                    id="modalInquiryType"
                    name="modalInquiryType"
                    label={inquiryForm.getValues().id === '' ? "Select a Topic" : "Inquiry Topic"}
                    placeholder="Choose a topic"
                    error={inquiryForm.errors.inquiryType}
                    mt={'md'}
                    data={[
                        { value: 'General', label: 'General' },
                        { value: 'Bug Report', label: 'Bug Report' },
                        { value: 'Feature Request', label: 'Feature Request' },
                        { value: 'Suggestion', label: 'Suggestion' },
                        { value: 'Other', label: 'Other' },
                    ]}
                    withAsterisk
                    key={inquiryForm.key('inquiryType')}
                    {...inquiryForm.getInputProps('inquiryType')}
                />
                <Textarea
                    id="modalInquiryInquiry"
                    name="modalInquiryInquiry"
                    label={inquiryForm.getValues().id === '' ? "Enter Your Inquiry" : "Inquiry Message"}
                    placeholder="Enter some details regarding your inquiry..."
                    mt={'md'}
                    withAsterisk
                    error={inquiryForm.errors.inquiryMessage}
                    minRows={6}
                    autosize
                    key={inquiryForm.key('inquiryMessage')}
                    {...inquiryForm.getInputProps('inquiryMessage')}
                />
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-6 pb-4">
                <CancelButton handleCancel={handleCancelClick} />
                <SubmitButton buttonTitle={inquiry ? 'Update' : 'Submit'} />
            </section>
        </form>
    )
}