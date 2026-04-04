'use client'

import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import { IFamilyMember } from "@/models/types/family/familyMember"
import { useFamilyStore } from "@/context/familyStore"
import { modals } from "@mantine/modals"
import AttemptDeleteFamilyMember from "@/utils/apihelpers/delete/deleteFamilyMember"
import { useUserStore } from "@/context/userStore"
import { CheckFunction } from "@/app/(content)/u/functions/functions"

export default function FamilyMemberHooks() {

    const [edit, setEdit] = useState(false);
    const [famCheckedAmt, setFamCheckedAmt] = useState(0);
    const [allCheck, setAllCheck] = useState(false);
    const [familySearch, setFamilySearch] = useState('');
    const userInfo = useUserStore(s => s.userInfo);
    const family = useFamilyStore(s => s.family);
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
        const headers = { 'Authorization': `Bearer ${userInfo}` };
        let adminToDelete = false;
        let memsToDelete = [] as IFamilyMember[];

        famChecked.forEach((check, index) => {
            if (check === true) {
                const newMems = [...memsToDelete, familyMembers[index]];
                memsToDelete = newMems;
            }
        });

        const admins = memberNames.filter((mem) => mem.role === 'Admin');
        const checkedAdmins = admins.filter((_, index) => famChecked[index]);

        const proceedDeletion = async () => {
            if (!userInfo) {
                toast.info('You need to signed in to make this change');
            } else if (admins.filter((admin) => admin.name === userInfo.name).length !== 1) {
                toast.info('You are not authorized to make that decision!')
            }
            //Next implement the route
            const attemptDelete = await AttemptDeleteFamilyMember({ toDelete: memsToDelete, adminToRemove: adminToDelete }, headers) as { status: boolean, message: string };
            if (attemptDelete.status === false) {
                toast.info(`Failed to delete members ${attemptDelete.message}`)
            } else {
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
                onCancel: () => console.log('Cancel'),
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
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                proceedDeletion();
            },
        });
    };

    return { allCheck, edit, familySearch, famChecked, memberNames, handleFamilyMemberSearch, handleCheckedFam, handleCheckAllFam, handleEdit, handleDelete };
}