'use client'

import DeleteButton from "@/components/buttons/deleteButton"
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