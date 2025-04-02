'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd"
import { Checkbox } from "@mantine/core"
import { ChangeEvent } from "react"
import { BiChevronRight } from "react-icons/bi"

export default function FamilyMemberMainTab({ handleFamilyMemberSearch, handleCreatePass, type, additionString, searchString, handleEdit, handleOptions, handleDelete, edit, famChecked, memberNameLength, allCheck, handleCheckAllFam, memberNames, familySearch, handleCheckedFam, handleSeeItem, promoString }: { type: string, additionString: string[], searchString: string[], promoString: string[], handleDelete: () => void, handleOptions: () => void, handleEdit: () => void, handleCheckedFam: (index: number) => void, handleFamilyMemberSearch: (e: ChangeEvent<HTMLInputElement>) => void, familySearch: string, edit: boolean, famChecked: boolean[], memberNames: { name: string, email: string, role: string }[], handleCheckAllFam: () => void, allCheck: boolean, handleSeeItem: (index: number) => void, handleCreatePass: (which: string, open: boolean) => void, memberNameLength: number }) {
    return (
        <div className="flex flex-col justify-evenly items-center w-full h-content divide-y divide-gray-400 space-y-2">
            <SearchAndAdd handleSearch={handleFamilyMemberSearch} handleCreate={handleCreatePass} type={type} additionString={additionString[1]} searchString={searchString[1]} index={1} handleEdit={handleEdit} clickOptions={handleOptions} clickDelete={handleDelete} edit={edit} totalSelected={famChecked.filter((check) => check !== false).length} optionsLength={memberNameLength}>

                <div className={`flex flex-row w-[100%] items-center justify-start space-x-2 ${edit ? 'pl-3' : 'px-4'} text-sm lg:text-md p-2 text-start border-b border-accent/30 m-1`}>
                    {edit ? (<Checkbox checked={allCheck} onChange={handleCheckAllFam} style={{ cursor: 'pointer' }} className={`cursor-pointer w-content`} aria-label="Edit checkbox" />) : (null)}
                    <p className={`w-2/5 font-semibold text-base`}>Name:</p>
                    <p className={`w-2/5 font-semibold text-base`}>Email:</p>
                    <p className={`w-1/5 font-semibold text-base`}>Role:</p>
                    {edit ? null : <BiChevronRight height={'auto'} width={'auto'} className="h-fit w-fit text-transparent" size={16} />}
                </div>


                {
                    memberNameLength > 0 ? (
                        memberNames.filter((item) => item.name === '' ? item.email : item.name.toLowerCase().includes(familySearch.toLowerCase().trim())).map((item, index) => (
                            <InSearchItemButton key={index} item={item.email} index={index} handleChecked={handleCheckedFam} edit={edit} checked={famChecked[index]} handleSeeItem={handleSeeItem}>
                                <ul className={`w-2/5`}>{edit ? null : `${index + 1}. `}{item.name === '' ? 'No name' : item.name}</ul>
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
}