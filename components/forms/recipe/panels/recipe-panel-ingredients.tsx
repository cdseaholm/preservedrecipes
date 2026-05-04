'use client'

import { IIngredient, IngredientForForm } from "@/models/types/recipes/ingredient";
import { RecipeFormType } from "@/models/types/recipes/review";
import { ActionIcon, Button, CheckIcon, Combobox, Group, Pill, PillsInput, TextInput, useCombobox } from "@mantine/core";
import { useEffect, useState } from "react";
import { BiPlus, BiTrash } from "react-icons/bi";

export default function RecipePanelIngredients({ recipeForm, ingredientNames }: { recipeForm: RecipeFormType, ingredientNames: IIngredient[] }) {

    // const ingredientPills = recipeForm.getValues().ingredients.map((ingredient) => {
    //     return ingredient
    // });

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const [search, setSearch] = useState('');
    const [quickIngredient, setQuickIngredient] = useState('');
    const [quickQuantity, setQuickQuantity] = useState('');
    const [data, setData] = useState<IIngredient[]>(ingredientNames);

    const exactOptionMatch = data.some((item) => item.ingredient.toLowerCase() === search.trim().toLowerCase());
    const createTempIngredientId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const handleValueRemove = (val: string) => {
        const updatedIngredients = recipeForm.getValues().ingredients.filter((ing) => ing.ingredient !== val);
        recipeForm.setFieldValue('ingredients', updatedIngredients);
    };

    const handleValueSelect = (val: string) => {
        setSearch('');

        if (val === '$create') {
            const trimmedSearch = search.trim();
            const tempIngredientId = createTempIngredientId();
            const newIngredient = {
                ingredientId: tempIngredientId,
                ingredient: trimmedSearch,
                quantity: '',
            } as IngredientForForm;
            const standInIngredientData = {
                _id: tempIngredientId,
                ingredient: trimmedSearch,
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

    const handleQuickAdd = () => {
        const ingredientName = quickIngredient.trim();
        const quantity = quickQuantity.trim();

        if (!ingredientName) {
            return;
        }

        const existingIngredient = recipeForm.getValues().ingredients.find((ingredient) => (
            ingredient.ingredient.toLowerCase() === ingredientName.toLowerCase()
        ));

        if (existingIngredient) {
            const updatedIngredients = recipeForm.getValues().ingredients.map((ingredient) => (
                ingredient.ingredient.toLowerCase() === ingredientName.toLowerCase()
                    ? { ...ingredient, quantity: quantity || ingredient.quantity }
                    : ingredient
            ));
            recipeForm.setFieldValue('ingredients', updatedIngredients);
        } else {
            const tempIngredientId = createTempIngredientId();
            recipeForm.setFieldValue('ingredients', [
                ...recipeForm.getValues().ingredients,
                {
                    ingredientId: tempIngredientId,
                    ingredient: ingredientName,
                    quantity,
                    newIngredient: true,
                } as IngredientForForm,
            ]);
            setData((current) => [
                ...current,
                { _id: tempIngredientId, ingredient: ingredientName } as IIngredient,
            ]);
        }

        setQuickIngredient('');
        setQuickQuantity('');
    };



    const values = recipeForm.getValues().ingredients.map((item, index) => (
        <Pill key={`${item.ingredient}-${item.ingredientId}-${index}`} withRemoveButton onRemove={() => { handleValueRemove(item.ingredient); combobox.closeDropdown(); }}>
            {item.ingredient}
        </Pill>
    ));

    const options = data.filter((item) => item.ingredient.toLowerCase().includes(search.trim().toLowerCase())).map((item) => {
        const active = recipeForm.getValues().ingredients.some((ing) => ing.ingredient === item.ingredient);
        return (
            <Combobox.Option value={item.ingredient} key={item._id || item.ingredient} active={active}>
                <Group gap="sm">
                    {active ? <CheckIcon size={12} /> : null}
                    <span>{item.ingredient}</span>
                </Group>
            </Combobox.Option>
        )
    });

    useEffect(() => {
        const selectedIngredients = recipeForm.getValues().ingredients.map((ingredient) => ({
            _id: ingredient.ingredientId || ingredient.ingredient,
            ingredient: ingredient.ingredient,
        })) as IIngredient[];

        const mergedIngredients = [...ingredientNames, ...selectedIngredients].filter((ingredient, index, allIngredients) => (
            ingredient.ingredient &&
            allIngredients.findIndex((item) => item.ingredient.toLowerCase() === ingredient.ingredient.toLowerCase()) === index
        ));

        setData(mergedIngredients);
    }, [ingredientNames, recipeForm]);

    return (
        <div className="flex w-full flex-col gap-4">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">Ingredients</p>
                <h3 className="text-xl font-semibold text-mainText">Build the shopping list</h3>
            </div>
            <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
                <Combobox.DropdownTarget>
                    <PillsInput onClick={() => combobox.openDropdown()} w={'100%'} label="Add ingredients">
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

            <div className="grid grid-cols-1 gap-2 rounded-md border border-accent/15 bg-mainBack/70 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(160px,0.8fr)_auto] sm:items-end">
                <TextInput
                    label="Quick add"
                    placeholder="Ingredient"
                    value={quickIngredient}
                    onChange={(event) => setQuickIngredient(event.currentTarget.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleQuickAdd();
                        }
                    }}
                />
                <TextInput
                    label="Quantity"
                    placeholder="2 cups"
                    value={quickQuantity}
                    onChange={(event) => setQuickQuantity(event.currentTarget.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            handleQuickAdd();
                        }
                    }}
                />
                <Button
                    type="button"
                    variant="light"
                    leftSection={<BiPlus />}
                    onClick={handleQuickAdd}
                    disabled={!quickIngredient.trim()}
                    className="w-full sm:w-auto"
                >
                    Add
                </Button>
            </div>

            <div className="flex flex-col gap-2">
                    {recipeForm.getValues().ingredients.length > 0 ? (
                        recipeForm.getValues().ingredients.map((val, index) => (
                            <div key={`${val.ingredient}-${index}-quantity-type`} className="grid w-full grid-cols-1 gap-2 rounded-md border border-accent/15 bg-mainBack/70 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,1.4fr)_auto] sm:items-end">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-mainText/50">Ingredient</p>
                                    <p title={val.ingredient} className="truncate text-sm font-medium text-mainText">{val.ingredient}</p>
                                </div>
                                <div>
                                    <TextInput
                                        id={`ingredientQuantity-${val.ingredient}-${index}-text`}
                                        name={`ingredientQuantity-${val.ingredient}-${index}-text`}
                                        label="Quantity"
                                        placeholder="2 cups, 3 tbsp, to taste"
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
                                <ActionIcon
                                    type="button"
                                    variant="subtle"
                                    color="red"
                                    aria-label={`Remove ${val.ingredient}`}
                                    onClick={() => handleValueRemove(val.ingredient)}
                                    className="justify-self-end"
                                >
                                    <BiTrash />
                                </ActionIcon>
                            </div>
                        ))
                    ) : (
                        <div key={'no-ingredient-text'} className="rounded-md border border-dashed border-accent/30 bg-mainBack/60 px-4 py-8 text-center">
                            <p className="text-sm font-medium text-mainText">No ingredients yet</p>
                            <p className="text-sm text-mainText/60">Search above, or type a new ingredient name and create it.</p>
                        </div>
                    )}
            </div>
        </div>
    );

}
