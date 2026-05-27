'use client'

import React, { ChangeEvent, useState } from "react"
import { PasswordInput } from "@mantine/core"
import { toast } from "sonner"
import { IFamilyMember } from "@/models/types/family/familyMember"
import { useFamilyStore } from "@/context/familyStore"
import { modals } from "@mantine/modals"
import { useUserStore } from "@/context/userStore"
import { CheckFunction } from "@/app/(content)/u/functions/functions"
import { useRouter } from "next/navigation"
import { RemoveFamilyMembers } from "@/utils/server-actions/family/members"
import { UpdateFamilyMemberStatuses } from "@/utils/server-actions/family/update"

export default function FamilyMemberHooks() {

    const [edit, setEdit] = useState(false);
    const [famCheckedAmt, setFamCheckedAmt] = useState(0);
    const [allCheck, setAllCheck] = useState(false);
    const [familySearch, setFamilySearch] = useState('');
    const userInfo = useUserStore(s => s.userInfo);
    const setUserInfo = useUserStore(s => s.setUserInfo);
    const family = useFamilyStore(s => s.family);
    const setFamily = useFamilyStore(s => s.setFamily);
    const router = useRouter();
    const familyMembers = family ? family.familyMembers as IFamilyMember[] : [] as IFamilyMember[];
    const memberNames = familyMembers ? familyMembers.map((mem) => { return { name: mem.familyMemberName, email: mem.familyMemberEmail, role: mem.permissionStatus } }) as { name: string, email: string, role: string }[] : [] as { name: string, email: string, role: string }[];
    const [famChecked, setFamChecked] = useState<boolean[]>(new Array(memberNames.length).fill(false));

    const openAdminPasswordConfirm = ({
        title,
        confirmLabel,
        onConfirm,
    }: {
        title: string;
        confirmLabel: string;
        onConfirm: (adminPassword: string) => Promise<void>;
    }) => {
        let adminPassword = "";

        modals.openConfirmModal({
            title,
            labels: { confirm: confirmLabel, cancel: "Cancel" },
            children: React.createElement(PasswordInput, {
                label: "Admin password",
                placeholder: "Enter your password",
                autoFocus: true,
                onChange: (event: ChangeEvent<HTMLInputElement>) => {
                    adminPassword = event.currentTarget.value;
                },
            }),
            onConfirm: () => {
                if (!adminPassword) {
                    toast.error("Password is required");
                    return;
                }

                void onConfirm(adminPassword);
            },
        });
    }


    const handleFamilyMemberSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setFamilySearch(e.currentTarget.value)
    }

    const handleCheckedFam = (index: number) => {

        if (famCheckedAmt === memberNames.length) {
            setAllCheck(false);
        }

        const checks = CheckFunction({ checked: famChecked, checkedAmt: famCheckedAmt, index: index }) as { newChecked: boolean[], newCheckedAmt: number }
        
        if (!checks) {
            toast.info('Error checking recipes')
            return;
        }

        setFamChecked(checks.newChecked);
        setFamCheckedAmt(checks.newCheckedAmt);

        if (checks.newCheckedAmt === memberNames.length) {
            setAllCheck(true);
        }

    }

    const handleCheckAllFam = () => {
        if (famCheckedAmt === memberNames.length) {
            const resetFam = new Array(memberNames.length).fill(false);
            setFamChecked(resetFam);
            setFamCheckedAmt(0);
            setAllCheck(false);
        } else {
            const allTrueFam = new Array(memberNames.length).fill(true);
            setFamChecked(allTrueFam);
            setFamCheckedAmt(memberNames.length);
            setAllCheck(true);
        }
    }

    const handleEdit = () => {
        if (edit === true) {
            setAllCheck(false);
            setFamChecked(new Array(memberNames.length).fill(false));
            setFamCheckedAmt(0);
        }
        setEdit(!edit);
    }

    const handleUpdateMemberStatuses = (membersToChange: IFamilyMember[], onSuccess?: () => void) => {
        if (!family) {
            toast.info("Family information is still loading");
            return;
        }

        if (membersToChange.length === 0) {
            toast.info("Choose a different role first");
            return;
        }

        const statusById = new Map(membersToChange.map(member => [member.familyMemberID, member.permissionStatus]));
        const updatedMembers = familyMembers.map(member => ({
            ...member,
            permissionStatus: statusById.get(member.familyMemberID) ?? member.permissionStatus,
        }));

        if (!updatedMembers.some(member => member.permissionStatus === "Admin")) {
            toast.error("At least one family admin is required");
            return;
        }

        openAdminPasswordConfirm({
            title: `Update ${membersToChange.length} ${membersToChange.length > 1 ? "family roles" : "family role"}?`,
            confirmLabel: "Update",
            onConfirm: async (adminPassword) => {
                const result = await UpdateFamilyMemberStatuses(
                    family._id,
                    membersToChange,
                    adminPassword,
                    `/family/${family._id}/members`,
                );

                if (!result.success) {
                    toast.error(result.message || "Failed to update member status");
                    return;
                }

                setFamily({ ...family, familyMembers: result.members });
                router.refresh();
                toast.success("Member statuses updated");
                onSuccess?.();
            },
        });
    }

    const handleDelete = (membersToRemove?: IFamilyMember[]) => {
        let memsToDelete = membersToRemove ? [...membersToRemove] : [] as IFamilyMember[];

        if (!membersToRemove) {
            famChecked.forEach((check, index) => {
                if (check === true) {
                    const newMems = [...memsToDelete, familyMembers[index]];
                    memsToDelete = newMems;
                }
            });
        }

        if (memsToDelete.length === 0) {
            toast.info('Select at least one family member first');
            return;
        }

        const admins = familyMembers.filter((mem) => mem.permissionStatus === 'Admin');
        const checkedAdmins = memsToDelete.filter(member => member.permissionStatus === 'Admin');
        const remainingAdmins = admins.filter(admin => !memsToDelete.some(member => member.familyMemberID === admin.familyMemberID));
        const removingSelf = Boolean(userInfo && memsToDelete.some(member => member.familyMemberID === userInfo._id || member.familyMemberEmail === userInfo.email));

        if (remainingAdmins.length === 0) {
            toast.error('At least one family admin is required.');
            return;
        }

        const proceedDeletion = async (adminPassword: string) => {
            if (!family) {
                toast.info('Family information is still loading');
                return;
            }

            if (!userInfo) {
                toast.info('You need to signed in to make this change');
            } else if (!admins.some((admin) => admin.familyMemberID === userInfo._id || admin.familyMemberEmail === userInfo.email)) {
                toast.info('You are not authorized to make that decision!')
                return;
            }
            const attemptDelete = await RemoveFamilyMembers(
                family._id,
                memsToDelete.map(member => member.familyMemberID),
                adminPassword,
                `/family/${family._id}/members`,
            );
            if (attemptDelete.success === false) {
                toast.info(`Failed to delete members ${attemptDelete.message}`)
            } else {
                setFamily({ ...family, familyMembers: attemptDelete.members });
                if (removingSelf && userInfo) {
                    setUserInfo({ ...userInfo, userFamilyID: '' });
                    router.push('/');
                    return;
                }
                toast.info(`Members removed`);
                if (!membersToRemove) handleEdit();
                router.refresh();
            }
        }

        if (checkedAdmins.length > 0 || removingSelf) {
            openAdminPasswordConfirm({
                title: removingSelf
                    ? `Remove yourself from this family${memsToDelete.length > 1 ? ` and ${memsToDelete.length - 1} other ${memsToDelete.length - 1 > 1 ? 'members' : 'member'}` : ''}?`
                    : `Remove ${memsToDelete.length} ${memsToDelete.length > 1 ? 'members' : 'member'} from this family?`,
                confirmLabel: 'Remove',
                onConfirm: proceedDeletion,
            });
            return;
        }

        openAdminPasswordConfirm({
            title: `Are you sure you want to proceed removing ${memsToDelete.length} ${memsToDelete.length > 1 ? ` members?` : `member?`}`,
            confirmLabel: 'Remove',
            onConfirm: proceedDeletion,
        });
    };

    return { allCheck, edit, familySearch, famChecked, memberNames, handleFamilyMemberSearch, handleCheckedFam, handleCheckAllFam, handleEdit, handleDelete, handleUpdateMemberStatuses };
}
