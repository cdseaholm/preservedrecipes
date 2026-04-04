'use client'

import { Session } from "next-auth"
import { useStateStore } from "@/context/stateStore";
import { Modal } from "@mantine/core";
import { useState } from "react";
import { toast } from "sonner";
import { useModalStore } from "@/context/modalStore";
import InquiryForm from "@/components/forms/misc/inquiry-form";
import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { IInquiry, InquirySubmitFormType } from "@/models/types/misc/inquiry";
import { useInquiryActions } from "@/components/hooks/inquiry/inquiry-hooks";
import { useWindowSizes } from "@/context/width-height-store";

export default function InquiryModal({ session, inquiry }: { session: Session | null, inquiry: IInquiry | null }) {

    const openInquiryModal = useModalStore(state => state.openInquiryModal);
    const setOpenInquiryModal = useModalStore(state => state.setOpenInquiryModal);
    const setViewSpecificInquiry = useModalStore(state => state.setViewSpecificInquiry);
    const { width } = useWindowSizes();
    const [loading, setLoading] = useState<boolean>(false);
    const resetZoom = useStateStore(state => state.handleZoomReset);

    const { editInquiries, deleteInquiries, createInquiry } = useInquiryActions();

    const handleCreate = async ({ inquiryForm }: { inquiryForm: InquirySubmitFormType }) => {
        setLoading(true);

        const created = await createInquiry({ inquiryForm: inquiryForm, sessionPassed: session });
        if (created) {
            setOpenInquiryModal(false);
            setViewSpecificInquiry(null);
            resetZoom(width, false);
        }
        setLoading(false);

    }

    const handleEditInquiries = async ({ inquirysToEdit }: { inquirysToEdit: IInquiry[] }) => {
        setLoading(true);

        const edited = await editInquiries(inquirysToEdit);
        if (edited) {
            setViewSpecificInquiry(null);
            setOpenInquiryModal(false);
            resetZoom(width, false);
        }
        setLoading(false);
    }

    const handleDeleteInquiries = async ({ inquirysToDelete }: { inquirysToDelete: IInquiry[] }) => {
        setLoading(true);

        const deleted = await deleteInquiries(inquirysToDelete);
        if (deleted) {
            setViewSpecificInquiry(null);
            setOpenInquiryModal(false);
            resetZoom(width, false);
        }
        setLoading(false);
    }

    const handleCancel = () => {

        resetZoom(width, false);
        setViewSpecificInquiry(null);
        setOpenInquiryModal(false);
        toast.info("Cancelled Creating Inquiry");

    }

    return (

        <Modal opened={openInquiryModal} onClose={handleCancel} title="Contact Us" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'80%'} closeOnEscape={true} closeOnClickOutside={true}>
            {loading ? (
                <LoadingSpinner />
            ) : (
                <InquiryForm handleCreateInquiry={handleCreate} handleCancel={handleCancel} inquiry={inquiry} handleEditInquiries={handleEditInquiries} handleDeleteInquiries={handleDeleteInquiries} />
            )}
        </Modal>
    )
}
