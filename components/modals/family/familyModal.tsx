'use client'

import { Modal } from "@mantine/core";
import { toast } from "sonner";
import { UseFormReturnType } from '@mantine/form';
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";
import { useState } from "react";
import FamilyForm, { FamilyFormType } from "@/components/forms/family/familyForm";
import { useModalStore } from "@/context/modalStore";
import { IFamily } from "@/models/types/family/family";
import { errorType } from "@/models/types/misc/error";
import { AttemptCreateFamily } from "@/utils/apihelpers/create/createFamily";
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import { useWindowSizes } from "@/context/width-height-store";

export default function ParentFamilyModal({ session, handleUpdate, handleCloseCreateFamily }: { session: Session | null, handleUpdate: () => Promise<void>, handleCloseCreateFamily: () => void }) {

    const openCreateFamilyModal = useModalStore(state => state.openCreateFamilyModal);
    const { width } = useWindowSizes();
    const [loading, setLoading] = useState<boolean>(false);
    const [childErrors, _setChildErrors] = useState<errorType[]>([] as errorType[]);

    const resetZoom = useStateStore(state => state.handleZoomReset);

    const handleCreateFamily = async ({ familyForm }: { familyForm: UseFormReturnType<FamilyFormType, (values: FamilyFormType) => FamilyFormType> }) => {
        setLoading(true);

        try {

            if (!session) {
                toast.warning("You need to be signed in to make a family!");
                setLoading(false);
                return;
            }

            if (!familyForm) {
                toast.error("Something is wrong with your Family information, please try again");
                setLoading(false);
                return;
            }

            const validate = familyForm.validate();

            if (validate.hasErrors) {
                familyForm.setErrors(validate.errors)
                return;
            }

            const familyToPass = {
                name: familyForm.getValues().name,
                heritage: familyForm.getValues().heritage
            } as FamilyFormType

            let creationAttempt = await AttemptCreateFamily({ familyToAdd: familyToPass }) as { status: boolean, message: string, newFamily: IFamily };

            let attemptStatus = creationAttempt ? creationAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error creating family');
                setLoading(false);
                return;
            }

            toast.success('Successfully created family!');
            await handleUpdate();
            resetZoom(width, false);
            handleCloseCreateFamily();
            setLoading(false);

        } catch (error) {

            console.error('Error creating family:', error);
            setLoading(false);
            return;

        }
    }

    const handleCancel = () => {

        resetZoom(width, false);
        handleCloseCreateFamily();
        toast.info("Cancelled Creating Family");

    }

    return (
            <Modal opened={openCreateFamilyModal} onClose={handleCancel} title="Create a Family Tree" centered overlayProps={{
                backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
            }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} closeOnClickOutside={true} closeOnEscape={true}>
                <LoadingOverlayComponent visible={loading} />
                <FamilyForm handleCancel={handleCancel} handleCreateFamily={handleCreateFamily} errors={childErrors} />
            </Modal>
    )
}