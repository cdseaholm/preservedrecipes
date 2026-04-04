'use client'

import { MyInfoIcon } from "@/components/popovers/infoPopover"
import { preMadeIngredientTags } from "@/components/misc/tags/premadeIngredientTags"
import { RecipeFormType } from "@/models/types/recipes/review"
import { MultiSelect, OptionsFilter, Popover } from "@mantine/core"

export default function RecipeTags({ recipeForm, optionsFilter }: { recipeForm: RecipeFormType, optionsFilter: OptionsFilter }) {
    return (
        <MultiSelect
            label={
                <div className="flex flex-row justify-end items-center w-content space-x-2">
                    <Popover width={'auto'} position='top-start' withArrow shadow-sm="md">
                        <Popover.Target>
                            <div className='cursor-pointer flex flex-row justify-end items-center w-content h-full space-x-2'>
                                <p>Recipe Tags</p>
                                <MyInfoIcon title="" />
                            </div>
                        </Popover.Target>
                        <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }} w={300}>
                            <p>If your recipe has multiple types associated with it, or is for a special occasions, or you just want to add extra tags to it, this is where you can do so.</p>
                        </Popover.Dropdown>
                    </Popover>
                </div>
            }
            labelProps={{ onClick: (e) => e.preventDefault() }}
            placeholder="Celebration"
            data={preMadeIngredientTags.map((tag: string) => ({ value: tag, label: tag }))}
            className="overflow-hidden whitespace-nowrap text-ellipsis"
            w={'100%'}
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
        />
    )
}