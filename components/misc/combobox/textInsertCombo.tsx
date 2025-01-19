'use client'

import { FamilyMember } from '@/models/types/familyMemberRelation';
import { FamilyCreation } from '@/models/types/inAppCreations/familyCreation';
import { InputBase, Combobox, useCombobox } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';

export default function TextInsertComboBox({ form, handleOpenMembers, which }: { form: UseFormReturnType<FamilyCreation, (members: FamilyCreation) => FamilyCreation>, handleOpenMembers: (index: number | null) => void, which: string }) {

    const combobox = useCombobox({});
    const members = [{} as FamilyMember]
    console.log('Was doing members from form: ', form)
    const [search, setSearch] = useState('');

    const shouldFilterOptions = members.every((item) =>
        item.familyMemberEmail !== search && item.familyMemberName !== search
    );

    const filteredOptions = shouldFilterOptions
        ? members.filter((item) =>
            item.familyMemberEmail.toLowerCase().includes(search.toLowerCase().trim()) ||
            item.familyMemberName.toLowerCase().includes(search.toLowerCase().trim())
        )
        : members;

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item.familyMemberID} key={item.familyMemberID}>
            <div className='flex flex-row justify-evenly items-center w-full h-full'>
                {item.familyMemberName}
                {item.familyMemberEmail}
                {item.status}
            </div>
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            offset={0}

        >
            <Combobox.Target>
                <InputBase
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onChange={(e) => {
                        combobox.updateSelectedOptionIndex();
                        setSearch(e.currentTarget.value);
                    }}
                    placeholder='Search members'
                    className='w-full h-full overflow-hidden whitespace-nowrap text-ellipsis'
                    label='Family Members'
                />
            </Combobox.Target>
            <div className='border-x border-b border-accent/40 rounded-b-md p-2 '>
                <Combobox.Options mah={200} style={{ overflowY: 'auto', padding: '8px' }}>
                    {options.length > 0 ? options : <Combobox.Empty>Click Manage on the right of the search box to add/edit members</Combobox.Empty>}
                </Combobox.Options>
                <div className='flex flex-row justify-center items-center w-full h-full p-1 border-t border-accent/40'>
                    <button type='button' className='hover:bg-gray-100 text-blue-700 hover:text-blue-300 hover:underline p-2 rounded-md' onClick={() => handleOpenMembers(null)}>
                        {which === 'Members' ? 'Add' : 'Manage'}
                    </button>
                </div>
            </div>
        </Combobox>
    );
}