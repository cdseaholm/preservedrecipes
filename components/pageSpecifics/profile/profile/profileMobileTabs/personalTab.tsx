'use client'

import ProfileSearchAndAdd from "@/components/misc/searchBox/profileSearchAndAdd"
import { ChangeEvent, JSX } from "react"

export default function PersonalTabs({ options, communityOptions, handleCreate, handleRecipeSearch, handleCommunitySearch }: { options: JSX.Element[], communityOptions: JSX.Element[], handleCreate: (which: string, open: boolean) => void, handleRecipeSearch: (e: ChangeEvent<HTMLInputElement>) => void, handleCommunitySearch: (e: ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <div className="flex flex-col justify-start items-center gap-4 bg-mainContent h-full w-full p-5 rounded-b-md">
            <ProfileSearchAndAdd type="recipe" options={options} handleCreate={handleCreate} handleSearch={handleRecipeSearch} mobile={true}/>
            <ProfileSearchAndAdd type="community" options={communityOptions} handleCreate={handleCreate} handleSearch={handleCommunitySearch} mobile={true}/>
        </div>
    )
}