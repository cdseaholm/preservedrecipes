'use client'


import { CheckIcon, ErrIcon } from "@/components/misc/icons/icon";
import { RecipeFormType } from "@/models/types/recipes/review";
import { Fieldset } from "@mantine/core";

export default function RecipePanelFinalize({ recipeForm, handleCreate, handleEdit, formType, attemptedToCreate, handleDelete }: { recipeForm: RecipeFormType, handleCreate: () => void, handleEdit: () => void, formType: 'view' | 'edit' | 'create' | '', attemptedToCreate: boolean, handleDelete: () => void }) {

    const rows = [
        { label: 'Recipe Name', value: recipeForm.getValues().name, error: recipeForm.errors.name, tab: 'info' },
        { label: 'Recipe Description', value: recipeForm.getValues().description, error: recipeForm.errors.description, tab: 'info' },
        { label: 'Cooking Time', value: `${recipeForm.getValues().cookingTime} minutes`, error: recipeForm.errors.cookingTime, tab: 'info' },
        { label: 'Image Uploaded', value: recipeForm.getValues().image ? 'Yes' : 'No', error: recipeForm.errors.image, tab: 'info' },
        { label: 'Number of Ingredients', value: recipeForm.getValues().ingredients.length.toString(), error: recipeForm.errors.ingredients, tab: 'ingredients' },
        { label: 'Number of Instructions', value: recipeForm.getValues().steps.length.toString(), error: recipeForm.errors.steps, tab: 'instructions' },
        { label: 'Recipe Type', value: recipeForm.getValues().recipeType.length.toString(), error: recipeForm.errors.type, tab: 'extras' },
        { label: 'Recipe Tags', value: recipeForm.getValues().tags.length.toString(), error: recipeForm.errors.tags, tab: 'extras' },
        { label: 'Private Recipe', value: recipeForm.getValues().secret ? 'Yes' : 'No', error: recipeForm.errors.secret, tab: 'extras' },
        { label: 'Viewers Added', value: recipeForm.getValues().secretViewerIDs.length.toString(), error: recipeForm.errors.secretViewerIDs, tab: 'extras' },
        { label: 'Privacy Level', value: recipeForm.getValues().recipeFor, error: recipeForm.errors.recipeFor, tab: 'extras' },
    ];

    return (
        <Fieldset variant="filled" legend={<p className="text-base md:text-lg font-semibold mt-12">Finalize Your Recipe Details</p>}>
            {rows.map((row, index) => (
                row.label === 'Viewers Added' && !recipeForm.getValues().secret ? (
                    null
                ) : (
                    <div key={index} className="grid grid-cols-2 w-full p-2 items-center flex flex-row border-b border-accent/20 gap-2 pb-2 px-4 h-content">
                        <span className="flex flex-row w-full justify-start items-center space-x-2">
                            {attemptedToCreate && row.error ? (
                                <ErrIcon tooltip={`Error: ${row.error}`} />
                            ) : attemptedToCreate && !row.error ? (
                                <CheckIcon tooltip="No errors" />
                            ) : (
                                null
                            )}
                            <p className="text-xs sm:text-sm font-semibold span-cols-1">{`${row.label}:`}</p>
                            <p className="text-xs sm:text-sm span-cols-1">{row.value}</p>
                        </span>
                        <span className="flex flex-row w-full justify-end items-center">
                            <p className="text-sm sm:text-base font-semibold">
                                {`${row.tab.charAt(0).toUpperCase() + row.tab.slice(1)} Tab`}
                            </p>
                            {/* Placeholder for future edit buttons */}
                        </span>
                    </div>
                )
            ))}
            <div className={`flex flex-row ${formType === 'edit' ? 'justify-between' : 'justify-start'} items-center w-full px-6 mt-6`}>
                <button type="button" className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md cursor-pointer" onClick={() => {
                    if (formType === 'edit') {
                        handleEdit();
                    } else {
                        handleCreate();
                    }
                }}>
                    {formType === 'edit' ? 'Save Recipe' : 'Create Recipe'}
                </button>
                {formType === 'edit' && (
                    <button type="button" className="mt-4 bg-red-400 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md cursor-pointer" onClick={() => {
                        handleDelete();
                    }}>
                        Delete
                    </button>
                )}
            </div>
        </Fieldset>
    );
}