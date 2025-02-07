'use client'

import { IngredientType } from '@/models/types/ingredientType';
import { StepType } from '@/models/types/stepType';
import { Input, InputBase, Combobox, useCombobox, Group, CheckIcon } from '@mantine/core';
import { GoPlus } from 'react-icons/go';

export default function ComboBoxMultiSelect({ pills, which, currentVals, handleSetValuesUsed, save, currValsLen }: { pills: IngredientType[] | StepType[], which: string, currentVals: IngredientType[], handleSetValuesUsed: (newVals: IngredientType[]) => void, save: () => void, currValsLen: number }) {

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const value = `${currValsLen} ingredients used in this step`

    const handleOptionClick = () => {
        combobox.closeDropdown();
        save();
    };

    const handleOptionAddRemove = (item: IngredientType) => {
        combobox.focusTarget();

        let newVals = currentVals as IngredientType[];
        if (currentVals.some(val => val.ingredientId === item.ingredientId)) {
            const filtered = currentVals.filter((val) => val.ingredientId !== item.ingredientId);
            newVals = [...filtered];
        } else {
            newVals = [...currentVals, item];
        }
        handleSetValuesUsed(newVals);
    };

    const typePills = pills as IngredientType[];

    const options = typePills.map((item, index) => {
        const ingredientItem = item as IngredientType;
        const ingIDString = ingredientItem.ingredientId.toString();
        return (
            <Combobox.Option value={ingIDString} key={ingIDString} onClick={() => handleOptionAddRemove(item)} active={currentVals.some(val => (val as IngredientType).ingredientId === ingredientItem.ingredientId)}>
                <Group gap={'sm'}>
                    {currentVals.some(val => (val as IngredientType).ingredientId === ingredientItem.ingredientId) ? <CheckIcon size={12} /> : <CheckIcon size={12} color='#f5f0f0' />}
                    {`${index + 1}: ${ingredientItem.ingredient}`}
                </Group>
            </Combobox.Option>
        );
    });

    return (
        <Combobox
            store={combobox}
            offset={0}
        >
            <Combobox.Target>
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                    className='w-full'
                    aria-label='Search'
                >
                    {value || <Input.Placeholder>Empty</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown className='w-full'>
                <Combobox.Options className='w-full'>
                    <Combobox.Option
                        value='openChild'
                        key={'-1'}
                        onClick={() => handleOptionClick()}
                        title={`Add ${which}`}
                        className="w-full flex flex-row items-center h-fit"
                    >
                        {`Create an ingredient by clicking here then add it from the list below below`}
                        <GoPlus className="ml-2" />
                    </Combobox.Option>
                    <Combobox.Group label={'Ingredients'}>
                        {options}
                    </Combobox.Group>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}