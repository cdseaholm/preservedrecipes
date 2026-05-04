'use client'

import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import { IFamilyMember } from "@/models/types/family/familyMember"
import { useFamilyStore } from "@/context/familyStore"
import { modals } from "@mantine/modals"
import { useUserStore } from "@/context/userStore"
import { CheckFunction } from "@/app/(content)/u/functions/functions"
import { useRouter } from "next/navigation"
import { RemoveFamilyMembers } from "@/utils/server-actions/family/members"

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

    const handleDelete = () => {
        let adminToDelete = false;
        let memsToDelete = [] as IFamilyMember[];

        famChecked.forEach((check, index) => {
            if (check === true) {
                const newMems = [...memsToDelete, familyMembers[index]];
                memsToDelete = newMems;
            }
        });

        if (memsToDelete.length === 0) {
            toast.info('Select at least one family member first');
            return;
        }

        const admins = familyMembers.filter((mem) => mem.permissionStatus === 'Admin');
        const checkedAdmins = memsToDelete.filter(member => member.permissionStatus === 'Admin');

        const proceedDeletion = async () => {
            if (!userInfo) {
                toast.info('You need to signed in to make this change');
            } else if (!admins.some((admin) => admin.familyMemberID === userInfo._id || admin.familyMemberEmail === userInfo.email)) {
                toast.info('You are not authorized to make that decision!')
                return;
            }
            const attemptDelete = await RemoveFamilyMembers(
                family._id,
                memsToDelete.map(member => member.familyMemberID),
                `/family/${family._id}/members`,
            );
            if (attemptDelete.success === false) {
                toast.info(`Failed to delete members ${attemptDelete.message}`)
            } else {
                setFamily({ ...family, familyMembers: attemptDelete.members });
                if (adminToDelete && userInfo) {
                    setUserInfo({ ...userInfo, userFamilyID: '' });
                    router.push('/');
                }
                toast.info(`Members removed`);
                handleEdit();
            }
        }

        if (admins.length === 1) {
            if (checkedAdmins.length > 0) {
                toast.error('Admins cannot delete themselves without another having admin status.');
                return;
            }
        } else if (checkedAdmins.length > 0) {
            modals.openConfirmModal({
                title: `Caution! You have selected yourself to be removed from the family, are you sure you want to proceed${memsToDelete.length > 1 ? ` removing yourself and ${memsToDelete.length - 1} ${(memsToDelete.length - 1) > 1 ? 'others?' : 'other?'}` : '?'}`,
                labels: { confirm: 'Continue', cancel: 'Cancel' },
                onConfirm: () => {
                    adminToDelete = true;
                    proceedDeletion();
                },
            });
            return;
        }

        modals.openConfirmModal({
            title: `Are you sure you want to proceed removing ${memsToDelete.length} ${memsToDelete.length > 1 ? ` members?` : `member?`}`,
            labels: { confirm: 'Continue', cancel: 'Cancel' },
            onConfirm: () => {
                proceedDeletion();
            },
        });
    };

    return { allCheck, edit, familySearch, famChecked, memberNames, handleFamilyMemberSearch, handleCheckedFam, handleCheckAllFam, handleEdit, handleDelete };
}
