'use client'

import { useStateStore } from "@/context/stateStore";
import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useModalStore } from "@/context/modalStore";
import RequestForm from "@/components/forms/request/request-form";
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import EnterPasswordRequest from "@/components/forms/request/enter-password-request";
import { IRequest } from "@/models/types/misc/request";
import { useUserStore } from "@/context/userStore";
import { useWindowSizes } from "@/context/width-height-store";

export default function RequestModal() {

    const userInfo = useUserStore(state => state.userInfo);
    const requestToJoinCommunity = useModalStore(state => state.requestToJoinCommunity);
    const setRequestToJoinCommunity = useModalStore(state => state.setRequestToJoinCommunity);
    const { width } = useWindowSizes();
    const [loading, setLoading] = useState<boolean>(false);
    const resetZoom = useStateStore(state => state.handleZoomReset);

    const handleCreate = async () => {
        setLoading(true);
        toast.info("Submitting Request...");
        // const created = await createRequestToJoinCommunity({ inquiryForm: inquiryForm, sessionPassed: session });
        // if (created) {
        //     setRequestToJoinCommunity(null);
        //     resetZoom(widthQuery, false);
        // }
        setLoading(false);
    }

    const handleCancel = () => {
        resetZoom(width, false);
        setRequestToJoinCommunity(null);
    }

    const handleLoading = (loading: boolean) => {
        setLoading(loading);
    }

    useEffect(() => {
        if (!userInfo || !requestToJoinCommunity) {
            resetZoom(width, false);
            setRequestToJoinCommunity(null);
        }
    }, [userInfo, requestToJoinCommunity]);

    // ✅ Early return if null - prevents rendering with null values
    if (!requestToJoinCommunity || !userInfo) {
        return null;
    }

    // ✅ Now we can safely create the request object
    const request: IRequest = {
        _id: '',
        requesterID: userInfo._id,
        requestFor: {
            type: requestToJoinCommunity.type,
            id: requestToJoinCommunity.community._id
        },
        message: '',
        status: 'pending',
        createdAt: '',
        updatedAt: '',
    };

    return (
        <Modal
            opened={true} // ✅ Always true here since we early return if null
            onClose={handleCancel}
            title={requestToJoinCommunity.type === 'passwordProtected' ? "Enter Password to Join" : "Send Community a Request to Join"}
            centered
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
                className: 'drop-shadow-xl'
            }}
            removeScrollProps={{ allowPinchZoom: true }}
            lockScroll={false}
            size={'80%'}
            closeOnEscape={true}
            closeOnClickOutside={true}
        >
            <LoadingOverlayComponent visible={loading} />
            {requestToJoinCommunity.type === 'passwordProtected' ? (
                <EnterPasswordRequest
                    handleLoading={handleLoading}
                    handleCancel={handleCancel}
                    request={request}
                    community={requestToJoinCommunity.community}
                />
            ) : (
                <RequestForm
                    handleCreateRequest={handleCreate}
                    handleCancel={handleCancel}
                    request={request}
                    community={requestToJoinCommunity.community}
                />
            )}
        </Modal>
    )
}