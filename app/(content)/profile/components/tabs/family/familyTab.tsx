'use client'

import { IRecipe } from "@/models/types/recipe"
import { IUser } from "@/models/types/user"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import FamilySettings from "./familySettings"
import { IFamilyMember } from "@/models/types/familyMember"
import { useFamilyStore } from "@/context/familyStore"
import FamilyMembers from "./members/familyMembers"
import FamilyRecipes from "./familyRecipes"
import { CheckFunction } from "../../../functions/functions"
import { modals } from "@mantine/modals"
import AttemptDeleteFamilyMember from "@/utils/apihelpers/delete/deleteFamilyMember"

export default function FamilyTab({ userInfo, type, additionString, searchString, promoString, userAdminPrivs, indexToRender }: { userInfo: IUser, type: string, additionString: string[], searchString: string[], promoString: string[], userAdminPrivs: boolean, indexToRender: number }) {

    const [edit, setEdit] = useState(false);
    const [famCheckedAmt, setFamCheckedAmt] = useState(0);
    const [recCheckedAmt, setRecCheckedAmt] = useState(0);
    const [allCheck, setAllCheck] = useState(false);
    const [familySearch, setFamilySearch] = useState('');
    const [familyRecipeSearch, setFamilyRecipeSearch] = useState('');
    const family = useFamilyStore(s => s.family);
    const familyRecipes = family ? family.recipes as IRecipe[] : [] as IRecipe[];
    const familyMembers = family ? family.familyMembers as IFamilyMember[] : [] as IFamilyMember[];
    const memberNames = familyMembers ? familyMembers.map((mem) => { return { name: mem.familyMemberName, email: mem.familyMemberEmail, role: mem.permissionStatus } }) as { name: string, email: string, role: string }[] : [] as { name: string, email: string, role: string }[];
    const famRecipeTitles = familyRecipes ? familyRecipes.map((rec) => rec.name) as string[] : [] as string[];
    const [famChecked, setFamChecked] = useState<boolean[]>(new Array(memberNames.length).fill(false));
    const [recChecked, setRecChecked] = useState<boolean[]>(new Array(famRecipeTitles.length).fill(false));

    const handleFamilyRecipeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setFamilyRecipeSearch(e.currentTarget.value)
    }

    const handleFamilyMemberSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setFamilySearch(e.currentTarget.value)
    }

    const handleCreate = (_which: string, _open: boolean) => {
        return null;
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

    const handleCheckedRec = (index: number) => {
        const checks = CheckFunction({ checked: recChecked, checkedAmt: recCheckedAmt, index: index }) as { newChecked: boolean[], newCheckedAmt: number }
        if (!checks) {
            toast.info('Error checking recipes')
            return;
        }
        setRecChecked(checks.newChecked);
        setRecCheckedAmt(checks.newCheckedAmt);
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

    const handleEditClick = () => {
        toast.info('Currently no reason to use en masse editing')
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

    return (
        indexToRender === 0 ? (
            <FamilyRecipes userInfo={userInfo} type={type} additionString={additionString} searchString={searchString} promoString={promoString} handleDelete={handleDelete} handleOptions={handleEditClick} handleEdit={handleEdit} handleCheckedRec={handleCheckedRec} handleCreate={handleCreate} handleFamilyRecipeSearch={handleFamilyRecipeSearch} familyRecipeSearch={familyRecipeSearch} edit={edit} recChecked={recChecked} famRecipeTitles={famRecipeTitles} />
        ) : indexToRender === 1 ? (
            <FamilyMembers userInfo={userInfo} type={type} additionString={additionString} searchString={searchString} promoString={promoString} handleDelete={handleDelete} handleOptions={handleEditClick} handleEdit={handleEdit} handleCheckedFam={handleCheckedFam} handleFamilyMemberSearch={handleFamilyMemberSearch} familySearch={familySearch} edit={edit} famChecked={famChecked} memberNames={memberNames} handleCheckAllFam={handleCheckAllFam} allCheck={allCheck} familyMembers={familyMembers} />
        ) : (
            <FamilySettings userFamAdminPrivs={userAdminPrivs} family={family} />
        )
    )
}