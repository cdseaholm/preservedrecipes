'use client'

import DeleteButton from "@/components/buttons/deleteButton"
import { Checkbox } from "@mantine/core"
import { FaRegTrashAlt } from "react-icons/fa"

export function FamilyRecipesCheckboxes({ checkedRecipes, filteredAndSorted, checkAll, handleBulkRemoveFromFamily }: { checkedRecipes: Set<string>, filteredAndSorted: any[], checkAll: () => void, handleBulkRemoveFromFamily: () => void }) {
    return (
        <div className="flex w-full flex-row items-center justify-between rounded-md border border-accent/10 bg-mainBack/45 px-3 py-2">
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
