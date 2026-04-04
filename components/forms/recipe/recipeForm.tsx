'use client'

import { CloseButton, Tabs } from "@mantine/core";
import { RecipeFormType } from "@/models/types/recipes/review";
import RecipePanelSteps from "./panels/recipe-panel-steps";
import RecipePanelExtras from "./panels/recipe-panel-extras";
import RecipePanelReviews from "./panels/recipe-panel-reviews";
import RecipePanelIngredients from "./panels/recipe-panel-ingredients";
import RecipePanelInfo from "./panels/recipe-panel-info";
import { IIngredient } from "@/models/types/recipes/ingredient";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import RecipePanelFinalize from "./panels/recipe-panel-finalize";


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
}) {

        return (
                <Tabs defaultValue="info" w={'100%'} className="flex flex-col justify-start items-center w-full h-full overflow-y-auto no-scrollbar p-4 rounded-md">
                        <div className="w-full flex flex-row justify-between items-center mb-4">
                                <div className="flex flex-row items-center justify-start gap-2">
                                        <h2 className="text-lg font-semibold">{formType === 'edit' ? 'Edit Recipe' : 'Create Recipe'}</h2>
                                        {formType === 'view' || formType === 'edit' ? <button type="button" onClick={favoriteRecipe} className={`${isFavorited ? "text-red-500" : "text-gray-500"} cursor-pointer`} title={isFavorited ? "Remove from favorites" : "Add to favorites"}>{isFavorited ? <IoHeart size={22}/> : <IoHeartOutline size={22}/>}</button> : null}
                                </div>
                                <CloseButton onClick={handleCancel} title="Close Recipe Form" size="lg" iconSize={24} />
                        </div>
                        <Tabs.List>
                                <Tabs.Tab value="info">Basic Info</Tabs.Tab>
                                <Tabs.Tab value="ingredients">Ingredients</Tabs.Tab>
                                <Tabs.Tab value="instructions">Instructions</Tabs.Tab>
                                <Tabs.Tab value="extras">Extras</Tabs.Tab>
                                {formType !== 'view' && <Tabs.Tab value="finalize">{`Finalize and ${formType === 'edit' ? 'Save' : 'Create'}`}</Tabs.Tab>}
                                {formType === 'view' && <Tabs.Tab value="reviews">Reviews</Tabs.Tab>}
                        </Tabs.List>
                        <Tabs.Panel value="info" w={'100%'}>
                                <RecipePanelInfo recipeForm={recipeForm} />
                        </Tabs.Panel>
                        <Tabs.Panel value="ingredients" w={'100%'}>
                                <RecipePanelIngredients recipeForm={recipeForm} ingredientNames={ingredientNames}/>
                        </Tabs.Panel>
                        <Tabs.Panel value="instructions" w={'100%'}>
                                <RecipePanelSteps recipeForm={recipeForm} />
                        </Tabs.Panel>
                        <Tabs.Panel value="extras" w={'100%'}>
                                <RecipePanelExtras recipeForm={recipeForm} />
                        </Tabs.Panel>
                        {formType !== 'view' && <Tabs.Panel value="finalize" w={'100%'}>
                                <RecipePanelFinalize recipeForm={recipeForm} handleCreate={handleCreate} handleEdit={handleEdit} formType={formType} attemptedToCreate={attemptedToCreate} handleDelete={handleDelete} />
                        </Tabs.Panel>}
                        {formType === 'view' && <Tabs.Panel value="reviews" w={'100%'}>
                                <RecipePanelReviews recipeForm={recipeForm} />
                        </Tabs.Panel>}
                </Tabs>
        )
}