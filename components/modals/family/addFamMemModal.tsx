'use client'

import { Session } from "next-auth"
import { useStateStore } from "@/context/stateStore";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { toast } from "sonner";
import { useModalStore } from "@/context/modalStore";
//import { SendInvites } from "@/utils/apihelpers/emails/send";
import { useFamilyStore } from "@/context/familyStore";
import { SendInvites } from "@/emails/send";
import AddFamMemberForm from "@/components/forms/family/addFamMemForm";
import { IFamily } from "@/models/types/family/family";
import { NewFamMemFormType } from "@/models/types/family/new-fam";
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import { useWindowSizes } from "@/context/width-height-store";

export default function AddFamMemsModal({ session, handleUpdate }: { session: Session | null, handleUpdate: () => Promise<void> }) {

    const openAddFamMemsModal = useModalStore(state => state.openAddFamMemsModal);
    const setOpenAddFamMemsModal = useModalStore(state => state.setOpenAddFamMemsModal);
    const family = useFamilyStore(state => state.family) as IFamily;
    const { width } = useWindowSizes();
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const [loading, setLoading] = useState<boolean>(false);

    if (!family || family._id === '') {
        toast.warning('Must be logged into family')
        return;
    }

    const handleAddFamMem = async ({ emails }: { emails: NewFamMemFormType }) => {
        setLoading(true);
        try {

            if (!session) {
                toast.warning("You need to be signed in to make a suggestion!");
                setLoading(false);
                return;
            }

            if (!emails.newMembers.length) {
                toast.error("Add at least one email before creating invites");
                setLoading(false);
                return;
            }

            const familyIDToPass = family._id.toString() || '';
            let invitesSent = await SendInvites({ emails, familyId: familyIDToPass }) as { status: boolean, message: string };

            let attemptStatus = invitesSent ? invitesSent.status : false;

            if (attemptStatus === false) {
                toast.error(invitesSent?.message || 'Error adding members');
                setLoading(false);
                return;
            }

            toast.success(invitesSent.message || 'Successfully sent invites!');
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

            <Modal opened={openAddFamMemsModal} onClose={handleCancel} title="Enter Family Members to add" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'}>
                <LoadingOverlayComponent visible={loading} />
                <AddFamMemberForm handleAddFamMem={handleAddFamMem} handleCancel={handleCancel} />
            </Modal>
    )
}
