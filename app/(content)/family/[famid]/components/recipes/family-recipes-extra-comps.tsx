'use client'

import DeleteButton from "@/components/buttons/deleteButton"
import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import CardTemplate from "@/components/templates/card-template"
import { IUser } from "@/models/types/personal/user"
import { IRecipe } from "@/models/types/recipes/recipe"
import { Checkbox } from "@mantine/core"
import { FaRegTrashAlt } from "react-icons/fa"

export function FamilyRecipesCheckboxes({ checkedRecipes, filteredAndSorted, checkAll, handleBulkRemoveFromFamily }: { checkedRecipes: Set<string>, filteredAndSorted: any[], checkAll: () => void, handleBulkRemoveFromFamily: () => void }) {
    return (
        <div className="flex flex-row justify-between items-center w-full px-4 py-6">
            <Checkbox
                checked={checkedRecipes.size === filteredAndSorted.length && filteredAndSorted.length > 0}
                className="cursor-pointer w-content"
                aria-label="Select all recipes checkbox"
                label="Select All"
                onClick={checkAll}
            />
            <DeleteButton
                icon={<FaRegTrashAlt />}
                label={`Remove ${checkedRecipes.size}`}
                onClick={handleBulkRemoveFromFamily}
            />
        </div>
    )
}

export function FamilyRecipeInSearchItems({ recipe, index, toggleChecked, checkedRecipes, edit, handleOpenRecipeModal, userInfo }: { recipe: IRecipe, index: number, toggleChecked: (id: string) => void, checkedRecipes: Set<string>, edit: boolean, handleOpenRecipeModal: (recipe: IRecipe | null, userInfo: IUser | null, from: "personal" | "family" | "community" | "post" | null) => Promise<void>, userInfo: IUser }) {
    return (
        <InSearchItemButton
            key={recipe._id}
            item={recipe.name}
            handleChecked={() => toggleChecked(recipe._id)}
            edit={edit}
            checked={checkedRecipes.has(recipe._id)}
            handleSeeItem={() => handleOpenRecipeModal(recipe, userInfo, 'family')}
        >
            <CardTemplate
                recipeProps={recipe}
                communityProps={null}
                index={index}
                userInfo={userInfo}
            />
        </InSearchItemButton>
    )
}