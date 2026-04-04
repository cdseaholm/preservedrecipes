'use client'

import { Fieldset, NumberInput, TextInput, Textarea } from "@mantine/core";
import { RecipePhotoUploader } from "@/components/buttons/uploadThing-button";
import InfoPopover from "@/components/popovers/infoPopover";
import { RecipeFormType } from "@/models/types/recipes/review";

export default function RecipePanelInfo({ recipeForm }: { recipeForm: RecipeFormType }) {
    return (
        <Fieldset variant="filled" legend={<p className="text-base md:text-lg font-semibold mt-12">Define and Describe Your Recipe</p>}>
            {/* <div className="flex flex-row w-full justify-end items-center">
                <ErrorPopover errors={errors} width={width} />
            </div> */}
            <TextInput
                id="modalRecipeName"
                name="modalRecipeName"
                label="Recipe Name"
                placeholder="Grandma's Apple Pie"
                mt={'md'}
                withAsterisk
                key={recipeForm.key('name')}
                {...recipeForm.getInputProps('name')}
                error={recipeForm.errors.name}
                className="overflow-hidden whitespace-nowrap text-ellipsis"
            />
            <Textarea
                id="modalRecipeDescription"
                name="modalRecipeDescription"
                label="Recipe Description"
                placeholder="Grandma's secret Apple Pie she made for us when we were younger"
                className={`w-full text-xs sm:text-sm overflow-hidden whitespace-nowrap text-ellipsis`}
                autosize
                minRows={6}
                mt={'md'}
                key={recipeForm.key('description')}
                error={recipeForm.errors.description}
                {...recipeForm.getInputProps('description')}
            />
            <div className="flex flex-row justify-between items-end w-full mt-4 space-x-4">
                <NumberInput 
                    id="modalRecipeCookingTime"
                    name="modalRecipeCookingTime"
                    label="Cooking Time (minutes)"
                    placeholder="45"
                    min={1}
                    key={recipeForm.key('cookingTime')}
                    {...recipeForm.getInputProps('cookingTime')}
                    error={recipeForm.errors.cookingTime}
                    className="flex-1"
                    w={'auto'}
                />
                <div className="flex flex-col justify-end items-end w-1/4">
                    <InfoPopover title="Recipe Image" infoOne="Upload a photo here for your recipe - Currently unavailable" infoTwo="This could be a picture of the recipe itself, or the finished product" />
                    <RecipePhotoUploader test={true} />
                </div>

            </div>
        </Fieldset>
    );
}