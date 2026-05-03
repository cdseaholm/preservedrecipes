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
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import { useWindowSizes } from "@/context/width-height-store";
import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { CreateFamily } from "@/utils/server-actions/family/create";

export default function ParentFamilyModal({ session, handleUpdate, handleCloseCreateFamily }: { session: Session | null, handleUpdate: () => Promise<void>, handleCloseCreateFamily: () => void }) {

    const openCreateFamilyModal = useModalStore(state => state.openCreateFamilyModal);
    const { width } = useWindowSizes();
    const [loading, setLoading] = useState<boolean>(false);
    const [childErrors, _setChildErrors] = useState<errorType[]>([] as errorType[]);

    const resetZoom = useStateStore(state => state.handleZoomReset);
    const setFamily = useFamilyStore(state => state.setFamily);
    const userInfo = useUserStore(state => state.userInfo);
    const setUserInfo = useUserStore(state => state.setUserInfo);

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

            const creationAttempt = await CreateFamily(familyToPass, '/u/profile');

            const attemptStatus = creationAttempt ? creationAttempt.success : false;

            if (attemptStatus === false) {
                toast.error(creationAttempt?.message || 'Error creating family');
                setLoading(false);
                return;
            }

            if (creationAttempt.family) {
                setFamily(creationAttempt.family as IFamily);
                if (userInfo) {
                    setUserInfo({ ...userInfo, userFamilyID: creationAttempt.family._id });
                }
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
