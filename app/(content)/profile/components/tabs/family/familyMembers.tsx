'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd"
import InfoPopover from "@/components/popovers/infoPopover"
import { useModalStore } from "@/context/modalStore"
import { IFamilyMember } from "@/models/types/familyMember"
import { IUser } from "@/models/types/user"
import { ChangeEvent, useState } from "react"
import { toast } from "sonner"
import ViewSpecificItem from "../../profileHelpers/viewSpecificItem"
import { Checkbox } from "@mantine/core"
import { BiChevronRight } from "react-icons/bi"

export default function FamilyMembers({ userInfo, type, additionString, searchString, promoString, handleDelete, handleOptions, handleEdit, handleCheckedFam, handleFamilyMemberSearch, familySearch, edit, famChecked, memberNames, handleCheckAllFam, allCheck }: { userInfo: IUser, type: string, additionString: string[], searchString: string[], promoString: string[], handleDelete: () => void, handleOptions: () => void, handleEdit: () => void, handleCheckedFam: (index: number) => void, handleFamilyMemberSearch: (e: ChangeEvent<HTMLInputElement>) => void, familySearch: string, edit: boolean, famChecked: boolean[], memberNames: { name: string, email: string, role: string }[], handleCheckAllFam: () => void, allCheck: boolean }) {

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
            //setItemToView(suggestions[index])
            toast.info(index)
        }
    }

    return (
        familyID !== '' ? (
            itemToView ? (

                <ViewSpecificItem item={itemToView} handleSeeItem={handleSeeItem} parent={'suggestions'} />

            ) : (
                <div className="flex flex-col justify-evenly items-center w-full h-content divide-y divide-gray-400 space-y-2">
                    <SearchAndAdd handleSearch={handleFamilyMemberSearch} handleCreate={handleCreatePass} type={type} additionString={additionString[1]} searchString={searchString[1]} index={1} handleEdit={handleEdit} clickOptions={handleOptions} clickDelete={handleDelete} edit={edit} totalSelected={famChecked.filter((check) => check !== false).length} optionsLength={memberNameLength}>

                        <div className={`flex flex-row w-[100%] items-center justify-start space-x-2 ${edit ? 'pl-3' : 'px-4'} text-sm lg:text-md p-2 text-start border border-accent/30 rounded-md m-1`}>
                            {edit ? (<Checkbox checked={allCheck} onChange={handleCheckAllFam} style={{ cursor: 'pointer' }} className={`cursor-pointer w-content`} aria-label="Edit checkbox" />) : (null)}
                            <p className={`w-2/5`}>Name:</p>
                            <p className={`w-2/5`}>Email:</p>
                            <p className={`w-1/5`}>Role:</p>
                            {edit ? null : <BiChevronRight height={'auto'} width={'auto'} className="h-fit w-fit text-transparent" size={16} />}
                        </div>


                        {
                            memberNameLength > 0 ? (
                                memberNames.filter((item) => item.name === '' ? item.email : item.name.toLowerCase().includes(familySearch.toLowerCase().trim())).map((item, index) => (
                                    <InSearchItemButton key={index} item={item.email} index={index} handleChecked={handleCheckedFam} edit={edit} checked={famChecked[index]} handleSeeItem={handleSeeItem}>
                                        <ul className={`w-2/5`}>{edit ? null : `${index + 1}. ` }{item.name === '' ? 'No name' : item.name}</ul>
                                        <ul className={`w-2/5`}>{item.email === '' ? 'No email' : item.email}</ul>
                                        <ul className={`w-1/5`}>{item.role === '' ? 'Guest' : item.role}</ul>
                                    </InSearchItemButton>
                                ))) : (
                                <ul className="p-2 text-start pl-7">{`Add a ${promoString[1]} to see it here`}</ul>
                            )
                        }

                    </SearchAndAdd>
                </div>
            )
        ) : (
            <div className="flex flex-col justify-evenly items-center w-full h-[300px] space-y-3">
                <button onClick={() => useModalStore.getState().setOpenCreateFamilyModal(true)} aria-label="Create Family Tree">
                    {`Create a family tree`}
                </button>
                <p>
                    {userInfo.userFamilyID}
                </p>
                <InfoPopover title="Looking to join an existing family tree?" infoOne="Have the admin or creator of your family send you an invite either through this site or to your email." infoTwo="From there you just need to accept!" />
            </div>
        )
    )
}