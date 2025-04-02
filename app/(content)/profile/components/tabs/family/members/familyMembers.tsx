'use client'

import { useModalStore } from "@/context/modalStore"
import { IFamilyMember } from "@/models/types/familyMember"
import { IUser } from "@/models/types/user"
import { ChangeEvent, useState } from "react"
import NoFamTab from "./familyTabSubCategories/noFamTab"
import FamilyMemberMainTab from "./familyTabSubCategories/familyTabMain"
import SpecificMemberView from "./familyTabSubCategories/specificMember"

export default function FamilyMembers({ userInfo, type, additionString, searchString, promoString, handleDelete, handleOptions, handleEdit, handleCheckedFam, handleFamilyMemberSearch, familySearch, edit, famChecked, memberNames, handleCheckAllFam, allCheck, familyMembers }: { userInfo: IUser, type: string, additionString: string[], searchString: string[], promoString: string[], handleDelete: () => void, handleOptions: () => void, handleEdit: () => void, handleCheckedFam: (index: number) => void, handleFamilyMemberSearch: (e: ChangeEvent<HTMLInputElement>) => void, familySearch: string, edit: boolean, famChecked: boolean[], memberNames: { name: string, email: string, role: string }[], handleCheckAllFam: () => void, allCheck: boolean, familyMembers: IFamilyMember[] }) {

    const memberNameLength = memberNames ? memberNames.length : 0;
    const familyID = userInfo ? userInfo.userFamilyID : '';
    const setOpenAddFamMemsModal = useModalStore(state => state.setOpenAddFamMemsModal);
    const [itemToView, setItemToView] = useState<IFamilyMember | null>(null)

    const handleCreatePass = (which: string, open: boolean) => {
        console.log(which, open);
        setOpenAddFamMemsModal(true)
    };

    const handleSeeItem = (index: number) => {
        if (index === -1) {
            setItemToView(null)
        } else {
            setItemToView(familyMembers[index])
        }
    }

    return (
        familyID !== '' ? (
            itemToView ? (

                <SpecificMemberView memberToView={itemToView} handleSeeItem={handleSeeItem} />

            ) : (
                <FamilyMemberMainTab
                    type={type}
                    additionString={additionString}
                    searchString={searchString}
                    promoString={promoString}
                    handleDelete={handleDelete}
                    handleOptions={handleOptions}
                    handleEdit={handleEdit}
                    handleCheckedFam={handleCheckedFam}
                    handleFamilyMemberSearch={handleFamilyMemberSearch}
                    familySearch={familySearch}
                    edit={edit}
                    famChecked={famChecked}
                    memberNames={memberNames}
                    handleCheckAllFam={handleCheckAllFam}
                    allCheck={allCheck}
                    memberNameLength={memberNameLength}
                    handleCreatePass={handleCreatePass}
                    handleSeeItem={handleSeeItem}
                />
            )
        ) : (
            <NoFamTab userInfo={userInfo} />
        )
    )
}