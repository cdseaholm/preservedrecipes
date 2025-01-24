'use client'

import { useState } from 'react';
import { Checkbox, Combobox, Group, Pill, PillsInput, useCombobox } from '@mantine/core';
import { countries } from '../flags/flags';
import { UseFormReturnType } from '@mantine/form';
import { HeritageType } from '@/models/types/inAppCreations/heritage';
import { FlagIcon } from '../flags/flagIcon';
import { FamilyFormType } from '@/components/forms/familyForm';

const heritages = countries as HeritageType[];

export function MultiSelectCheckbox({ form }: { form: UseFormReturnType<FamilyFormType, (values: FamilyFormType) => FamilyFormType> }) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');
    const [value, setValue] = useState<HeritageType[]>(form.getValues().heritage);

    const handleValueSelect = (val: HeritageType) => {
        setValue((current) => current.includes(val) ? current.filter((v) => v !== val) : [...current, val]);
        form.setFieldValue('heritage', value);
    }

    const handleValueRemove = (val: HeritageType) => {
        setValue((current) => current.filter((v) => v !== val));
        form.setFieldValue('heritage', value);
    };

    const FlagGroup = ({ flag }: { flag: HeritageType }) => {
        return (
            <Group>
                <FlagIcon countryCode={flag.flagCode} />
                <span>{flag.name}</span>
            </Group>
        )
    }

    const values = value.map((item) => (
        <Pill key={item.flagCode} withRemoveButton onRemove={() => handleValueRemove(item)}>
            <div className='flex flex-row items-center justify-center h-[22px] w-[18px]'>
                <FlagIcon countryCode={item.flagCode} />
            </div>
        </Pill>
    ));

    const options = heritages
        .filter((item) => item.name.toLowerCase().includes(search.toLowerCase().trim()))
        .map((item) => (
            <Combobox.Option value={item.flagCode} key={item.flagCode} active={value.includes(item)} onClick={() => handleValueSelect(item)}>
                <Group gap="sm">
                    <Checkbox
                        checked={value.includes(item)}
                        onChange={() => { }}
                        aria-hidden
                        tabIndex={-1}
                        style={{ pointerEvents: 'none' }}
                    />
                    <FlagGroup flag={item} />
                </Group>
            </Combobox.Option>
        ));

    return (
        <Combobox store={combobox} withinPortal={false} offset={0} onOptionSubmit={() => setSearch('')}>
            <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()} label={'Family Heritage'} className='py-5'>
                    <Pill.Group>
                        {values}
                        <Combobox.EventsTarget>
                            <PillsInput.Field
                                onBlur={() => combobox.closeDropdown()}
                                onFocus={() => combobox.openDropdown()}
                                placeholder='Search and choose heritages'
                                onChange={(e) => {
                                    combobox.updateSelectedOptionIndex();
                                    setSearch(e.currentTarget.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Backspace' && search.length === 0) {
                                        event.preventDefault();
                                        handleValueRemove(value[value.length - 1]);
                                    }
                                }}
                                value={search}
                            />
                        </Combobox.EventsTarget>
                    </Pill.Group>
                </PillsInput>
            </Combobox.DropdownTarget>
            <Combobox.Dropdown>
                <Combobox.Options mah={200} style={{ overflowY: 'scroll' }}>
                    {options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}