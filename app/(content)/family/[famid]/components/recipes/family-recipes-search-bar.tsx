'use client'

import { textClass, buttonClass } from "@/components/buttons/sub-menu-button"
import SearchBarAndMenu from "@/components/misc/searchBox/searchBar"
import SubMenuDrop from "@/components/nav/header/subMenu/sub-menu-drop"
import { IUser } from "@/models/types/personal/user"
import { IRecipe } from "@/models/types/recipes/recipe"
import { BiCheck } from "react-icons/bi"

export default function FamilyRecipesSearchBar({recipeSearch, toggleEdit, edit, toggleChooseRecipe, toggleFilter, toggleSort, handleOpenRecipeModal, userInfo, adminPermission, setRecipeSearch}: {recipeSearch: string, toggleEdit: () => void, edit: boolean, toggleChooseRecipe: () => void, toggleFilter: () => void, toggleSort: () => void, handleOpenRecipeModal: (recipe: IRecipe | null, userInfo: IUser | null, from: "personal" | "family" | "community" | "post" | null) => Promise<void>, userInfo: any, adminPermission: boolean, setRecipeSearch: (search: string) => void}) {
    return (
        <SearchBarAndMenu
            handleSearch={(e) => setRecipeSearch(e.currentTarget.value)}
            searchString={recipeSearch || 'Search your Family Recipes'}
            index={0}
            leftSection={
                edit ? (
                    <button type="button" onClick={toggleEdit} className="flex h-9 w-full flex-row items-center justify-center gap-1 rounded-md border border-accent/15 bg-cardBack px-3 text-sm font-medium text-accent transition hover:bg-accent/10 sm:w-auto sm:text-base" aria-label="Toggle Edit">
                        <BiCheck />
                        <p>{'Done'}</p>
                    </button>
                ) : (
                    <SubMenuDrop subMenu={
                        [
                            { title: 'Create Recipe for Family', onClick: () => handleOpenRecipeModal(null, userInfo, 'family'), textClass: textClass, buttonClass: buttonClass, label: 'recipes' },
                            { title: 'Add Recipe to Family', onClick: () => toggleChooseRecipe(), textClass: textClass, buttonClass: buttonClass, label: 'recipes' },
                            ...(adminPermission ? [{ title: 'Bulk Edit', onClick: toggleEdit, textClass: textClass, buttonClass: buttonClass, label: 'recipes' }] : []),
                            { title: 'Filter', onClick: toggleFilter, textClass: textClass, buttonClass: buttonClass, label: 'view' },
                            { title: 'Sort', onClick: toggleSort, textClass: textClass, buttonClass: buttonClass, label: 'view' },
                        ]
                    } />
                )
            }

        />
    )
}
