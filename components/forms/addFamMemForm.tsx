'use client'

import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/familyMember";
import { ScrollArea, TextInput } from "@mantine/core"
import { useForm, UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import { BiTrashAlt } from "react-icons/bi";

export type NewMembers = {
    email: string;
    permissions: string;
}

export type NewFamMemFormType = {
    newMembers: NewMembers[];
}

export default function AddFamMemberForm({ handleAddFamMem, handleCancel }: { handleAddFamMem: ({ addFamMemsForm }: { addFamMemsForm: UseFormReturnType<NewFamMemFormType, (values: NewFamMemFormType) => NewFamMemFormType> }) => void, handleCancel: () => void }) {

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

    const options = addFamMemsForm.getValues().newMembers.map((item: NewMembers, index: number) => (
        <li key={item.email} className="flex flex-row justify-between items-center w-full h-content p-2 hover:text-gray-400 cursor-pointer">
            {item.email}
            <button onClick={() => {
                addFamMemsForm.removeListItem('newMembers', index);
            }}>
                <BiTrashAlt />
            </button>
        </li>
    ));

    async function checkedEmail() {
        const tested = !/^\S+@\S+$/.test(newVal);

        if (newVal === '') {
            return 'Email is required'
        } else if (newVal.length < 5) {
            return 'Email needs to be longer'
        } else if (tested) {
            return 'Invalid email'
        } else {
            return null
        }
    }

    async function CheckPrevMems() {
        const prevFound = familyMembers.filter((member) => member.familyMemberEmail === newVal);
        if (prevFound.length > 0) {
            return 'Previous Member with this email exists';
        }
        const inFormMems = addFamMemsForm.getValues().newMembers.filter((mem) => mem.email === newVal);
        if (inFormMems.length > 0) {
            return 'Email already in queue to be sent invite';
        }
        return null;
    }

    const handleMem = async () => {
        addFamMemsForm.clearErrors();
        setNewValError('');
        const check = await checkedEmail();
        if (check !== null) {
            setNewValError(check)
            return;
        }

        const checkedPrevMems = await CheckPrevMems();
        if (checkedPrevMems !== null) {
            setNewValError(checkedPrevMems)
            return;
        }

        const newMember = {
            email: newVal,
            permissions: 'Member'
        } as NewMembers;
        addFamMemsForm.insertListItem('newMembers', newMember);
        setNewVal('');
    }

    return (
        <form id="modalAddFamForm" className="w-full h-full" onSubmit={(e) => {
            e.preventDefault();
            handleAddFamMem({ addFamMemsForm });
        }}>

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
                    error={newValError === '' ? null : newValError}
                    className="w-full h-content"
                    rightSection={
                        <button type='button' className="w-content mr-4 p-2 rounded-md h-content hover:underline text-blue-700 hover:text-blue-400" onClick={() => handleMem()
                        }>
                            Add
                        </button>
                    }
                />
            </div>


            <div className="border border-accent/30 rounded-md min-h-[200px] p-2">
                <ScrollArea.Autosize mah={200} type="scroll">
                    {options.length === 0 ? <p className="text-center">Queue a family member to be added</p> : options}
                </ScrollArea.Autosize>
            </div>


            <section className="flex flex-row w-full justify-evenly items-center pt-12 pb-8">
                <button type="button" onClick={() => { addFamMemsForm.reset(); addFamMemsForm.clearErrors(); handleCancel(); }} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5 text-xs sm:text-sm">
                    Cancel
                </button>
                <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5 text-xs sm:text-sm">
                    Create
                </button>
            </section>
        </form>
    )
}