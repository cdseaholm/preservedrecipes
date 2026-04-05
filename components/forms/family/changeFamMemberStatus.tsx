'use client'

import { Fieldset } from "@mantine/core"
import { useCallback, useEffect, useRef, useState } from "react";
import FamMemberComboBox from "../../misc/combobox/famMemberComboBox";
import { MemberStatusEditType } from "@/models/types/family/familyMember";
import { ChangeFamilyMemberStatusFormType } from "@/models/types/family/change-fam-types";

export default function ChangeFamMemberStatus({ editFamMemStatus }: { editFamMemStatus: ChangeFamilyMemberStatusFormType }) {

    const [memShells, setMemShells] = useState(0);
    const [membersChosen, setMembersChosen] = useState<MemberStatusEditType[]>([] as MemberStatusEditType[]);
    const modalInitiated = useRef(false);

    const totalMembers = editFamMemStatus.getValues().membersToEdit.length;

    const updateMembersChosen = (member: MemberStatusEditType, boxIndexPassed: number) => {

        const updatedMember = {
            ...member,
            selectedByBoxNum: boxIndexPassed,
        } as MemberStatusEditType;

        editFamMemStatus.replaceListItem('membersToEdit', member.memberFormIndex, updatedMember);

        let newMembers = [] as MemberStatusEditType[];

        if (boxIndexPassed !== -1) {
            newMembers = [...membersChosen, updatedMember];
        } else {
            newMembers = membersChosen.filter((m) => m.familyMemberID !== member.familyMemberID);
        }

        setMembersChosen(newMembers);

    };

    const onOptionsSelect = (val: string, boxIndex: number) => {

        console.log('OptionSelect: ', val, boxIndex);
        const memberWithinBox = membersChosen[boxIndex];
        let alreadyChosen = false;

        if (memberWithinBox) {
            if (membersChosen[boxIndex].familyMemberID === val) {
                alreadyChosen = true;
            }
        }

        const member = editFamMemStatus.getValues().membersToEdit.find((m) => m.familyMemberID === val);

        if (!member) {
            console.log('Error choosing this member');
            return;
        }

        if (!alreadyChosen) {
            updateMembersChosen(member, boxIndex);
        } else {
            updateMembersChosen(member, -1);
        }

    };

    const clickRemove = (boxIndex: number) => {

        const updatedMembers = membersChosen.map((member) => {
            if (member.selectedByBoxNum === boxIndex) {
                return {
                    ...member,
                    selectedByBoxNum: -1
                } as MemberStatusEditType
            } else if (member.selectedByBoxNum > boxIndex) {
                return {
                    ...member,
                    selectedByBoxNum: member.selectedByBoxNum - 1,
                } as MemberStatusEditType;
            } else {
                return member;
            }
        });

        updatedMembers.forEach((member) => {
            editFamMemStatus.replaceListItem('membersToEdit', member.memberFormIndex, member);
        });

        setMembersChosen(updatedMembers);
        setMemShells(memShells - 1);

    };

    const increaseShells = useCallback(() => {
        setMemShells(memShells + 1);
    }, [memShells]);

    const resetForm = () => {
        editFamMemStatus.clearErrors();
        editFamMemStatus.resetTouched();
    }

    useEffect(() => {
        if (modalInitiated.current === false) {
            increaseShells();
            modalInitiated.current = true;
        }
    }, [increaseShells]);

    console.log('MembersChosen: ', membersChosen);
    console.log('Members: ', editFamMemStatus.getValues().membersToEdit)

    return (
        <form id={'changeMemberStatusForm'} className="flex flex-col justify-evenly items-center w-full h-content space-y-2" onAbort={resetForm}>
            <Fieldset legend={`Change Family Member Status`} className="w-full space-y-2">
                {Array.from({ length: memShells }).map((_, boxIndex) => {
                    const thisMember = membersChosen.find((mem) => mem.selectedByBoxNum === boxIndex);
                    return (
                        <div key={boxIndex} className="flex flex-col w-full justify-start h-content items-center bg-gray-100 rounded-md p-1">
                            <FamMemberComboBox editFamMemStatus={editFamMemStatus} boxIndex={boxIndex} clickRemove={clickRemove} onOptionsSelect={onOptionsSelect} thisMember={thisMember} shellsLength={memShells} />
                        </div>
                    );
                })}
                <button
                    type="button"
                    className={`flex flex-row w-full h-content justify-center items-center rounded-md ${memShells >= totalMembers ? 'bg-gray-200 text-gray-400' : 'bg-blue-200 hover:bg-blue-400 hover:underline cursor-pointer text-black'}`}
                    onClick={increaseShells}
                    disabled={memShells >= totalMembers ? true : false}
                >
                    Add another member to change
                </button>
            </Fieldset>
        </form>
    );
}