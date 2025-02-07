'use client'

import { ICommunity } from "@/models/types/community"
import { IFamilyMember } from "@/models/types/familyMember"
import { IRecipe } from "@/models/types/recipe"
import { ISuggestion } from "@/models/types/suggestion"
import { useEffect, useState } from "react"
import { BiLeftArrow } from "react-icons/bi"

export default function ViewSpecificItem({ item, parent, handleSeeItem }: { item: IRecipe | IFamilyMember | ICommunity | ISuggestion, parent: string, handleSeeItem: (index: number) => void }) {

    const [itemToUse, setItemToUse] = useState<IRecipe | IFamilyMember | ICommunity | ISuggestion | null>(null);
    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        if (parent === 'suggestions') {
            const newItem = item as ISuggestion;
            setItemToUse(newItem);
            setTitle(newItem.suggestionTitle);
        }
    }, [parent, item])

    return (

        <div className="flex flex-col justify-start items-center w-full h-content p-2">
            <div className={`flex flex-row justify-between items-center sm:space-x-4 w-full h-fit p-2`}>
                <button onClick={() => handleSeeItem(-1)} aria-label="Back">
                    <BiLeftArrow />
                    Back
                </button>
                <p>{title}</p>
            </div>
            {itemToUse ? (
                parent === 'suggestions' ? (
                    <p>{'Suggestion'}</p>
                ) : (
                    <p>No type</p>
                )
            ) : (
                <p>Error with item</p>
            )}
        </div>

    )
}