'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd"
import InfoPopover from "@/components/popovers/infoPopover"
import { useModalStore } from "@/context/modalStore"
import { IUser } from "@/models/types/user"
import { ChangeEvent } from "react"

export default function FamilyMembers({ userInfo, type, additionString, searchString, promoString, userFamAdminPrivs, handleSettings, handleDelete, handleOptions, handleEdit, handleCheckedFam, handleFamilyMemberSearch, familySearch, edit, famChecked, memberNames }: { userInfo: IUser, type: string, additionString: string[], searchString: string[], promoString: string[], userFamAdminPrivs: boolean, handleSettings: () => void, handleDelete: () => void, handleOptions: () => void, handleEdit: () => void, handleCheckedFam: (index: number) => void, handleFamilyMemberSearch: (e: ChangeEvent<HTMLInputElement>) => void, familySearch: string, edit: boolean, famChecked: boolean[], memberNames: { name: string, email: string }[] }) {

    const memberNameLength = memberNames ? memberNames.length : 0;
    const familyID = userInfo ? userInfo.userFamilyID : '';
    const setOpenAddFamMemsModal = useModalStore(state => state.setOpenAddFamMemsModal)

    const handleCreatePass = (which: string, open: boolean) => {
        console.log(which, open);
        setOpenAddFamMemsModal(true)
    }

    return (
        familyID !== '' ? (
            <div className="flex flex-col justify-evenly items-center w-full h-content divide-y divide-gray-400 space-y-2">
                <div className="flex flex-row justify-between items-center w-full h-content px-4">
                    {userFamAdminPrivs &&
                        <div className="flex flex-row w-full justify-end sm:justify-start items-center p-1">
                            <button type="button" className="text-blue-700 hover:text-blue-300 hover:underline" onClick={handleSettings}>
                                Family Settings
                            </button>
                        </div>
                    }
                </div>
                <SearchAndAdd handleSearch={handleFamilyMemberSearch} handleCreate={handleCreatePass} type={type} additionString={additionString[1]} searchString={searchString[1]} index={1} handleEdit={handleEdit} clickOptions={handleOptions} clickDelete={handleDelete} edit={false} totalSelected={famChecked.filter((check) => check !== false).length} optionsLength={memberNameLength}>
                    {memberNameLength > 0 ? (
                        memberNames.filter((item) => item.name === '' ? item.email : item.name.toLowerCase().includes(familySearch.toLowerCase().trim())).map((item, index) => (
                            <InSearchItemButton key={index} item={item.email} index={index} handleChecked={handleCheckedFam} edit={edit} checked={famChecked[index]}>
                                <ul className="space-x-2">{index + 1}. {item.name === '' ? 'No name' : item.name}</ul>
                                <ul className="space-x-2">{item.email === '' ? 'No email' : item.email}</ul>
                            </InSearchItemButton>
                        ))) : (
                        <ul className="p-2 text-start pl-7">{`Add a ${promoString[1]} to see it here`}</ul>
                    )}
                </SearchAndAdd>
            </div>
        ) : (
            <div className="flex flex-col justify-evenly items-center w-full h-[300px] space-y-3">
                <button onClick={() => useModalStore.getState().setOpenCreateFamilyModal(true)}>
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