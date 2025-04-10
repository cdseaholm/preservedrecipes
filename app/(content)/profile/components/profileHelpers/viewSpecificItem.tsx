'use client'

import ViewRecipeInit from "@/components/forms/recipe/viewRecipe/editRecipeInit"
import { LoadingSpinner } from "@/components/misc/loadingSpinner"
import { ICommunity } from "@/models/types/community"
import { IFamilyMember } from "@/models/types/familyMember"
import { IRecipe } from "@/models/types/recipe"
import { ISuggestion } from "@/models/types/suggestion"
import { useEffect, useState } from "react"

export default function ViewSpecificItem({ item, parent, handleSeeItem }: { item: IRecipe | IFamilyMember | ICommunity | ISuggestion, parent: string, handleSeeItem: (index: number) => void }) {

    const [suggestionToUse, setSuggestionToUse] = useState<ISuggestion | null>(null);
    const [recipeToUse, setRecipeToUse] = useState<IRecipe | null>(null)
    const [communityToUse, setCommunityToUse] = useState<ICommunity | null>(null)

    useEffect(() => {
        if (parent === 'suggestions') {
            const newItem = item as ISuggestion;
            setSuggestionToUse(newItem);
        } else if (parent === 'recipe') {
            const newItem = item as IRecipe;
            setRecipeToUse(newItem);
        } else if (parent === 'community') {
            const newItem = item as ICommunity;
            setCommunityToUse(newItem);
        }
    }, [parent, item])

    return (
        parent === 'recipe' && recipeToUse !== null ? (
            <ViewRecipeInit currentRecipe={recipeToUse} handleSeeItem={handleSeeItem} />
        ) : parent === 'suggestion' && suggestionToUse !== null ? (
            <p>{suggestionToUse.suggestorName}</p>
        ) : parent === 'community' && communityToUse !== null ? (
            <p>{communityToUse.name}</p>
        ) : (
            <LoadingSpinner screen={true} />
        )
    )
}