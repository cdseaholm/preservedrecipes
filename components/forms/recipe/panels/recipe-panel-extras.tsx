'use client'

import { MyInfoIcon } from "@/components/popovers/infoPopover";
import { Accordion, ComboboxItem, OptionsFilter, Popover } from "@mantine/core"
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
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent">Sharing</p>
                    <h3 className="text-xl font-semibold text-mainText">Categorize and choose visibility</h3>
                </div>
                <Popover width={'auto'} position='top-start' withArrow shadow="md">
                    <Popover.Target>
                        <button type="button" className='cursor-pointer rounded-md p-1 hover:bg-accent/10'>
                            <MyInfoIcon title="" />
                        </button>
                    </Popover.Target>
                    <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }} w={300}>
                        <p>These are not required, but add features that help others find your recipe, categorize it, or keep it a secret. These are can changed later.</p>
                    </Popover.Dropdown>
                </Popover>
            </div>

            <div className="rounded-md border border-accent/15 bg-mainBack/70 p-3">
                {width > 640 ? (
                    <div className="flex flex-row justify-between items-center w-full space-x-4">
                        <RecipeVisibility secret={secret} handleSecret={handleSecret} width={width} />
                    </div>
                ) : (
                    <RecipeVisibility secret={secret} handleSecret={handleSecret} width={width} />
                )}
            </div>
            <RecipeMainType recipeForm={recipeForm} optionsFilter={optionsFilter} />
            <RecipeTags recipeForm={recipeForm} optionsFilter={optionsFilter} />
            <Accordion variant="separated" defaultValue={secret ? 'viewers' : null}>
                <Accordion.Item value="viewers">
                    <Accordion.Control>Private viewers</Accordion.Control>
                    <Accordion.Panel>
                        {secret ? (
                            <RecipeViewers recipeForm={recipeForm} width={width} />
                        ) : (
                            <p className="text-sm text-mainText/60">Turn on private visibility to add specific viewers.</p>
                        )}
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}
