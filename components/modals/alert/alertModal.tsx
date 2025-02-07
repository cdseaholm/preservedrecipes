'use client'

import { Modal } from "@mantine/core"
import { toast } from "sonner";
import { useStateStore } from "@/context/stateStore";
import ModalTemplate from "../templates/modalTemplate";
import { useAlertStore } from "@/context/alertStore";
import CancelButton from "@/components/buttons/cancelButton";
import ActionButton from "@/components/buttons/basicActionButton";

export default function AlertModal() {

    const alertModalOpen = useAlertStore(state => state.alertModalOpen);
    const setAlertModalOpen = useAlertStore(state => state.setAlertModalOpen);
    const resetZoom = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);
    const message = useAlertStore(state => state.alertMessage);
    const setConfirmation = useAlertStore(state => state.setAlertConfirm);

    const handleCancel = () => {
        resetZoom(width, false);
        setAlertModalOpen(false);
        toast.info("Cancelled");
    }

    const handleConfirm = () => {
        resetZoom(width, false);
        setConfirmation(true);
        setAlertModalOpen(false);
        toast.info('Deleted');
    }

    return (
        <Modal.Stack>
            <Modal opened={alertModalOpen} onClose={handleCancel} title="Register" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false}>
                <ModalTemplate subtitle={null} minHeight="15vh" minWidth="15vw">
                    <section>
                        {message}
                    </section>
                    <section className="flex flex-row w-full justify-evenly items-center pt-5">
                        <CancelButton handleCancel={handleCancel} />
                        <ActionButton buttonTitle="Confirm" action={handleConfirm} />
                    </section>
                </ModalTemplate>
            </Modal>
        </Modal.Stack>
    )
}