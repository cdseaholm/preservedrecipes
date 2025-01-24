'use client'

import { IRecipe } from "@/models/types/recipe"
import { IUser } from "@/models/types/user"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import { CheckFunction } from "../functions"
import FamilySettings from "./familySettings"
import { IFamilyMember } from "@/models/types/familyMember"
import { useFamilyStore } from "@/context/familyStore"
import FamilyMembers from "./familyMembers"
import FamilyRecipes from "./familyRecipes"

export default function FamilyTab({ userInfo, type, additionString, searchString, promoString, numAdmins, userAdminPrivs, subTab }: { userInfo: IUser, type: string, additionString: string[], searchString: string[], promoString: string[], numAdmins: number, userAdminPrivs: boolean, subTab: string }) {

    const [edit, setEdit] = useState(false);
    const [famCheckedAmt, setFamCheckedAmt] = useState(0);
    const [recCheckedAmt, setRecCheckedAmt] = useState(0);
    const [familySearch, setFamilySearch] = useState('');
    const [familyRecipeSearch, setFamilyRecipeSearch] = useState('');
    const [settings, setSettings] = useState<boolean>(false);
    const family = useFamilyStore(s => s.family);
    const familyRecipes = family ? family.recipes as IRecipe[] : [] as IRecipe[];
    const familyMembers = family ? family.familyMembers as IFamilyMember[] : [] as IFamilyMember[];
    const memberNames = familyMembers ? familyMembers.map((mem) => mem.familyMemberName) as string[] : [] as string[];
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
        const checks = CheckFunction({ checked: famChecked, checkedAmt: famCheckedAmt, index: index }) as { newChecked: boolean[], newCheckedAmt: number }
        if (!checks) {
            toast.info('Error checking recipes')
            return;
        }
        setFamChecked(checks.newChecked);
        setFamCheckedAmt(checks.newCheckedAmt);
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

    const handleEdit = () => {
        setEdit(!edit)
    }

    const handleOptions = () => {
        toast.info('Options')
    }

    const handleDelete = () => {
        toast.info('Delete')
    }

    const handleSettings = () => {
        setSettings(!settings);
    }

    return (
        settings ? (
            <FamilySettings userFamAdminPrivs={userAdminPrivs} familySettings={['Edit Family Members', 'Edit Family Recipes', 'Delete Family']} handleSettings={handleSettings} family={family} numAdmins={numAdmins}/>
        ) : (
            subTab === 'recipes' ? (
                <FamilyRecipes userInfo={userInfo} type={type} additionString={additionString} searchString={searchString} promoString={promoString} userFamAdminPrivs={userAdminPrivs} handleSettings={handleSettings} handleDelete={handleDelete} handleOptions={handleOptions} handleEdit={handleEdit} handleCheckedRec={handleCheckedRec} handleCreate={handleCreate} handleFamilyRecipeSearch={handleFamilyRecipeSearch} familyRecipeSearch={familyRecipeSearch} edit={edit} recChecked={recChecked} famRecipeTitles={famRecipeTitles} />
            ) : (
                <FamilyMembers userInfo={userInfo} type={type} additionString={additionString} searchString={searchString} promoString={promoString} userFamAdminPrivs={userAdminPrivs} handleSettings={handleSettings} handleDelete={handleDelete} handleOptions={handleOptions} handleEdit={handleEdit} handleCheckedFam={handleCheckedFam} handleCreate={handleCreate} handleFamilyMemberSearch={handleFamilyMemberSearch} familySearch={familySearch} edit={edit} famChecked={famChecked} memberNames={memberNames} />
            )
        )
    )
}