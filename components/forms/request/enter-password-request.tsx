'use client'

import CancelButton from "@/components/buttons/cancelButton";
import SubmitButton from "@/components/buttons/submitButton";
import { ICommunity } from "@/models/types/community/community";
import { IRequest } from "@/models/types/misc/request";
import { CommunityJoinWithPassword } from "@/utils/apihelpers/edit/community-join-w-pw";
import { PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { toast } from "sonner";

export default function EnterPasswordRequest({ handleCancel, request, community, handleLoading }: { handleCancel: () => void, request: IRequest | null, community: ICommunity | null, handleLoading: (loading: boolean) => void }) {

    const requestForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: request ? request._id : '',
            requestFor: request ? request.requestFor : '',
            requesterID: request ? request.requesterID : '',
            requestType: request ? request.requestFor.type : '' as '' | '',
            password: '',
        },
        validate: {
            requestType: (value) => (
                value === '' || !value ? 'Please select a topic' : null
            ),
        }
    });

    const handleAttemptToJoin = async () => {

        if (!community) {
            toast.error("No community selected.");
            return;
        }

        try {
            handleLoading(true);
            toast.info("Submitting Request...");
            const attemptingToJoin = await CommunityJoinWithPassword({
                communityID: community._id,
                password: requestForm.getValues().password,
            });
            if (!attemptingToJoin) {
                toast.error("Failed to join community.");
                handleLoading(false);
                return;
            }
            if (attemptingToJoin.status) {
                toast.success("Successfully joined community!");
                handleCancel();
            } else {
                toast.error(`Failed to join community, ${attemptingToJoin.message}`);
                handleLoading(false);
            }
        } catch (error: any) {
            toast.error(`Failed to join community, ${error.message}`);
        }
    }

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
    }, [request, request?._id, request?.requestFor, request?.requesterID, requestForm]);

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
                handleAttemptToJoin();
            })}
        >
            <PasswordInput
                id="communityPasswordInput"
                name="communityPasswordInput"
                label="Community Password"
                placeholder="Enter the community password"
                key={'communityPasswordInput'}
                {...requestForm.getInputProps('password')}
                required
                className="w-full mb-4"
            />

            <section className="flex flex-row w-full justify-evenly items-center pt-6 pb-4">
                <CancelButton handleCancel={handleCancelClick} />
                <SubmitButton buttonTitle={'Submit'} />
            </section>
        </form>
    )
}