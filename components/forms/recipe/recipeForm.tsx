'use client'

import { Button, CloseButton, TextInput } from "@mantine/core";
import { RecipeFormType } from "@/models/types/recipes/review";
import RecipePanelSteps from "./panels/recipe-panel-steps";
import RecipePanelExtras from "./panels/recipe-panel-extras";
import RecipePanelIngredients from "./panels/recipe-panel-ingredients";
import RecipePanelInfo from "./panels/recipe-panel-info";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import RecipePanelFinalize from "./panels/recipe-panel-finalize";
import { BiCheck, BiTrash } from "react-icons/bi";
import { useWindowSizes } from "@/context/width-height-store";
import { UploadedRecipeImage } from "@/components/buttons/uploadThing-button";


export default function RecipeForm({
        attemptedToCreate,
        recipeForm,
        formType,
        handleCancel,
        handleEdit,
        handleCreate,
        ingredientNames,
        handleDelete,
        isFavorited,
        favoriteRecipe,
        isSaving,
        handleImageUpload,
}: {
        attemptedToCreate: boolean,
        recipeForm: RecipeFormType,
        formType: 'view' | 'edit' | 'create' | '',
        handleCancel: () => void,
        handleEdit: () => void,
        handleCreate: () => void,
        ingredientNames: IIngredient[],
        handleDelete: () => void,
        isFavorited: boolean,
        favoriteRecipe: () => void,
        isSaving: boolean,
        handleImageUpload: (file: UploadedRecipeImage) => void,
}) {

        const { width } = useWindowSizes()

        const saveLabel = formType === 'edit' ? 'Save recipe' : 'Create recipe';
        const statusLabel = isSaving ? 'Saving...' : recipeForm.isDirty() ? 'Unsaved changes' : 'Ready';
        const sectionLinks = [
                { id: 'recipe-basics', label: 'Basics' },
                { id: 'recipe-ingredients', label: 'Ingredients' },
                { id: 'recipe-steps', label: 'Instructions' },
                { id: 'recipe-extras', label: 'Sharing' },
                { id: 'recipe-review', label: 'Review' },
        ];

        const handleSave = () => {
                if (formType === 'edit') {
                        handleEdit();
                } else {
                        handleCreate();
                }
        };

        const jumpToSection = (id: string) => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        return (
                <form className="flex min-h-dvh w-full flex-col bg-mainBack text-mainText" onSubmit={(event) => {
                        event.preventDefault();
                        handleSave();
                }}>
                        <div className="sticky top-0 z-20 border-b border-accent/20 bg-mainBack/95 px-4 py-3 backdrop-blur sm:px-6">
                                <div className="flex flex-row items-end justify-between gap-3">
                                        {width < 640 && formType === 'edit' ? (
                                                <button type="button" onClick={favoriteRecipe} className={`${isFavorited ? "text-red-500" : "text-gray-500"} rounded-md p-2 hover:bg-accent/10`} title={isFavorited ? "Remove from favorites" : "Add to favorites"} aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                                                        {isFavorited ? <IoHeart size={22} aria-hidden="true" /> : <IoHeartOutline size={22} aria-hidden="true" />}
                                                </button>
                                        ) : null}
                                        <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                                                        {formType === 'edit' ? 'Edit recipe' : 'New recipe'}
                                                </p>
                                                <TextInput
                                                        id="modalRecipeName"
                                                        name="modalRecipeName"
                                                        placeholder="Recipe name"
                                                        variant="default"
                                                        key={recipeForm.key('name')}
                                                        {...recipeForm.getInputProps('name')}
                                                        error={recipeForm.errors.name}
                                                        classNames={{
                                                                input: 'text-2xl font-semibold text-mainText placeholder:text-mainText/40 sm:text-3xl',
                                                                error: 'mt-1',
                                                        }}
                                                />
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                                {width >= 640 && formType === 'edit' ? (
                                                        <button type="button" onClick={favoriteRecipe} className={`${isFavorited ? "text-red-500" : "text-gray-500"} rounded-md p-2 hover:bg-accent/10`} title={isFavorited ? "Remove from favorites" : "Add to favorites"} aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                                                                {isFavorited ? <IoHeart size={22} aria-hidden="true" /> : <IoHeartOutline size={22} aria-hidden="true" />}
                                                        </button>
                                                ) : null}
                                                {width > 640 && <Button type="submit" leftSection={<BiCheck />} loading={isSaving} className="hidden sm:flex">
                                                        {saveLabel}
                                                </Button>}
                                                <CloseButton onClick={handleCancel} title="Close Recipe Form" size="lg" iconSize={24} />
                                        </div>
                                </div>
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                        {sectionLinks.map((section) => (
                                                <button
                                                        key={section.id}
                                                        type="button"
                                                        onClick={() => jumpToSection(section.id)}
                                                        className="max-w-[8.5rem] shrink-0 truncate rounded-full border border-accent/20 bg-cardBack px-3 py-1.5 text-sm text-mainText shadow-sm transition hover:border-accent/50 hover:bg-altBack"
                                                        title={section.label}
                                                >
                                                        {section.label}
                                                </button>
                                        ))}
                                </div>
                                <p className="mt-2 text-xs text-mainText/60">{statusLabel}</p>
                        </div>

                        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-5 pb-24 sm:px-6">
                                <section id="recipe-basics" aria-label="Recipe basics" className="scroll-mt-32 rounded-md border border-accent/20 bg-cardBack p-4 shadow-sm sm:p-5">
                                        <RecipePanelInfo recipeForm={recipeForm} onImageUpload={handleImageUpload} />
                                </section>
                                <section id="recipe-ingredients" aria-label="Recipe ingredients" className="scroll-mt-32 rounded-md border border-accent/20 bg-cardBack p-4 shadow-sm sm:p-5">
                                        <RecipePanelIngredients recipeForm={recipeForm} ingredientNames={ingredientNames} />
                                </section>
                                <section id="recipe-steps" aria-label="Recipe instructions" className="scroll-mt-32 rounded-md border border-accent/20 bg-cardBack p-4 shadow-sm sm:p-5">
                                        <RecipePanelSteps recipeForm={recipeForm} />
                                </section>
                                <section id="recipe-extras" aria-label="Recipe sharing options" className="scroll-mt-32 rounded-md border border-accent/20 bg-cardBack p-4 shadow-sm sm:p-5">
                                        <RecipePanelExtras recipeForm={recipeForm} />
                                </section>
                                <section id="recipe-review" aria-label="Recipe review" className="scroll-mt-32 rounded-md border border-accent/20 bg-cardBack p-4 shadow-sm sm:p-5">
                                        <RecipePanelFinalize recipeForm={recipeForm} handleCreate={handleCreate} handleEdit={handleEdit} formType={formType} attemptedToCreate={attemptedToCreate} handleDelete={handleDelete} />
                                </section>
                        </div>

                        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-accent/20 bg-cardBack/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden">
                                <div className="mx-auto flex max-w-4xl items-center gap-2">
                                        {formType === 'edit' && (
                                                <Button type="button" variant="light" color="red" leftSection={<BiTrash />} onClick={handleDelete} className="shrink-0">
                                                        Delete
                                                </Button>
                                        )}
                                        <Button type="submit" leftSection={<BiCheck />} loading={isSaving} fullWidth>
                                                {saveLabel}
                                        </Button>
                                </div>
                        </div>
                </form>
        )
}


//                         {formType === 'view' && <Tabs.Panel value="reviews" w={'100%'}>
//                                 <RecipePanelReviews recipeForm={recipeForm} />
//                         </Tabs.Panel>}
