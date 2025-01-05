'use client'

import { ComboboxItem, Fieldset, MultiSelect, OptionsFilter, Popover, Select, Switch, TextInput, Textarea, rem } from "@mantine/core";
import ModalTemplate from "../templates/modalTemplate";
import { UseFormReturnType } from "@mantine/form";
import { useStateStore } from "@/context/stateStore";
import ComboBox from "@/components/misc/combobox/comboBox";
import { StepType } from "@/models/types/stepType";
import { IngredientType } from "@/models/types/ingredientType";
import { RecipeCreation } from "@/models/types/recipeCreation";
import ErrorPopover from "@/components/popovers/errorPopover";
import { errorType } from "@/models/types/error";
import { preMadeIngredientTags, preMadeIngredientTypes } from "@/models/types/premadeIngredientTags";
import { MdOutlinePublic } from "react-icons/md";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { MyInfoIcon } from "@/components/popovers/infoPopover";


const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter((option) =>
        option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
};

export default function MainRecipeModal({ handleCancel, handleCreateRecipe, form, handleOpenAdd, handleEditToggle, stepPills, ingredientPills, errors, secret, handleOpenViewers }: { handleCancel: () => void, handleCreateRecipe: (initialValues: RecipeCreation) => void, form: UseFormReturnType<RecipeCreation, (values: RecipeCreation) => RecipeCreation>, handleOpenAdd: (which: string) => void, handleEditToggle: (which: string, index: number) => void, stepPills: StepType[], ingredientPills: IngredientType[], errors: errorType[], secret: boolean, handleOpenViewers: () => void }) {

    const width = useStateStore(s => s.widthQuery);
    const minWidth = width < 800 ? '80vw' : '60vw';
    const errorsExist = errors ? true : false;
    const errName = errorsExist && errors.find((err) => err.which === 'name') ? true : false;
    const errDescription = errorsExist && errors.find((err) => err.which === 'description') ? true : false;
    const errType = errorsExist && errors.find((err) => err.which === 'type') ? true : false;
    const errTags = errorsExist && errors.find((err) => err.which === 'tags') ? true : false;

    return (
        <ModalTemplate subtitle={null} minHeight="15vh" minWidth={minWidth}>
            <form id="modalCreateRecipeForm" className="w-full h-full">
                <Fieldset legend="Recipe Structure">
                    <div className="flex flex-row w-full justify-end items-center">
                        <ErrorPopover errors={errors} width={width} />
                    </div>
                    <TextInput
                        id="modalRecipeName"
                        name="modalRecipeName"
                        label="Recipe Name"
                        placeholder="Grandma's Apple Pie"
                        mt={'md'}
                        withAsterisk
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                        error={errName}
                    />
                    <Textarea
                        id="modalRecipeDescription"
                        name="modalRecipeDescription"
                        label="Recipe Description"
                        placeholder="Grandma's secret Apple Pie she made for us when we were younger"
                        className={`w-full text-xs sm:text-sm`}
                        withAsterisk
                        mt={'md'}
                        key={form.key('description')}
                        {...form.getInputProps('description')}
                        error={errDescription}
                    />
                    <Select
                        label="Recipe Type"
                        placeholder="Dessert"
                        data={preMadeIngredientTypes.map((type: string) => ({ value: type, label: type }))}
                        filter={optionsFilter}
                        searchable
                        clearable
                        allowDeselect
                        mt={'md'}
                        id="modalRecipeType"
                        name="modalRecipeType"
                        key={form.key('type')}
                        {...form.getInputProps('type')}
                        error={errType}
                    />
                    <MultiSelect
                        label="Recipe Type"
                        placeholder="Dessert"
                        data={preMadeIngredientTags.map((tag: string) => ({ value: tag, label: tag }))}
                        filter={optionsFilter}
                        searchable
                        clearable
                        limit={5}
                        maxValues={5}
                        mt={'md'}
                        id="modalRecipeTags"
                        name="modalRecipeTags"
                        key={form.key('tags')}
                        {...form.getInputProps('tags')}
                        error={errTags}
                    />
                    <Fieldset className="flex flex-row justify-between items-center w-full h-full" legend='Steps' mt={'md'} variant="unstyled">
                        <ComboBox which="steps" handleOpenAdd={handleOpenAdd} pills={stepPills} handleEditToggle={handleEditToggle} />
                    </Fieldset>
                    <Fieldset className="flex flex-row justify-between items-center w-full h-full" legend='Ingredients' mt={'md'} variant="unstyled">
                        <ComboBox which="ingredients" handleOpenAdd={handleOpenAdd} pills={ingredientPills} handleEditToggle={handleEditToggle} />
                    </Fieldset>
                    <Fieldset className="flex flex-row justify-between items-center w-full h-full" legend='Recipe viewabiltiy' mt={'md'} variant="unstyled">

                        <div className="flex flex-row justify-start items-center w-1/2 sm:w-2/3 space-x-2">
                            <Popover width={width > 500 ? 500 : width - 50} position='bottom-start' withArrow shadow="md">
                                <Popover.Target>
                                    <MyInfoIcon />
                                </Popover.Target>
                                <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
                                    <p className="pb-2">{`Recipes cannot be viewed by anyone other than your family by default. You can add them to communities to be viewed if you'd like. However if you want to keep a recipe private, even from family, make this recipe private by setting the toggle to the right to private.`}</p>
                                    <p>{`From there you can add specific viewers to the recipe if you'd like, or not.`}</p>
                                </Popover.Dropdown>
                            </Popover>
                            <Switch
                                checked={secret}
                                onChange={(e) => form.setFieldValue(`secret`, e.currentTarget.checked)}
                                color="red"
                                size="md"
                                label={`${secret ? 'Private' : 'Public'}`}
                                thumbIcon={
                                    !secret ? (
                                        <MdOutlinePublic
                                            style={{ width: rem(12), height: rem(12) }}
                                            color={'teal'}
                                        />
                                    ) : (
                                        <RiGitRepositoryPrivateLine
                                            style={{ width: rem(12), height: rem(12) }}
                                            color={'red'}
                                        />
                                    )
                                }
                            />
                        </div>
                        {secret ? (
                            <button type="button" onClick={handleOpenViewers} className="h-[18px] flex flex-row w-content justify-end space-x-2 hover:bg-blue-300 rounded-md" title="Add more viewers">
                                <p className="h-fit text-xs md:text-sm pl-1">{`${form.getValues().secretViewerIDs.length} viewer${form.getValues().secretViewerIDs.length > 1 ? 's ' : ' '}added`}</p>
                                <p className="h-fit text-xs md:text-sm pr-1">+</p>
                            </button>
                        ) : (
                            <button className="h-[18px]">

                            </button>
                        )}
                    </Fieldset>
                </Fieldset>
                <section className="flex flex-row w-full justify-evenly items-center pt-5">
                    <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5">
                        Cancel
                    </button>
                    <button type='button' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5" onClick={() => handleCreateRecipe(form.getValues())}>
                        Create
                    </button>
                </section>
            </form>
        </ModalTemplate>
    )
}