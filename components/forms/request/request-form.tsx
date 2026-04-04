'use client'

import CancelButton from "@/components/buttons/cancelButton";
import SubmitButton from "@/components/buttons/submitButton";
import { ICommunity } from "@/models/types/community/community";
import { IRequest } from "@/models/types/misc/request";
import { Fieldset, Select, Textarea, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function RequestForm({ handleCreateRequest, handleCancel, request, community }: { handleCreateRequest: () => Promise<void>, handleCancel: () => void, request: IRequest | null, community: ICommunity | null }) {

    const showCommunity = false;
    if (showCommunity) {
        //Just doing this to clear the warning about unused variable, will need community info for some request types, so keeping this here for now
        console.log("Community info:", community);
    }

    const requestForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: request ? request._id : '',
            requestFor: request ? request.requestFor : '',
            requesterID: request ? request.requesterID : '',
            requestType: request ? request.requestFor.type : '' as '' | '',
        },
        validate: {
            requestType: (value) => (
                value === '' || !value ? 'Please select a topic' : null
            ),
        }
    });

    useEffect(() => {
        if (request) {
            requestForm.setValues({
                id: request._id,
                requestFor: request.requestFor,
                requesterID: request.requesterID,
                requestType: request.requestFor.type,
            });
        } else {
            requestForm.reset();
        }
    }, [request?._id]);

    const handleCancelClick = () => {
        requestForm.reset();
        requestForm.clearErrors();
        handleCancel();
    };

    return (
        <form
            id="modalRequestForm"
            className="w-full h-content"
            onSubmit={requestForm.onSubmit(() => {
                handleCreateRequest();
            })}
        >
            <Fieldset legend="Request Details">
                <TextInput
                    id="modalRequestName"
                    name="modalRequestName"
                    label={requestForm.getValues().id === '' ? "Enter Your Name" : "Inquirer's Name"}
                    placeholder="John Doe"
                    error={requestForm.errors.inquirerName}
                    mt={'md'}
                    withAsterisk
                    key={requestForm.key('inquirerName')}
                    {...requestForm.getInputProps('inquirerName')}
                />
                <TextInput
                    id="modalRequestEmail"
                    name="modalRequestEmail"
                    label={requestForm.getValues().id === '' ? "Enter Your Email" : "Inquirer's Email"}
                    placeholder="john.doe@example.com"
                    mt={'md'}
                    error={requestForm.errors.inquirerEmail}
                    withAsterisk
                    key={requestForm.key('inquirerEmail')}
                    {...requestForm.getInputProps('inquirerEmail')}
                />
                <Select
                    id="modalRequestType"
                    name="modalRequestType"
                    label={requestForm.getValues().id === '' ? "Select a Topic" : "Request Topic"}
                    placeholder="Choose a topic"
                    error={requestForm.errors.requestType}
                    mt={'md'}
                    data={[
                        { value: 'General', label: 'General' },
                        { value: 'Bug Report', label: 'Bug Report' },
                        { value: 'Feature Request', label: 'Feature Request' },
                        { value: 'Suggestion', label: 'Suggestion' },
                        { value: 'Other', label: 'Other' },
                    ]}
                    withAsterisk
                    key={requestForm.key('requestType')}
                    {...requestForm.getInputProps('requestType')}
                />
                <Textarea
                    id="modalRequestRequest"
                    name="modalRequestRequest"
                    label={requestForm.getValues().id === '' ? "Enter Your Request" : "Request Message"}
                    placeholder="Enter some details regarding your request..."
                    mt={'md'}
                    withAsterisk
                    error={requestForm.errors.requestMessage}
                    minRows={6}
                    autosize
                    key={requestForm.key('requestMessage')}
                    {...requestForm.getInputProps('requestMessage')}
                />
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-6 pb-4">
                <CancelButton handleCancel={handleCancelClick} />
                <SubmitButton buttonTitle={request ? 'Update' : 'Submit'} />
            </section>
        </form>
    )
}