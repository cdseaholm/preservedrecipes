'use client'

import { useModalStore } from "@/context/modalStore";
import { Modal } from "@mantine/core";
import { signOut } from 'next-auth/react';
import { toast } from "sonner";
import ModalTemplate from "./templates/modalTemplate";
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";

export default function SignOutModal({session, handleUpdate}: {session: Session | null, handleUpdate: () => Promise<void>}) {

    const openSignOutModal = useModalStore(state => state.openSignOutModal);
    const setOpenSignOutModal = useModalStore(state => state.setOpenSignOutModal);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);

    const handleSignOut = async () => {
        if (!session) {
            toast.error('You are already signed out')
            return;
        }
        
        try {
            await signOut();
            await handleUpdate();
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            resetZoom(width, false);
            setOpenSignOutModal(false);
        }
    }

    const handleCancel = () => {
        resetZoom(width, false);
        setOpenSignOutModal(false);
        toast.info("Cancelled Signing out");
    }

    return (
        <Modal opened={openSignOutModal} onClose={() => {
            resetZoom(width, false);
            setOpenSignOutModal(false);
        }} title="Sign Out" centered overlayProps={{
            backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
        }} removeScrollProps={{allowPinchZoom: true}} lockScroll={false}>
            <ModalTemplate subtitle={`Are you sure you want to sign out?`} minHeight="15vh" minWidth="15vw">
                <section className="flex flex-row w-full justify-evenly items-center">
                    <button onClick={() => handleCancel()} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2">
                        Cancel
                    </button>
                    <button onClick={() => handleSignOut()} className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2">
                        Continue Sign Out
                    </button>
                </section>
            </ModalTemplate>
        </Modal>
    )
}