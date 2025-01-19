'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd"
import InfoPopover from "@/components/popovers/infoPopover"
import { useModalStore } from "@/context/modalStore"
import { FamilyMember } from "@/models/types/familyMemberRelation"
import { IRecipe } from "@/models/types/recipe"
import { IUser } from "@/models/types/user"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import { CheckFunction } from "./functions"

export default function FamilyTab({ userInfo, familyMembers, familyRecipes, type, additionString, searchString, promoString }: { userInfo: IUser, familyMembers: FamilyMember[], familyRecipes: IRecipe[], type: string, additionString: string[], searchString: string[], promoString: string[] }) {

    const [edit, setEdit] = useState(false);
    const [famCheckedAmt, setFamCheckedAmt] = useState(0);
    const [recCheckedAmt, setRecCheckedAmt] = useState(0);
    const [familySearch, setFamilySearch] = useState('');
    const [familyRecipeSearch, setFamilyRecipeSearch] = useState('');

    const memberNames = familyMembers ? familyMembers.map((mem) => mem.familyMemberName) : [] as string[];
    const famRecipeTitles = familyRecipes ? familyRecipes.map((rec) => rec.name) : [] as string[];

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

    return (
        userInfo.userFamily.familyID !== '' ? (
            <div className="flex flex-col justify-evenly items-center w-full h-content divide-y divide-gray-400 space-y-2">
                <SearchAndAdd handleSearch={handleFamilyRecipeSearch} handleCreate={handleCreate} type={type} additionString={additionString[0]} searchString={searchString[0]} index={0} handleEdit={handleEdit} edit={edit} totalSelected={recChecked.filter((check) => check !== false).length} clickOptions={handleOptions} clickDelete={handleDelete} optionsLength={familyRecipes.length}>
                    {famRecipeTitles.length > 0 ? (
                        famRecipeTitles.filter((item) => item.toLowerCase().includes(familyRecipeSearch.toLowerCase().trim())).map((item, index) => (
                            <InSearchItemButton key={index} item={item} index={index} handleChecked={handleCheckedRec} edit={edit} checked={recChecked[index]}>
                                <ul className="space-x-2">{index + 1}. {item}</ul>
                            </InSearchItemButton>
                        ))
                    ) : (
                        <ul className="p-2 text-start pl-7">{`Add a ${promoString} to see it here`}</ul>
                    )}
                </SearchAndAdd>
                <SearchAndAdd handleSearch={handleFamilyMemberSearch} handleCreate={handleCreate} type={type} additionString={additionString[1]} searchString={searchString[1]} index={1} handleEdit={handleEdit} clickOptions={handleOptions} clickDelete={handleDelete} edit={false} totalSelected={famChecked.filter((check) => check !== false).length} optionsLength={familyMembers.length}>
                    {memberNames.length > 0 ? (
                        memberNames.filter((item) => item.toLowerCase().includes(familySearch.toLowerCase().trim())).map((item, index) => (
                            <InSearchItemButton key={index} item={item} index={index} handleChecked={handleCheckedFam} edit={edit} checked={famChecked[index]}>
                                <ul className="space-x-2">{index + 1}. {item}</ul>
                            </InSearchItemButton>
                        ))) : (
                        <ul className="p-2 text-start pl-7">{`Add a ${promoString} to see it here`}</ul>
                    )}
                </SearchAndAdd>
            </div>
        ) : (
            <div className="flex flex-col justify-evenly items-center w-full h-[300px] space-y-3">
                <button onClick={() => useModalStore.getState().setOpenCreateFamilyModal(true)}>
                    {`Create a family tree`}
                </button>
                <p>
                    {userInfo.userFamily.familyID}
                </p>
                <InfoPopover title="Looking to join an existing family tree?" infoOne="Have the admin or creator of your family send you an invite either through this site or to your email." infoTwo="From there you just need to accept!" />
            </div>
        )
    )
}