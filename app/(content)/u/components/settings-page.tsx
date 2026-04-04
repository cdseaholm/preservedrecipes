'use client'

import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { useModalStore } from "@/context/modalStore";
import { useAlertStore } from "@/context/alertStore";
import AttemptDeleteUser, { HelperResponse } from "@/utils/apihelpers/delete/deleteUser";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { IUser } from "@/models/types/personal/user";
import ChangeEmailModal from "@/components/modals/user/change-email-modal";
import ChangeNameModal from "@/components/modals/user/change-name-modal";
import ChangePasswordModal from "@/components/modals/user/change-password-modal";
import ContentWrapper from "@/components/wrappers/contentWrapper";

export default function SettingsPage({ user }: { user: IUser }) {

    const family = useFamilyStore(s => s.family);
    const members = family ? family.familyMembers : [] as IFamilyMember[];
    const admins = members ? members.filter((member) => member.permissionStatus === 'Admin') : [] as IFamilyMember[];
    const numAdmins = admins ? admins.length : 0;
    const userFamInfo = members ? members.find((member) => member.familyMemberID === user._id.toString()) as IFamilyMember : {} as IFamilyMember;
    const userFamPrivs = userFamInfo ? userFamInfo.permissionStatus as string : '';
    const userAdminPrivs = userFamPrivs && userFamPrivs === 'Admin' ? true : false;
    const { data: session, update } = useSession();
    const openNameChangedModal = useModalStore((state) => state.openNameChangedModal);
    const openEmailChangedModal = useModalStore((state) => state.openEmailChangedModal);
    const openPasswordChangedModal = useModalStore((state) => state.openPasswordChangedModal);

    const setOpenNameChangedModal = useModalStore((state) => state.setOpenNameChangedModal);
    const setOpenEmailChangedModal = useModalStore((state) => state.setOpenEmailChangedModal);
    const setOpenPasswordChangedModal = useModalStore((state) => state.setOpenPasswordChangedModal);

    const attemptDelete = async () => {

        if (!session) {
            toast.error('You are not authorized to make this change');
            return;
        }

        if (userAdminPrivs && numAdmins < 2) {
            toast.info('Either give admin privileges to another family member or delete the family altogether before deleting your account.')
            return;
        }

        const headers = { 'Authorization': `Bearer ${session.user}` };
        const attemptDelete = await AttemptDeleteUser(headers) as HelperResponse;

        if (!attemptDelete || attemptDelete.status === false) {
            toast.error('Error deleting user')
            return;
        }

        await signOut();
        await update();
        useAlertStore.getState().setGlobalToast('User deleted successfully');
        redirect('/');


    }

    const handleDeleteAttempt = () => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            children: (
                <Text size="sm">
                    Are you sure you want to delete your account?
                </Text>
            ),
            confirmProps: { children: 'Confirm' },
            cancelProps: { children: 'Cancel' },
            onCancel: () => console.log('Cancel'),
            onConfirm: attemptDelete,
        });
    };

    return (
        <ContentWrapper containedChild={true} paddingNeeded={true}>
            <ChangeEmailModal user={user} />
            <ChangeNameModal user={user} />
            <ChangePasswordModal user={user} />
            <div className="w-full h-full flex flex-col justify-start items-center space-y-12 pt-12">
                <h1 className="text-xl md:text-2xl underline">Account Settings</h1>
                <button
                    type='button'
                    className={`border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/2 text-xs sm:text-sm cursor-pointer`}
                    aria-label={'Change Info'}
                    disabled={openNameChangedModal || openEmailChangedModal || openPasswordChangedModal}
                    onClick={() => {
                        setOpenNameChangedModal(true);
                    }}
                >
                    Change Name
                </button>
                <button
                    type='button'
                    className={`border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/2 text-xs sm:text-sm cursor-pointer`}
                    aria-label={'Change Info'}
                    disabled={openNameChangedModal || openEmailChangedModal || openPasswordChangedModal}
                    onClick={() => {
                        setOpenEmailChangedModal(true);
                    }}
                >
                    Change Email
                </button>
                <button
                    type='button'
                    className={`border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/2 text-xs sm:text-sm cursor-pointer`}
                    aria-label={'Change Password'}
                    disabled={openNameChangedModal || openEmailChangedModal || openPasswordChangedModal}
                    onClick={() => {
                        setOpenPasswordChangedModal(true);
                    }}
                >
                    Change Password
                </button>
                <button type="button" className={`border border-neutral-200 rounded-md hover:bg-red-200 bg-red-400 p-2 w-1/2 text-xs sm:text-sm cursor-pointer`} onClick={handleDeleteAttempt} aria-label={'Delete Account'}>
                    <p>Delete Account</p>
                </button>
            </div>
        </ContentWrapper>
    )
}