'use client'

import FamilyMemberHooks from "@/components/hooks/family/family-member-hooks"
import { useModalStore } from "@/context/modalStore"
import { IFamily } from "@/models/types/family/family"
import { IFamilyMember } from "@/models/types/family/familyMember"
import { IUser } from "@/models/types/personal/user"
import NoFamTab from "@/app/(content)/family/[famid]/components/members/noFamTab"
import CreateButton from "@/components/buttons/create-button"
import DeleteButton from "@/components/buttons/deleteButton"
import EditButton from "@/components/buttons/edit-button"
import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box"
import SearchBar from "@/components/misc/searchBox/searchBar"
import { Checkbox } from "@mantine/core"
import Link from "next/link"
import { BiCheck, BiPencil, BiPlus, BiChevronRight } from "react-icons/bi"
import { FaRegTrashAlt } from "react-icons/fa"
import ListWrapper from "@/components/wrappers/list-wrapper"

export default function FamilyMembers({ userInfo, family }: { userInfo: IUser, family: IFamily }) {

    const { allCheck, edit, familySearch, famChecked, memberNames, handleFamilyMemberSearch, handleCheckedFam, handleCheckAllFam, handleEdit, handleDelete } = FamilyMemberHooks();

    // Turn off loading once this component is mounted with data

    const members = family ? family.familyMembers : [] as IFamilyMember[];
    const memberNameLength = memberNames ? memberNames.length : 0;
    const familyID = userInfo ? userInfo.userFamilyID : '';
    const setOpenAddFamMemsModal = useModalStore(state => state.setOpenAddFamMemsModal);
    const adminPermission = userInfo && family ? family.familyMembers.find((mem) => mem.familyMemberEmail === userInfo.email)?.permissionStatus === 'Admin' : false;

    const handleCreatePass = () => {
        setOpenAddFamMemsModal(true)
    };

    const renderItem = familyID !== '' ? (
        <>
            <PageSpecButtonBox
                leftHandButtons={
                    <>
                        {edit && <DeleteButton icon={<FaRegTrashAlt />} label={`Delete ${famChecked.filter((check) => check !== false).length}`} onClick={handleDelete} />}
                    </>

                }
                rightHandButtons={
                    <>
                        {adminPermission && <EditButton onClick={handleEdit} icon={edit ? <BiCheck /> : <BiPencil />} label={edit ? 'Done' : 'Edit'} optionsLength={memberNameLength} />}
                        {adminPermission && <CreateButton onClick={handleCreatePass} icon={<BiPlus />} additionString={`Add Family Member`} />}
                    </>
                }
                leftLabel="Selected Family Members"
                rightLabel="Family Member Actions"
            />

            <ListWrapper searchBar={<SearchBar handleSearch={handleFamilyMemberSearch} searchString={familySearch === '' ? 'Search your Family Members' : familySearch} index={1} leftSection={null} />}
                currentPage={1} isPending={false} numberOfPages={1} editButtons={undefined}            >
                <div className={`flex flex-row w-[100%] items-center justify-start space-x-2 ${edit ? 'pl-3' : 'px-4'} text-sm lg:text-md p-2 text-start border-b border-accent/30`}>
                    {edit ? (<Checkbox checked={allCheck} onChange={handleCheckAllFam} style={{ cursor: 'pointer' }} className={`cursor-pointer w-content`} aria-label="Edit checkbox" />) : (null)}
                    <p className={`w-2/5 font-semibold text-base`}>Name:</p>
                    <p className={`w-2/5 font-semibold text-base`}>Email:</p>
                    <p className={`w-1/5 font-semibold text-base`}>Role:</p>
                    {edit ? null : <BiChevronRight height={'auto'} width={'auto'} className="h-fit w-fit text-transparent" size={16} />}
                </div>
                {
                    members.length > 0 ? (
                        members.filter((member) => member.familyMemberName === '' ? member.familyMemberEmail : member.familyMemberName.toLowerCase().includes(familySearch.toLowerCase().trim())).map((item, index) => (
                            <div key={index} className={`flex flex-row w-[100%] items-center justify-start ${edit ? 'pl-3' : 'px-4'} text-sm lg:text-base hover:bg-gray-200 hover:text-highlight p-2 text-start border border-accent/30 rounded-md mt-1 cursor-pointer`}>
                                {edit ? (
                                    <div className={`flex flex-row w-full h-content text-ellipsis text-start justify-start space-x-2 cursor-pointer`}>
                                        <Checkbox checked={famChecked[index]} className="cursor-pointer w-content" aria-label="Edit checkbox" onClick={() => handleCheckedFam(index)} />
                                        <ul className={`w-2/5`}>{edit ? null : `${index + 1}. `}{item.familyMemberName === '' ? 'No name' : item.familyMemberName}</ul>
                                        <ul className={`w-2/5`}>{item.familyMemberEmail === '' ? 'No email' : item.familyMemberEmail}</ul>
                                        <ul className={`w-1/5`}>{item.permissionStatus ? item.permissionStatus : 'Guest'}</ul>
                                    </div>
                                ) : (
                                    <Link href={`/family/${familyID}/members/${item.familyMemberID}`} className={`flex flex-row w-full h-content text-ellipsis text-start items-center cursor-pointer justify-between`} aria-label="Specific item button">
                                        <ul className={`w-2/5`}>{edit ? null : `${index + 1}. `}{item.familyMemberName === '' ? 'No name' : item.familyMemberName}</ul>
                                        <ul className={`w-2/5`}>{item.familyMemberEmail === '' ? 'No email' : item.familyMemberEmail}</ul>
                                        <ul className={`w-1/5`}>{item.permissionStatus ? item.permissionStatus : 'Guest'}</ul>
                                        <BiChevronRight height={'auto'} width={'auto'} className="h-fit w-fit cursor-pointer" size={16} />
                                    </Link>
                                )}
                            </div>
                        ))) : (
                        <ul className="p-2 text-start pl-7">{`Add a Family Member to see them here`}</ul>
                    )
                }
            </ListWrapper>
        </>


    ) : (
        <NoFamTab userInfo={userInfo} />
    )

    return (
            renderItem
    )
}