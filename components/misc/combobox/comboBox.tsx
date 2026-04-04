
import { IngredientForForm } from '@/models/types/recipes/ingredient';
import { IStep } from '@/models/types/recipes/step';
import { Input, InputBase, Combobox, useCombobox } from '@mantine/core';
import { GoPencil, GoPlus } from 'react-icons/go';

export default function ComboBox({ pills, handleOpenAdd, which, handleEditToggle }: { pills: IngredientForForm[] | IStep[], handleOpenAdd: (which: string) => void, which: string, handleEditToggle: (which: string, index: number) => void }) {

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const value = pills.length === 0 ? `Empty` : `${pills.length} ${which}`;

    const handleOptionClick = (which: string) => {
        combobox.closeDropdown();
        handleOpenAdd(which);
    };

    const handleOptionEditClick = (which: string, index: number) => {
        combobox.closeDropdown();
        handleEditToggle(which, index);
    }

    const typePills = which === 'steps' ? pills as IStep[] : pills as IngredientForForm[];

    const options = typePills.map((item, index) => {
        if (which === 'steps') {
            if (!item) {
                return;
            }
            
            return (
                <Combobox.Option value={`${index}`} key={index} onClick={() => handleOptionEditClick(which, index)}>
                    {`Step: ${index + 1}`}
                </Combobox.Option>
            );
        } else {
            const ingredientItem = item ? item as IngredientForForm : {} as IngredientForForm;
            const ingId = ingredientItem ? ingredientItem.ingredientId : -1
            const ingIng = ingredientItem ? ingredientItem.ingredient : 'Ingredient';
            return (
                <Combobox.Option value={ingredientItem.ingredient} key={ingId} onClick={() => handleOptionEditClick(which, index)}>
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
                    className='w-full h-full overflow-hidden whitespace-nowrap text-ellipsis'
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
                        onClick={() => handleOptionClick(which)}
                        title={`Add ${which}`}
                        className="w-full flex flex-row items-center h-fit overflow-hidden whitespace-nowrap text-ellipsis"
                    >
                        <GoPlus className="mr-2" />
                        {`Add ${which === 'steps' ? 'a step' : 'an ingredient'}`}
                    </Combobox.Option>
                    <Combobox.Option
                        disabled={pills.length === 0}
                        value='openChild'
                        key={'-2'}
                        onClick={() => combobox.toggleDropdown()}
                        title={`Edit ${which}`}
                        className={`w-full flex flex-row items-center h-fit ${pills.length === 0 ? 'text-gray-400' : ''} overflow-hidden whitespace-nowrap text-ellipsis`}
                        style={{ textOverflow: 'ellipsis' }}
                    >
                        <GoPencil className="mr-2" />
                        {`To edit, click an option`}
                    </Combobox.Option>
                    <Combobox.Group label={which === 'steps' ? 'Steps' : 'Ingredients'}>
                        {options}
                    </Combobox.Group>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}