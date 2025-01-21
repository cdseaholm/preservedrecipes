'use client'

import { Modal, useModalsStack } from "@mantine/core";
import { toast } from "sonner";
import { useForm } from '@mantine/form';
import { Session } from "next-auth";
import { useStateStore } from "@/context/stateStore";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingModal from "../templates/loadingModal";
import DefaultFamilyModal from "./defaultFamilyModal";
import { FamilyCreation } from "@/models/types/inAppCreations/familyCreation";
import { errorType } from "@/models/types/error";
import { HeritageType } from "@/models/types/inAppCreations/heritage";
import { AttemptCreateFamily } from "@/utils/apihelpers/create/createFamily";
import { IFamily } from "@/models/types/family";

export default function ParentFamilyModal({ session, handleUpdate, open, handleCloseCreateFamily }: { session: Session | null, handleUpdate: () => Promise<void>, open: boolean, handleCloseCreateFamily: () => void }) {

    const width = useStateStore(state => state.widthQuery);
    const [loading, setLoading] = useState<boolean>(false);
    const [childErrors, _setChildErrors] = useState<errorType[]>([] as errorType[]);
    const stack = useModalsStack(['default', 'members']);
    const hasOpenedMain = useRef(false);

    const familyForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            heritage: [] as HeritageType[],
        },
        validate: {
            name: (value) => (
                value ? (value.length > 100 ? 'Invalid name too long' : null) : 'Name cannot be empty'
            ),
            heritage: (_value) => null,
        }
    });


    const handleOpenDefault = useCallback(() => {
        if (!hasOpenedMain.current) {
            stack.open('default');
            hasOpenedMain.current = true;
        }
    }, [stack]);

    const resetZoom = useStateStore(state => state.handleZoomReset);

    const handleCreateFamily = async (initialValues: FamilyCreation) => {
        setLoading(true);

        try {

            if (!session) {
                toast.warning("You need to be signed in to make a family!");
                setLoading(false);
                return;
            }

            if (!initialValues) {
                toast.error("Something is wrong with your Family information, please try again");
                setLoading(false);
                return;
            }

            const validate = familyForm.validate();

            if (validate.hasErrors) {
                console.log(validate.errors);
                console.log(validate);
                return;
            }

            let creationAttempt = await AttemptCreateFamily({ familyToAdd: initialValues }) as { status: boolean, message: string, newFamily: IFamily };

            let attemptStatus = creationAttempt ? creationAttempt.status : false;

            if (attemptStatus === false) {
                toast.error('Error creating family');
                console.log(creationAttempt ? creationAttempt.message : 'Error with message');
                setLoading(false);
                return;
            }

            toast.success('Successfully created family!');
            await handleUpdate();
            resetZoom(width, false);
            handleCloseCreateFamily();
            hasOpenedMain.current = false;
            setLoading(false);
            stack.closeAll();
            familyForm.reset();
            familyForm.clearErrors();

        } catch (error) {

            console.error('Error creating family:', error);
            setLoading(false);
            return;

        }
    }

    const handleCancel = () => {

        familyForm.reset();
        familyForm.clearErrors();
        resetZoom(width, false);
        handleCloseCreateFamily();
        hasOpenedMain.current = false;
        stack.closeAll();
        toast.info("Cancelled Creating Family");

    }

    useEffect(() => {
        if (open) {
            handleOpenDefault();
        }
    }, [open, handleOpenDefault]);

    return (

        <Modal.Stack>
            {!loading ? (
                <Modal {...stack.register('default')} onClose={handleCancel} title="Create a Family Tree" centered overlayProps={{
                    backgroundOpacity: 0.55, blur: 3, className: 'drop-shadow-xl'
                }} removeScrollProps={{ allowPinchZoom: true }} lockScroll={false} size={'100%'} transitionProps={{ transition: hasOpenedMain ? `slide-up` : `pop` }}>
                    <DefaultFamilyModal handleCancel={handleCancel} familyForm={familyForm} errors={childErrors} handleCreateFamily={handleCreateFamily} />
                </Modal>
            ) : (
                <LoadingModal open={loading} />
            )}
        </Modal.Stack>
    )
}