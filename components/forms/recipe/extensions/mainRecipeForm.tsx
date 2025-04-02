'use client'

import ComboBox from "@/components/misc/combobox/comboBox";
import ErrorPopover from "@/components/popovers/errorPopover";
import { MyInfoIcon } from "@/components/popovers/infoPopover";
import { preMadeIngredientTypes, preMadeIngredientTags } from "@/models/types/premadeIngredientTags";
import { Fieldset, TextInput, Textarea, Select, MultiSelect, Popover, Switch, rem, OptionsFilter, ComboboxItem } from "@mantine/core";
import { MdFamilyRestroom, MdOutlinePublic } from "react-icons/md";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { RecipeFormType } from "../recipeForm";
import { UseFormReturnType } from "@mantine/form";
import { useStateStore } from "@/context/stateStore";
import { errorType } from "@/models/types/error";
import { IngredientType } from "@/models/types/ingredientType";
import { StepType } from "@/models/types/stepType";
import SubmitButton from "@/components/buttons/submitButton";
import CancelButton from "@/components/buttons/cancelButton";
import { IUser } from "@/models/types/user";
import { IoPerson } from "react-icons/io5";

const optionsFilter: OptionsFilter = ({ options, search }) => {
    const filtered = (options as ComboboxItem[]).filter((option) =>
        option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );

    filtered.sort((a, b) => a.label.localeCompare(b.label));
    return filtered;
};

export default function MainRecipeForm({
    handleCancel,
    handleCreateRecipe,
    handleEditRecipe,
    errors,
    recipeForm,
    handleOpenViewers,
    secret,
    handleOpenAdd,
    stepPills,
    handleEditToggle,
    ingredientPills,
    creating,
    userInfo,
    familyRecipe

}: {
    handleCancel: () => void,
    handleCreateRecipe: ({ recipeForm }: { recipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => void,
    handleEditRecipe: ({ recipeForm }: { recipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType> }) => void,
    recipeForm: UseFormReturnType<RecipeFormType, (values: RecipeFormType) => RecipeFormType>, errors: errorType[],
    handleOpenViewers: () => void,
    secret: boolean,
    handleOpenAdd: (which: string) => void,
    stepPills: StepType[],
    ingredientPills: IngredientType[],
    handleEditToggle: (which: string, index: number) => void,
    creating: boolean,
    userInfo: IUser,
    familyRecipe: boolean
}) {

    const width = useStateStore(s => s.widthQuery);
    const errorsExist = errors ? true : false;
    const errName = errorsExist && errors.find((err) => err.which === 'name') ? true : false;
    const errDescription = errorsExist && errors.find((err) => err.which === 'description') ? true : false;
    const errType = errorsExist && errors.find((err) => err.which === 'type') ? true : false;
    const errTags = errorsExist && errors.find((err) => err.which === 'tags') ? true : false;
    const inFamily = userInfo.userFamilyID !== '' && userInfo.userFamilyID !== null;

    return (
        <form id="modalCreateRecipeForm" className="w-full h-full" onAbort={() => { recipeForm.reset(); recipeForm.clearErrors(); handleCancel(); }} onSubmit={creating ? recipeForm.onSubmit(() => handleCreateRecipe({ recipeForm })) : recipeForm.onSubmit(() => handleEditRecipe({ recipeForm }))}>
            <Fieldset legend={creating ? "Recipe Structure" : ''} mt={creating ? 0 : 2}>
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
                    key={recipeForm.key('name')}
                    {...recipeForm.getInputProps('name')}
                    error={errName}
                    className="overflow-hidden whitespace-nowrap text-ellipsis"
                />
                <Textarea
                    id="modalRecipeDescription"
                    name="modalRecipeDescription"
                    label="Recipe Description"
                    placeholder="Grandma's secret Apple Pie she made for us when we were younger"
                    className={`w-full text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis`}
                    withAsterisk
                    mt={'md'}
                    key={recipeForm.key('description')}
                    {...recipeForm.getInputProps('description')}
                    error={errDescription}
                />
                <Select
                    label="Recipe Type"
                    placeholder="Dessert"
                    data={preMadeIngredientTypes.map((type: string) => ({ value: type, label: type }))}
                    className="overflow-hidden whitespace-nowrap text-ellipsis"
                    filter={optionsFilter}
                    searchable
                    clearable
                    allowDeselect
                    mt={'md'}
                    id="modalRecipeType"
                    name="modalRecipeType"
                    key={recipeForm.key('type')}
                    {...recipeForm.getInputProps('type')}
                    error={errType}
                />
                <MultiSelect
                    label="Recipe Tags"
                    placeholder="Celebration"
                    data={preMadeIngredientTags.map((tag: string) => ({ value: tag, label: tag }))}
                    className="overflow-hidden whitespace-nowrap text-ellipsis"
                    filter={optionsFilter}
                    searchable
                    clearable
                    limit={5}
                    maxValues={5}
                    mt={'md'}
                    id="modalRecipeTags"
                    name="modalRecipeTags"
                    key={recipeForm.key('tags')}
                    {...recipeForm.getInputProps('tags')}
                    error={errTags}
                />
                <Fieldset className="flex flex-row justify-between items-center w-full h-full" legend='Steps' mt={'md'} variant="unstyled">
                    <ComboBox which="steps" handleOpenAdd={handleOpenAdd} pills={stepPills} handleEditToggle={handleEditToggle} />
                </Fieldset>
                <Fieldset className="flex flex-row justify-between items-center w-full h-full" legend='Ingredients' mt={'md'} variant="unstyled">
                    <ComboBox which="ingredients" handleOpenAdd={handleOpenAdd} pills={ingredientPills} handleEditToggle={handleEditToggle} />
                </Fieldset>

                <div className={`flex flex-row ${inFamily ? 'justify-between space-x-2' : 'justify-start'} items-center w-full h-full`}>
                    <Fieldset className="flex flex-row justify-between items-start w-full h-full" legend='Recipe viewabiltiy' mt={'md'}>
                        <div className={`flex flex-row justify-start items-center w-content h-content space-x-2`}>
                            <Popover width={width > 500 ? 500 : width - 50} position='top-start' withArrow shadow-sm="md">
                                <Popover.Target>
                                    <MyInfoIcon title="" />
                                </Popover.Target>
                                <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
                                    <p className="pb-2">{`Recipes cannot be viewed by anyone other than your family by default. You can add them to communities to be viewed if you'd like. However if you want to keep a recipe private, even from family, make this recipe private by setting the toggle to the right to private.`}</p>
                                    <p>{`From there you can add specific viewers to the recipe if you'd like, or not.`}</p>
                                </Popover.Dropdown>
                            </Popover>
                            <Switch
                                style={{ cursor: 'pointer' }}
                                checked={secret}
                                onChange={(e) => recipeForm.setFieldValue(`secret`, e.currentTarget.checked)}
                                color="red"
                                size="md"
                                onLabel='Private'
                                offLabel='Public'
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
                                <p className="h-fit text-xs md:text-sm pl-1">{`${recipeForm.getValues().secretViewerIDs.length} viewer${recipeForm.getValues().secretViewerIDs.length > 1 ? 's ' : ' '}added`}</p>
                                <p className="h-fit text-xs md:text-sm pr-1">+</p>
                            </button>
                        ) : (
                            <button className="h-[18px]">
                            </button>
                        )}
                    </Fieldset>
                    {inFamily &&
                        <Fieldset className="flex flex-row justify-between items-start w-full h-full" legend='Family Recipe?' mt={'md'}>
                            <div className={`flex flex-row justify-start items-center w-content h-content space-x-2`}>
                                <Popover width={width > 500 ? 500 : width - 50} position='top-start' withArrow shadow-sm="md">
                                    <Popover.Target>
                                        <MyInfoIcon title="" />
                                    </Popover.Target>
                                    <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
                                        <p className="pb-2">{`If this is a recipe made by your family, or you simply want to save it for the family, toggle this so it says 'Family.' Otherwise, you can just save it as a personal recipe and it won't be added to the family recipes. The choice is yours!`}</p>
                                    </Popover.Dropdown>
                                </Popover>
                                <Switch
                                    style={{ cursor: 'pointer' }}
                                    checked={familyRecipe}
                                    onChange={(e) => recipeForm.setFieldValue(`familyRecipe`, e.currentTarget.checked)}
                                    color="blue"
                                    size="md"
                                    onLabel='Family'
                                    offLabel='Personal'
                                    thumbIcon={
                                        !familyRecipe ? (
                                            <IoPerson
                                                style={{ width: rem(12), height: rem(12) }}
                                                color={'orange'}
                                            />
                                        ) : (
                                            <MdFamilyRestroom
                                                style={{ width: rem(12), height: rem(12) }}
                                                color={'teal'}
                                            />
                                        )
                                    }
                                />
                            </div>
                        </Fieldset>
                    }
                </div>
            </Fieldset>
            {creating &&
                <section className="flex flex-row w-full justify-evenly items-center pt-5">
                    <CancelButton handleCancel={() => { recipeForm.reset(); recipeForm.clearErrors(); handleCancel(); }} />
                    <SubmitButton buttonTitle="Create" />
                </section>
            }
        </form>
    )
}