'use client'

import { Session } from "next-auth"
import { useStateStore } from "@/context/stateStore";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { toast } from "sonner";
import LoadingModal from "../templates/loadingModal";
import { useModalStore } from "@/context/modalStore";
import { AttemptCreateSuggestion } from "@/utils/apihelpers/create/createSuggestion";
import SuggestionForm, { SuggestionFormType } from "@/components/forms/suggestionForm";
import { UseFormReturnType } from "@mantine/form";

export default function SuggestionModal({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const openSuggestionModal = useModalStore(state => state.openSuggestionModal);
    const setOpenSuggestionModal = useModalStore(state => state.setOpenSuggestionModal);
    const width = useStateStore(state => state.widthQuery);
    const [loading, setLoading] = useState<boolean>(false);

    const resetZoom = useStateStore(state => state.handleZoomReset);

    const handleCreateSuggestion = async ({ suggestionForm }: { suggestionForm: UseFormReturnType<SuggestionFormType, (values: SuggestionFormType) => SuggestionFormType> }) => {
        setLoading(true);

        try {

            if (!session) {
                toast.warning("You need to be signed in to make a suggestion!");
                setLoading(false);
                return;
            }

            if (!suggestionForm) {
                toast.error("Something is wrong with your Suggestion information, please try again");
                setLoading(false);
                return;
            }

            const validate = suggestionForm.validate();

            if (validate.hasErrors) {
                console.log(validate.errors);
                console.log(validate);
                return;
            }

            const suggestionToPass = {
                title: suggestionForm.getValues().title,
                suggestion: suggestionForm.getValues().suggestion
            } as SuggestionFormType

            let creationAttempt = await AttemptCreateSuggestion({ suggestion: suggestionToPass }) as { status: boolean, message: string };

            let attemptStatus = creationAttempt ? creationAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error creating suggestion');
                console.log(creationAttempt ? creationAttempt.message : 'Error with message');
                setLoading(false);
                return;
            }

            toast.success('Successfully created suggestion!');
            await handleUpdate();
            resetZoom(width, false);
            setOpenSuggestionModal(false)
            setLoading(false);

        } catch (error) {

            console.error('Error creating suggestion:', error);
            setLoading(false);
            return;

        }
    }

    const handleCancel = () => {

        resetZoom(width, false);
        setOpenSuggestionModal(false)
        toast.info("Cancelled Creating Suggestion");

    }

    return (

        !loading ? (
            <Modal opened={openSuggestionModal} onClose={handleCancel} title="Enter your suggestion" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'}>
                <SuggestionForm handleCreateSuggestion={handleCreateSuggestion} handleCancel={handleCancel} />
            </Modal>
        ) : (
            <LoadingModal open={loading} />
        )
    )
}
