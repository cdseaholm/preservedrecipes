'use client'

import { IIngredient, IngredientForForm } from "@/models/types/recipes/ingredient";
import { RecipeFormType } from "@/models/types/recipes/review";
import { CheckIcon, Combobox, Fieldset, Group, Pill, PillsInput, TextInput, useCombobox } from "@mantine/core";
import { useEffect, useState } from "react";

export default function RecipePanelIngredients({ recipeForm, ingredientNames }: { recipeForm: RecipeFormType, ingredientNames: IIngredient[] }) {

    // const ingredientPills = recipeForm.getValues().ingredients.map((ingredient) => {
    //     return ingredient
    // });

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');
    const [data, setData] = useState<IIngredient[]>(ingredientNames);

    const exactOptionMatch = data.some((item) => item.ingredient === search);

    const handleValueRemove = (val: string) => {
        const updatedIngredients = recipeForm.getValues().ingredients.filter((ing) => ing.ingredient !== val);
        recipeForm.setFieldValue('ingredients', updatedIngredients);
    };

    const handleValueSelect = (val: string) => {
        setSearch('');

        if (val === '$create') {
            const newIngredient = {
                ingredientId: '',
                ingredient: search,
                quantity: '',
            } as IngredientForForm;
            const standInIngredientData = {
                _id: '',
                ingredient: search,
            } as IIngredient
            setData((current) => [...current, standInIngredientData]);
            recipeForm.setFieldValue('ingredients', [...recipeForm.getValues().ingredients, newIngredient]);

        } else {
            // Find the actual ingredient ID from the data store
            const existingIngredient = data.find((ing) => ing.ingredient === val);

            const updatedIngredients = recipeForm.getValues().ingredients.find((ing) => ing.ingredient === val)
                ? recipeForm.getValues().ingredients.filter((ing) => ing.ingredient !== val)
                : [...recipeForm.getValues().ingredients, {
                    ingredientId: existingIngredient?._id.toString() || '', // Use actual MongoDB ID
                    ingredient: val,
                    quantity: '',
                    newIngredient: false,
                }] as IngredientForForm[];
            recipeForm.setFieldValue('ingredients', updatedIngredients);
        }
        combobox.closeDropdown();
    };



    const values = recipeForm.getValues().ingredients.map((item, index) => (
        <Pill key={`${item.ingredient}-${item.ingredientId}-${index}`} withRemoveButton onRemove={() => { handleValueRemove(item.ingredient); combobox.closeDropdown(); }}>
            {item.ingredient}
        </Pill>
    ));

    const options = data.filter((item) => item.ingredient.toLowerCase().includes(search.trim().toLowerCase())).map((item) => {
        const active = recipeForm.getValues().ingredients.some((ing) => ing.ingredient === item.ingredient);
        return (
            <Combobox.Option value={item.ingredient} key={item._id} active={active}>
                <Group gap="sm">
                    {active ? <CheckIcon size={12} /> : null}
                    <span>{item.ingredient}</span>
                </Group>
            </Combobox.Option>
        )
    });

    useEffect(() => {
        if (ingredientNames && ingredientNames.length > 0) {
            setData(ingredientNames);
        }
    }, [ingredientNames]);

    return (
        <Fieldset variant="filled" className="flex flex-col justify-start items-center w-full h-full overflow-hidden" legend={<p className="text-base md:text-lg font-semibold mt-12">Ingredients</p>}>
            <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
                <Combobox.DropdownTarget>
                    <PillsInput onClick={() => combobox.openDropdown()} w={'100%'}>
                        <Pill.Group>
                            {values}

                            <Combobox.EventsTarget>
                                <PillsInput.Field
                                    onFocus={() => combobox.openDropdown()}
                                    onBlur={() => combobox.closeDropdown()}
                                    value={search}
                                    placeholder="Search Ingredients"
                                    onChange={(event) => {
                                        combobox.updateSelectedOptionIndex();
                                        setSearch(event.currentTarget.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Backspace' && search.length === 0 && recipeForm.getValues().ingredients.length > 0) {
                                            event.preventDefault();
                                            handleValueRemove(recipeForm.getValues().ingredients[recipeForm.getValues().ingredients.length - 1].ingredient);
                                        } else if (!combobox.dropdownOpened) {
                                            combobox.openDropdown();
                                        }
                                    }}
                                />
                            </Combobox.EventsTarget>
                        </Pill.Group>
                    </PillsInput>
                </Combobox.DropdownTarget>

                <Combobox.Dropdown>
                    <Combobox.Options>

                        {options.length === 0 && search.trim().length === 0 && (
                            <Combobox.Empty>Type to search ingredients</Combobox.Empty>
                        )}

                        {options}

                        {!exactOptionMatch && search.trim().length > 0 && (
                            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
                        )}

                        {exactOptionMatch && search.trim().length > 0 && options.length === 0 && (
                            <Combobox.Empty>Nothing found</Combobox.Empty>
                        )}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>

            <div className="flex flex-col justify-start items-start w-full h-[50dvh] mt-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)] border border-accent/30 rounded-md overflow-hidden">
                <div className="grid grid-cols-3 w-full p-2 border-b border-accent/30 font-semibold text-sm sm:text-base gap-2 shadow-sm px-4 py-4 mb-2">
                    <p className="col-span-1">Ingredient</p>
                    <p className="col-span-2">Quantity</p>
                </div>
                <div className="flex flex-col justify-start items-start h-full w-full scrollbar-thin scrollbar-webkit overflow-auto overflow-y-auto overflow-x-hidden">
                    {recipeForm.getValues().ingredients.length > 0 ? (
                        recipeForm.getValues().ingredients.map((val, index) => (
                            <div key={`${val.ingredient}-${index}-quantity-type`} className="grid grid-cols-3 w-full p-2 items-center flex flex-row border-b border-accent/20 gap-2 pb-2 px-4">
                                <span title={val.ingredient} className="text-sm col-span-1 truncate">{val.ingredient}</span>
                                <div className="col-span-2">
                                    <TextInput
                                        id={`ingredientQuantity-${val.ingredient}-${index}-text`}
                                        name={`ingredientQuantity-${val.ingredient}-${index}-text`}
                                        placeholder="e.g., 2 cups, 3 tbsp, etc."
                                        key={recipeForm.key(`${val.ingredient}.quantity`)}
                                        onChange={(event) => {
                                            const updatedIngredients = recipeForm.getValues().ingredients.map((ing) => {
                                                if (ing.ingredient === val.ingredient) {
                                                    return { ...ing, quantity: event.currentTarget.value };
                                                }
                                                return ing;
                                            });
                                            recipeForm.setFieldValue('ingredients', updatedIngredients);
                                        }}
                                        value={val.quantity}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div key={'no-ingredient-text'} className="flex flex-col justify-center items-center rounded-md px-2 py-1 mr-2 mb-2 w-full">
                            <p className="text-sm italic text-accent/70 text-center">No ingredients added yet</p>
                            <p className="text-sm italic text-accent/70 text-center">Begin typing in the search bar above</p>
                            <p className="text-sm italic text-accent/70 text-center">You can either add ingredients previously made or create a new one by typing it there</p>
                            <p className="text-sm italic text-accent/70 text-center">You are not required to add any, but it could help others perfect your recipe</p>
                        </div>
                    )}
                </div>
            </div>
        </Fieldset>
    );

}