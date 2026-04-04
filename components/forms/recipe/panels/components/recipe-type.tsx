'use client'

import { MyInfoIcon } from "@/components/popovers/infoPopover"
import { preMadeIngredientForForms } from "@/components/misc/tags/premadeIngredientTags"
import { RecipeFormType } from "@/models/types/recipes/review"
import { Select, Popover, OptionsFilter } from "@mantine/core"

export default function RecipeMainType({ recipeForm, optionsFilter }: { recipeForm: RecipeFormType, optionsFilter: OptionsFilter }) {
    return (
        <Select
            label={
                <div className="flex flex-row justify-end items-center w-content space-x-2">
                    <Popover width={'auto'} position='top-start' withArrow shadow-sm="md">
                        <Popover.Target>
                            <div className='cursor-pointer flex flex-row justify-end items-center w-content h-full space-x-2'>
                                <p>Recipe Main Type</p>
                                <MyInfoIcon title="" />
                            </div>
                        </Popover.Target>
                        <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }} w={300}>
                            <p>This is the main type that is strongest associated with your recipe.</p>
                        </Popover.Dropdown>
                    </Popover>
                </div>
            }
            labelProps={{ onClick: (e) => e.preventDefault() }}
            placeholder="Dessert"
            data={preMadeIngredientForForms.map((type: string) => ({ value: type, label: type }))}
            className="overflow-hidden whitespace-nowrap text-ellipsis"
            w={'100%'}
            filter={optionsFilter}
            searchable
            clearable={recipeForm.getValues().recipeType.length > 0}
            allowDeselect={recipeForm.getValues().recipeType.length > 0}
            mt={'md'}
            id="modalRecipeType"
            name="modalRecipeType"
            key={recipeForm.key('recipeType')}
            {...recipeForm.getInputProps('recipeType')}
        />
    )
}