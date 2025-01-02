import { IngredientType } from '@/models/types/ingredientType';
import { StepType } from '@/models/types/stepType';
import { Input, InputBase, Combobox, useCombobox } from '@mantine/core';
import { GoPencil, GoPlus } from 'react-icons/go';

export default function ComboBox({ pills, handleOpenAdd, which, handleEditToggle }: { pills: IngredientType[] | StepType[], handleOpenAdd: (which: string) => void, which: string, handleEditToggle: (which: string, index: number) => void }) {

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const value = pills.length === 0 ? `Click to add or edit ${which}` : `${pills.length} ${which}`;

    const handleOptionClick = (which: string) => {
        combobox.closeDropdown();
        handleOpenAdd(which);
    };

    const handleOptionEditClick = (which: string, index: number) => {
        combobox.closeDropdown();
        handleEditToggle(which, index);
    }

    const typePills = which === 'steps' ? pills as StepType[] : pills as IngredientType[];

    const options = typePills.map((item, index) => {
        if (which === 'steps') {
            const stepItem = item ? item as StepType : {} as StepType;
            const stepID = stepItem ? stepItem.stepId : -1;
            return (
                <Combobox.Option value={stepID.toString()} key={stepID} onClick={() => handleOptionEditClick(which, index)}>
                    {`Step: ${stepID + 1}`}
                </Combobox.Option>
            );
        } else {
            const ingredientItem = item ? item as IngredientType : {} as IngredientType;
            const ingId = ingredientItem ? ingredientItem.ingredientId : -1
            const ingIng = ingredientItem ? ingredientItem.ingredient : 'Ingredient'
            return (
                <Combobox.Option value={ingId.toString()} key={ingId} onClick={() => handleOptionEditClick(which, index)}>
                    {`${index + 1}. ${ingIng}`}
                </Combobox.Option>
            );
        }
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
                    className='w-full h-full'
                >
                    {value || <Input.Placeholder>Empty</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown className='w-full'>
                <Combobox.Options className='w-full'>
                    <Combobox.Option
                        value='openChild'
                        key={'-1'}
                        onClick={() => handleOptionClick(which)}
                        title={`Add ${which}`}
                        className="w-full flex flex-row items-center h-fit"
                    >
                        {`Add ${which === 'steps' ? 'a step' : 'an ingredient'}`}
                        <GoPlus className="ml-2" />
                    </Combobox.Option>
                    <Combobox.Option
                        disabled={pills.length === 0 ? true : false}
                        value='openChild'
                        key={'-2'}
                        onClick={() => combobox.toggleDropdown()}
                        title={`Edit ${which}`}
                        className={`w-full flex flex-row items-center h-fit ${pills.length === 0 ? 'text-gray-400' : ''}`}
                    >
                        {`To edit, click the ${which === 'steps' ? 'step' : 'ingredient'} you would like to edit`}
                        <GoPencil className="ml-2" />
                    </Combobox.Option>
                    <Combobox.Group label={which === 'steps' ? 'Steps' : 'Ingredients'}>
                        {options}
                    </Combobox.Group>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}