'use client'

import CancelButton from "@/components/buttons/cancelButton";
import SubmitButton from "@/components/buttons/submitButton";
import { ICommunity } from "@/models/types/community/community";
import { IRequest } from "@/models/types/misc/request";
import { Fieldset, Textarea } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function RequestForm({ handleCreateRequest, handleCancel, request, community }: { handleCreateRequest: (message: string) => Promise<void>, handleCancel: () => void, request: IRequest | null, community: ICommunity | null }) {

    const requestForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: request ? request._id : '',
            requestFor: request ? request.requestFor : '',
            requesterID: request ? request.requesterID : '',
            message: '',
        },
        validate: {
            message: (value) => (
                !value || value.trim().length < 8 ? 'Add a short note for the admins' : null
            ),
        }
    });

    useEffect(() => {
        if (request) {
            requestForm.setValues({
                id: request._id,
                requestFor: request.requestFor,
                requesterID: request.requesterID,
                message: request.message || '',
            });
        } else {
            requestForm.reset();
        }
    }, [request?._id, request?.requestFor, request?.requesterID, requestForm, request]);

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
                handleCreateRequest(requestForm.getValues().message);
            })}
        >
            <Fieldset legend={`Request to join ${community?.name || 'community'}`}>
                <Textarea
                    id="modalRequestRequest"
                    name="modalRequestRequest"
                    label="Message to admins"
                    placeholder="Tell the admins why this community is a good fit for you."
                    mt={'md'}
                    withAsterisk
                    error={requestForm.errors.message}
                    minRows={6}
                    autosize
                    key={requestForm.key('message')}
                    {...requestForm.getInputProps('message')}
                />
            </Fieldset>
            <section className="flex flex-row w-full justify-evenly items-center pt-6 pb-4">
                <CancelButton handleCancel={handleCancelClick} />
                <SubmitButton buttonTitle={request ? 'Update' : 'Submit'} />
            </section>
        </form>
    )
}
