'use client'

import { FamMemStatusFormType } from "@/models/types/family/change-fam-types";
import { MemberStatusEditType } from "@/models/types/family/familyMember";
import { Combobox, InputBase, Input, Select, useCombobox, CheckIcon, Group } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

const RemovalButton = ({ click, index }: { click: (index: number) => void, index: number }) => {

    return (
        <button type="button" className="cursor-pointer w-content h-content pr-1" onClick={() => click(index)}>
            <p className="text-blue-400 hover:text-blue-200 hover:underline text-xs md:text-sm lg:text-base">Remove</p>
        </button>
    )
}

export default function FamMemberComboBox({ editFamMemStatus, boxIndex, clickRemove, onOptionsSelect, thisMember, shellsLength }: { editFamMemStatus: UseFormReturnType<FamMemStatusFormType, (values: FamMemStatusFormType) => FamMemStatusFormType>, boxIndex: number, clickRemove: (boxIndex: number) => void, onOptionsSelect: (val: string, boxIndex: number) => void, thisMember: MemberStatusEditType | undefined, shellsLength: number }) {

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption()
    });

    const options = editFamMemStatus.getValues().membersToEdit.map((mem, _index) => {
        const isNotChosen = mem.selectedByBoxNum === -1;
        const isChosenByThisBox = mem.selectedByBoxNum === boxIndex;
        return (
            <Combobox.Option value={mem.familyMemberID} key={mem.familyMemberID} disabled={!isNotChosen && !isChosenByThisBox}>
                <Group gap="xs" className={`${!isNotChosen && !isChosenByThisBox ? 'text-gray-400' : ''}`}>
                    {!isNotChosen && <CheckIcon size={12} />}
                    <span>{mem.familyMemberName}</span>
                </Group>
            </Combobox.Option>
        );
    });

    return (
        <>
            {shellsLength > 1 && (
                <div className="flex flex-row justify-end items-center w-full h-content">
                    <RemovalButton click={clickRemove} index={boxIndex} />
                </div>
            )}
            <Combobox
                store={combobox}
                withinPortal={false}
                onOptionSubmit={(val) => {
                    onOptionsSelect(val, boxIndex);
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target>
                    <InputBase
                        label={'Member'}
                        component="button"
                        type="button"
                        pointer
                        rightSection={<Combobox.Chevron />}
                        onClick={() => combobox.toggleDropdown()}
                        rightSectionPointerEvents="none"
                        className="w-full px-2"
                    >
                        {thisMember !== undefined ? thisMember.familyMemberName : <Input.Placeholder>Pick value</Input.Placeholder>}
                    </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
            <Select

                id={`memberStatus${boxIndex}`}
                name={`memberStatus${boxIndex}`}
                label="Member Status"
                className={`w-full text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis p-2`}
                placeholder="Guest"
                disabled={thisMember === undefined}
                value={thisMember ? thisMember.permissionStatus : "Guest"} // Dynamically set the value
                onChange={(value) => {
                    if (thisMember) {
                        const memToAdd = {
                            ...thisMember,
                            permissionStatus: value
                        } as MemberStatusEditType
                        editFamMemStatus.replaceListItem(`membersToEdit`, thisMember.memberFormIndex, memToAdd);
                    }
                }}
                data={['Admin', 'Member', 'Guest']}

            />
        </>
    )
}