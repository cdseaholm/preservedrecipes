'use client'


import { CheckIcon, ErrIcon } from "@/components/misc/icons/icon";
import { RecipeFormType } from "@/models/types/recipes/review";
import { Button } from "@mantine/core";
import { BiCheck, BiTrash } from "react-icons/bi";

export default function RecipePanelFinalize({ recipeForm, handleCreate, handleEdit, formType, attemptedToCreate, handleDelete }: { recipeForm: RecipeFormType, handleCreate: () => void, handleEdit: () => void, formType: 'view' | 'edit' | 'create' | '', attemptedToCreate: boolean, handleDelete: () => void }) {

    const rows = [
        { label: 'Recipe Name', value: recipeForm.getValues().name, error: recipeForm.errors.name, tab: 'info' },
        { label: 'Recipe Description', value: recipeForm.getValues().description, error: recipeForm.errors.description, tab: 'info' },
        { label: 'Cooking Time', value: `${recipeForm.getValues().cookingTime} minutes`, error: recipeForm.errors.cookingTime, tab: 'info' },
        { label: 'Image Uploaded', value: recipeForm.getValues().image ? 'Yes' : 'No', error: recipeForm.errors.image, tab: 'info' },
        { label: 'Number of Ingredients', value: recipeForm.getValues().ingredients.length.toString(), error: recipeForm.errors.ingredients, tab: 'ingredients' },
        { label: 'Number of Instructions', value: recipeForm.getValues().steps.length.toString(), error: recipeForm.errors.steps, tab: 'instructions' },
        { label: 'Recipe Type', value: recipeForm.getValues().recipeType.length.toString(), error: recipeForm.errors.type, tab: 'sharing' },
        { label: 'Recipe Tags', value: recipeForm.getValues().tags.length.toString(), error: recipeForm.errors.tags, tab: 'sharing' },
        { label: 'Private Recipe', value: recipeForm.getValues().secret ? 'Yes' : 'No', error: recipeForm.errors.secret, tab: 'sharing' },
        { label: 'Viewers Added', value: recipeForm.getValues().secretViewerIDs.length.toString(), error: recipeForm.errors.secretViewerIDs, tab: 'sharing' },
        { label: 'Privacy Level', value: recipeForm.getValues().recipeFor, error: recipeForm.errors.recipeFor, tab: 'sharing' },
    ];

    return (
        <div className="flex w-full flex-col gap-4">
            <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">Review</p>
                <h3 className="text-xl font-semibold text-mainText">Ready to save?</h3>
            </div>
            <div className="overflow-hidden rounded-md border border-accent/15 bg-mainBack/70">
            {rows.map((row, index) => (
                row.label === 'Viewers Added' && !recipeForm.getValues().secret ? (
                    null
                ) : (
                    <div key={index} className="grid w-full grid-cols-1 gap-2 border-b border-accent/15 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                        <span className="flex min-w-0 flex-row items-center gap-2">
                            {attemptedToCreate && row.error ? (
                                <ErrIcon tooltip={`Error: ${row.error}`} />
                            ) : attemptedToCreate && !row.error ? (
                                <CheckIcon tooltip="No errors" />
                            ) : (
                                null
                            )}
                            <p className="text-sm font-semibold">{`${row.label}:`}</p>
                            <p className="truncate text-sm text-mainText/70">{row.value}</p>
                        </span>
                        <span className="flex flex-row justify-start sm:justify-end">
                            <p className="text-xs font-semibold uppercase tracking-wide text-mainText/50">
                                {`${row.tab.charAt(0).toUpperCase() + row.tab.slice(1)} Tab`}
                            </p>
                        </span>
                    </div>
                )
            ))}
            </div>
            <div className={`hidden flex-row ${formType === 'edit' ? 'justify-between' : 'justify-start'} items-center w-full gap-3 sm:flex`}>
                <Button type="button" leftSection={<BiCheck />} onClick={() => {
                    if (formType === 'edit') {
                        handleEdit();
                    } else {
                        handleCreate();
                    }
                }}>
                    {formType === 'edit' ? 'Save Recipe' : 'Create Recipe'}
                </Button>
                {formType === 'edit' && (
                    <Button type="button" variant="light" color="red" leftSection={<BiTrash />} onClick={() => {
                        handleDelete();
                    }}>
                        Delete
                    </Button>
                )}
            </div>
        </div>
    );
}
