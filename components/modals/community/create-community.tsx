'use client'

import { useStateStore } from "@/context/stateStore";
import { Modal } from "@mantine/core"
import { toast } from "sonner";
import { useModalStore } from "@/context/modalStore";
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import CreateCommunityHooks from "@/components/hooks/community/create-community-hooks";
import CreateCommunityForm from "@/components/forms/community/create-community-form";
import { useWindowSizes } from "@/context/width-height-store";


export default function CreateCommunityModal({
    open,
}: {
    open: boolean
}) {

    //Globals
    const setOpenCreateCommunityModal = useModalStore(state => state.setOpenCreateCommunityModal);
    const { width } = useWindowSizes();
    const { HandleCreateCommunity, loading, communityForm } =  CreateCommunityHooks();

    const resetZoom = useStateStore(state => state.handleZoomReset);

    const handleCancel = () => {

        resetZoom(width, false);
        setOpenCreateCommunityModal(false);
        communityForm.reset();
        communityForm.clearErrors();
        communityForm.setValues({
            name: '',
            privacyLevel: 'public',
            communityPassword: '',
            description: '',
            tags: [],
        });
        toast.info("Cancelled Creating Community");

    }

    return (
        <Modal opened={open} onClose={handleCancel} title="Create a Community" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} onAbort={handleCancel} closeOnClickOutside={true} closeOnEscape={true}>
            <LoadingOverlayComponent visible={loading} />
            <CreateCommunityForm handleCreateCommunity={HandleCreateCommunity} handleCancel={handleCancel} communityForm={communityForm} />
        </Modal>
    )
}