'use client'

import { useAlertStore } from "@/context/alertStore";
import { IFamilyMember, MemberStatusEditType } from "@/models/types/family/familyMember";
import { IUser } from "@/models/types/personal/user";
import { useForm } from "@mantine/form";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ChangeNameFormType, ChangeNameType } from "@/models/types/personal/change-name-form-type";
import { IFamily } from "@/models/types/family/family";
import { ChangeFamilyMemberStatusFormType } from "@/models/types/family/change-fam-types";
import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { UpdateFamilyMemberStatuses, UpdateFamilyName } from "@/utils/server-actions/family/update";
import { DeleteFamily } from "@/utils/server-actions/family/delete";


export default function FamilySettingsHooks() {

    const { data: session, update } = useSession();
    const setFamily = useFamilyStore(state => state.setFamily);
    const userInfo = useUserStore(state => state.userInfo);
    const setUserInfo = useUserStore(state => state.setUserInfo);

    const changeFamNameForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            currName: '',
            name: '',
            namePassword: '',
        } as ChangeNameType,
        validate: {
            currName: (value) => (
                !value ? 'Name is required' : null
            ),
            name: (value, values) => (
                !value ? 'Name is required' :
                    value === values.currName ? 'New name must be different than current name' :
                        null
            ),
            namePassword: (value) => (
                !value ? 'Password is required'
                    : value.length < 5 ? 'Password length must be greater than 5 characters' : null
            )
        }
    }) as ChangeNameFormType;

    const editFamMemStatusForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            membersToEdit: [{
                memberFormIndex: -1,
                familyMemberID: '',
                familyMemberName: '',
                familyMemberEmail: '',
                permissionStatus: 'Guest',
                memberConnected: false,
                selectedByBoxNum: -1
            }] as MemberStatusEditType[],
            currAdminPassword: ''
        },
        validate: {
            membersToEdit: (_value: MemberStatusEditType[]) => null,
            currAdminPassword: (value) => (
                !value ? 'Password is required'
                    : value.length < 5 ? 'Password length must be greater than 5 characters' : null
            )
        }
    });

    const handleChangeStatuses = async ({ editFamMemStatusForm, family }: { editFamMemStatusForm: ChangeFamilyMemberStatusFormType, family: IFamily }) => {
        try {

            if (!session) {
                toast.warning("You need to be signed in to make a suggestion!");
                return;
            }

            if (!editFamMemStatusForm) {
                toast.error("Something is wrong with your Suggestion information, please try again");
                return;
            }
            const validate = editFamMemStatusForm.validate();

            if (validate.hasErrors) {
                editFamMemStatusForm.setErrors(validate.errors)
                return;
            }

            const familyIDToPass = family._id.toString() || '';
            const membersToChange = editFamMemStatusForm.getValues().membersToEdit.map((member) => ({
                familyMemberID: member.familyMemberID,
                familyMemberName: member.familyMemberName,
                familyMemberEmail: member.familyMemberEmail,
                permissionStatus: member.permissionStatus,
                memberConnected: member.memberConnected
            } as IFamilyMember
            )) as IFamilyMember[];

            const invitesSent = await UpdateFamilyMemberStatuses(
                familyIDToPass,
                membersToChange,
                editFamMemStatusForm.getValues().currAdminPassword,
                `/family/${familyIDToPass}/settings`,
            );

            const attemptStatus = invitesSent ? invitesSent.success : false;

            if (attemptStatus === false) {
                toast.error(invitesSent?.message || 'Error updating members');
                return;
            }

            setFamily({ ...family, familyMembers: invitesSent.members });
            toast.success('Member statuses updated');
            await update();

        } catch (error) {

            console.error('Error Adding Members:', error);
            return;

        }
    }

    const submitChange = async ({ changeFamNameForm, userFamAdminPrivs, family }: { changeFamNameForm: ChangeNameFormType, userFamAdminPrivs: boolean, family: IFamily }) => {

        if (!session) {
            toast.warning('You must be signed in to make this change');
            return;
        }
        const user = session.user as IUser
        if (!user) {
            toast.warning('You do not have permission to edit this')
        }
        if (!userFamAdminPrivs) {
            toast.error('You do not have family permissions to edit this');
            return;
        }

        const formVals = changeFamNameForm.getValues();
        if (!formVals) {
            return;
        }

        const changed = await UpdateFamilyName(
            family._id,
            formVals.name,
            formVals.namePassword,
            `/family/${family._id}/settings`,
        );
        if (!changed.success) {
            toast.error(changed.message || 'Issue with changing family name');
            return;
        }
        setFamily({ ...family, name: formVals.name });
        toast.info('Family Name changed');
        return;

    }

    const handleConfirmFam = async (userFamAdminPrivs: boolean, family: IFamily) => {

        if (!session || !userFamAdminPrivs) {
            toast.error('You are not authorized to make this change');
            return;
        }

        const confirm = window.confirm('Are you sure you want to delete your family account? This will remove everything created by your family including recipes, and the family from the family members');
        if (!confirm) {
            return;
        }

        const attemptDelete = await DeleteFamily(family._id, '/');

        if (!attemptDelete || attemptDelete.success === false) {
            toast.error(attemptDelete?.message || 'Error deleting family')
            return;
        }

        setFamily({} as IFamily);
        if (userInfo) {
            setUserInfo({ ...userInfo, userFamilyID: '' });
        }
        await update();
        useAlertStore.getState().setGlobalToast('Family deleted successfully');

    }

    return { changeFamNameForm, submitChange, handleConfirmFam, editFamMemStatusForm, handleChangeStatuses };
}
