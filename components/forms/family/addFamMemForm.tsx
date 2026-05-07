'use client'

import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/family/familyMember";
import { ScrollArea, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { FormEvent } from "react";
import { useState } from "react";
import { BiTrashAlt } from "react-icons/bi";
import CancelButton from "../../buttons/cancelButton";
import SubmitButton from "../../buttons/submitButton";
import { NewFamMemFormType, NewMembers } from "@/models/types/family/new-fam";

export default function AddFamMemberForm({ handleAddFamMem, handleCancel }: { handleAddFamMem: ({ emails }: { emails: NewFamMemFormType }) => void, handleCancel: () => void }) {

    const addFamMemsForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            newMembers: [] as NewMembers[],
        },
        validate: {
            newMembers: (value) => value.length <= 0 ? 'Must add at least one member' : null
        }
    });

    const [newValError, setNewValError] = useState('');
    const [newVal, setNewVal] = useState<string>('');
    const family = useFamilyStore(state => state.family);
    const familyMembers = family ? family.familyMembers as IFamilyMember[] : [] as IFamilyMember[];
    const normalizeEmail = (email: string) => email.trim().toLowerCase();

    const options = addFamMemsForm.getValues().newMembers.map((item: NewMembers, index: number) => (
        <li key={item.email} className="flex flex-row justify-between items-center w-full h-content p-2 hover:text-gray-400 cursor-pointer">
            {item.email}
            <button onClick={() => {
                addFamMemsForm.removeListItem('newMembers', index);
            }} aria-label="Remove Family Member">
                <BiTrashAlt />
            </button>
        </li>
    ));

    function checkedEmail(email: string) {
        const normalizedEmail = normalizeEmail(email);
        const tested = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

        if (normalizedEmail === '') {
            return 'Email is required'
        } else if (normalizedEmail.length < 5) {
            return 'Email needs to be longer'
        } else if (tested) {
            return 'Invalid email'
        } else {
            return null
        }
    }

    function CheckPrevMems(email: string, queuedMembers = addFamMemsForm.getValues().newMembers) {
        const normalizedEmail = normalizeEmail(email);
        const prevFound = familyMembers.filter((member) => normalizeEmail(member.familyMemberEmail) === normalizedEmail);
        if (prevFound.length > 0) {
            return 'Previous Member with this email exists';
        }
        const inFormMems = queuedMembers.filter((mem) => normalizeEmail(mem.email) === normalizedEmail);
        if (inFormMems.length > 0) {
            return 'Email already in queue to be sent invite';
        }
        return null;
    }

    const validateNewMember = (email: string, queuedMembers = addFamMemsForm.getValues().newMembers) => {
        addFamMemsForm.clearErrors();
        setNewValError('');
        const check = checkedEmail(email);
        if (check !== null) {
            setNewValError(check)
            return null;
        }

        const checkedPrevMems = CheckPrevMems(email, queuedMembers);
        if (checkedPrevMems !== null) {
            setNewValError(checkedPrevMems)
            return null;
        }

        return {
            email: normalizeEmail(email),
            permissions: 'Member'
        } as NewMembers;
    }

    const handleMem = () => {
        const newMember = validateNewMember(newVal);

        if (!newMember) {
            return;
        }

        addFamMemsForm.insertListItem('newMembers', newMember);
        setNewVal('');
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const queuedMembers = addFamMemsForm.getValues().newMembers;
        let membersToInvite = queuedMembers;

        if (newVal.trim() !== '') {
            const newMember = validateNewMember(newVal, queuedMembers);

            if (!newMember) {
                return;
            }

            membersToInvite = [...queuedMembers, newMember];
        }

        if (membersToInvite.length <= 0) {
            addFamMemsForm.setFieldError('newMembers', 'Must add at least one member');
            return;
        }

        handleAddFamMem({ emails: { newMembers: membersToInvite } });
    }

    return (
        <form id="modalAddFamForm" className="w-full h-full" onSubmit={handleSubmit}>

            <div className="flex flex-row justify-between items-center w-full h-content">
                <TextInput
                    id="modalNewMemName"
                    name="modalNewMemName"
                    label="Add the email of a family members you'd like to add"
                    placeholder="example@exampleEmailProvider.com"
                    mt={'md'}
                    withAsterisk
                    value={newVal}
                    onChange={(e) => {
                        setNewValError('')
                        setNewVal(e.currentTarget.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleMem();
                        }
                    }}
                    error={newValError === '' ? null : newValError}
                    className="w-full h-content"
                    rightSection={
                        <button type='button' className="w-content mr-4 p-2 rounded-md h-content hover:underline text-blue-700 hover:text-blue-400" onClick={() => handleMem()
                        } aria-label="Add family member">
                            Add
                        </button>
                    }
                />
            </div>


            <div className="border border-accent/30 rounded-md min-h-[200px] p-2">
                <ScrollArea.Autosize mah={200} type="scroll">
                    {options.length === 0 ? <p className="text-center">Queue a family member to be added</p> : <ul>{options}</ul>}
                </ScrollArea.Autosize>
                {addFamMemsForm.errors.newMembers && <p className="pt-2 text-sm text-red-600">{addFamMemsForm.errors.newMembers}</p>}
            </div>


            <section className="flex flex-row w-full justify-evenly items-center pt-12 pb-8">
                <CancelButton handleCancel={() => { addFamMemsForm.reset(); addFamMemsForm.clearErrors(); handleCancel(); }} />
                <SubmitButton buttonTitle="Create"/>
            </section>
        </form>
    )
}
