'use client'

import { Button, Image, NumberInput, Progress, Textarea } from "@mantine/core";
import { RecipePhotoUploader, UploadedRecipeImage } from "@/components/buttons/uploadThing-button";
import { RecipeFormType } from "@/models/types/recipes/review";
import { BiImageAdd } from "react-icons/bi";

export default function RecipePanelInfo({
    recipeForm,
    onImageUpload,
    onImageUploadStart,
    onImageUploadProgress,
    onImageUploadSettled,
    isImageUploading,
    imageUploadProgress,
}: {
    recipeForm: RecipeFormType,
    onImageUpload: (file: UploadedRecipeImage) => void,
    onImageUploadStart: () => void,
    onImageUploadProgress: (progress: number) => void,
    onImageUploadSettled: () => void,
    isImageUploading: boolean,
    imageUploadProgress: number,
}) {
    const image = recipeForm.getValues().image;

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">Basics</p>
                <h3 className="text-xl font-semibold text-mainText">Start with the story</h3>
            </div>

            <div className="overflow-hidden rounded-md border border-accent/20 bg-mainBack">
                {image ? (
                    <Image
                        src={image}
                        alt={recipeForm.getValues().name || 'Recipe image'}
                        className="h-56 w-full object-cover sm:h-72"
                        fallbackSrc="https://placehold.co/900x500?text=Recipe+Photo"
                    />
                ) : (
                    <div className="flex h-48 flex-col items-center justify-center gap-2 bg-altBack/60 text-center text-mainText/70 sm:h-60">
                        <BiImageAdd size={34} />
                        <p className="text-sm font-medium">Add a recipe photo</p>
                    </div>
                )}
                <div className="flex items-center justify-between gap-3 border-t border-accent/20 px-3 py-2">
                    <p className="text-sm text-mainText/70">A photo makes the recipe easier to recognize later.</p>
                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                        {image && (
                            <Button
                                type="button"
                                variant="subtle"
                                color="red"
                                size="xs"
                                disabled={isImageUploading}
                                onClick={() => {
                                    recipeForm.setFieldValue('image', '');
                                    recipeForm.setFieldValue('imageKey', '');
                                }}
                            >
                                Remove
                            </Button>
                        )}
                        <RecipePhotoUploader
                            onUploadComplete={onImageUpload}
                            onUploadStart={onImageUploadStart}
                            onUploadProgress={onImageUploadProgress}
                            onUploadSettled={onImageUploadSettled}
                        />
                    </div>
                </div>
                {isImageUploading && (
                    <div className="border-t border-accent/20 px-3 py-3">
                        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-mainText/70">
                            <span>Uploading photo</span>
                            <span>{imageUploadProgress}%</span>
                        </div>
                        <Progress value={imageUploadProgress} color="accent" radius="sm" />
                    </div>
                )}
            </div>

            <Textarea
                id="modalRecipeDescription"
                name="modalRecipeDescription"
                label="Description"
                placeholder="A short note about where this recipe came from, when you make it, or what makes it special."
                className="w-full"
                autosize
                minRows={4}
                key={recipeForm.key('description')}
                error={recipeForm.errors.description}
                {...recipeForm.getInputProps('description')}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <NumberInput 
                    id="modalRecipeCookingTime"
                    name="modalRecipeCookingTime"
                    label="Cooking time"
                    placeholder="45"
                    min={1}
                    suffix=" minutes"
                    key={recipeForm.key('cookingTime')}
                    {...recipeForm.getInputProps('cookingTime')}
                    error={recipeForm.errors.cookingTime}
                />
            </div>
        </div>
    );
}
