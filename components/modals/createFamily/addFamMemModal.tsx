'use client'

import { Session } from "next-auth"
import { useStateStore } from "@/context/stateStore";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { toast } from "sonner";
import LoadingModal from "../templates/loadingModal";
import { useModalStore } from "@/context/modalStore";
import { UseFormReturnType } from "@mantine/form";
import { SendInvites } from "@/utils/apihelpers/emails/send";
import { useFamilyStore } from "@/context/familyStore";
import { IFamily } from "@/models/types/family";
import AddFamMemberForm, { NewFamMemFormType } from "@/components/forms/addFamMemForm";

export default function AddFamMemsModal({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const openAddFamMemsModal = useModalStore(state => state.openAddFamMemsModal);
    const setOpenAddFamMemsModal = useModalStore(state => state.setOpenAddFamMemsModal);
    const family = useFamilyStore(state => state.family) as IFamily;
    const width = useStateStore(state => state.widthQuery);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const [loading, setLoading] = useState<boolean>(false);

    if (!family || family._id === '') {
        toast.warning('Must be logged into family')
        return;
    }

    const handleAddFamMem = async ({ addFamMemsForm }: { addFamMemsForm: UseFormReturnType<NewFamMemFormType, (values: NewFamMemFormType) => NewFamMemFormType> }) => {
        setLoading(true);
        try {

            if (!session) {
                toast.warning("You need to be signed in to make a suggestion!");
                setLoading(false);
                return;
            }

            if (!addFamMemsForm) {
                toast.error("Something is wrong with your Suggestion information, please try again");
                setLoading(false);
                return;
            }
            const validate = addFamMemsForm.validate();

            if (validate.hasErrors) {
                addFamMemsForm.setErrors(validate.errors)
                setLoading(false);
                return;
            }

            const familyIDToPass = family._id.toString() || '';
            const emailsToSend = addFamMemsForm.getValues() as NewFamMemFormType


            let invitesSent = await SendInvites({ emails: emailsToSend, familyId: familyIDToPass }) as { status: boolean, message: string };

            let attemptStatus = invitesSent ? invitesSent.status : false;

            if (attemptStatus === false) {
                toast.error('Error Adding Members');
                setLoading(false);
                return;
            }

            toast.success('Successfully created suggestion!');
            await handleUpdate();
            resetZoom(width, false);
            setOpenAddFamMemsModal(false)
            setLoading(false);

        } catch (error) {

            console.error('Error Adding Members:', error);
            setLoading(false);
            return;

        }
    }

    const handleCancel = () => {

        resetZoom(width, false);
        setOpenAddFamMemsModal(false)
        toast.info("Cancelled Adding Members");

    }

    return (

        !loading ? (
            <Modal opened={openAddFamMemsModal} onClose={handleCancel} title="Enter Family Members to add" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'}>
                <AddFamMemberForm handleAddFamMem={handleAddFamMem} handleCancel={handleCancel} />
            </Modal>
        ) : (
            <LoadingModal open={loading} />
        )
    )
}
