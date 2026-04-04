'use client'

import { MyInfoIcon } from "@/components/popovers/infoPopover";
import { ComboboxItem, Fieldset, OptionsFilter, Popover } from "@mantine/core"
import { useState } from "react";
import RecipeVisibility from "./components/recipe-visibility";
import RecipeMainType from "./components/recipe-type";
import RecipeTags from "./components/recipe-tags";
import { RecipeFormType } from "@/models/types/recipes/review";
import RecipeViewers from "../extensions/viewers";
import { useWindowSizes } from "@/context/width-height-store";

export default function RecipePanelExtras({ recipeForm }: { recipeForm: RecipeFormType }) {

    const { width } = useWindowSizes();
    const optionsFilter: OptionsFilter = ({ options, search }) => {
        const filtered = (options as ComboboxItem[]).filter((option) =>
            option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
        );

        filtered.sort((a, b) => a.label.localeCompare(b.label));
        return filtered;
    };
    const [secret, setSecret] = useState<boolean>(recipeForm.getValues().secret);
    const handleSecret = (value: boolean) => {
        setSecret(value);
        recipeForm.setFieldValue(`secret`, value);
    }



    return (
        <Fieldset variant="filled" legend={<p className="text-base md:text-lg font-semibold mt-12">Tags and Settings</p>}>
            <div className="flex flex-row justify-end items-center w-content space-x-2">
                <Popover width={'auto'} position='top-start' withArrow shadow-sm="md">
                    <Popover.Target>
                        <div className='cursor-pointer flex flex-row justify-start items-center w-content h-full space-x-2'>
                            <MyInfoIcon title="" />
                        </div>
                    </Popover.Target>
                    <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }} w={300}>
                        <p>These are not required, but add features that help others find your recipe, categorize it, or keep it a secret. These are can changed later.</p>
                    </Popover.Dropdown>
                </Popover>
            </div>

            {width > 640 ? (
                <div className="flex flex-row justify-between items-center w-full space-x-4">
                    <RecipeVisibility secret={secret} handleSecret={handleSecret} width={width} />
                </div>
            ) : (
                <>
                    <RecipeVisibility secret={secret} handleSecret={handleSecret} width={width} />
                </>
            )}
            <RecipeMainType recipeForm={recipeForm} optionsFilter={optionsFilter} />
            <RecipeTags recipeForm={recipeForm} optionsFilter={optionsFilter} />
            {secret && (
                <RecipeViewers recipeForm={recipeForm} width={width} />
            )}
        </Fieldset>
    );
}