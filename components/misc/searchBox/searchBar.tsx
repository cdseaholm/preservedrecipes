'use client'

import { JSX } from "react"

export default function SearchBarAndMenu({ handleSearch, searchString, index, leftSection }: { handleSearch: (input: React.ChangeEvent<HTMLInputElement>, index: number) => void, searchString: string, index: number, leftSection: JSX.Element | null }) {
    return (
        <div className={`flex flex-row items-center w-full ${leftSection ? 'justify-between space-x-2' : 'justify-start'} border-b border-highlight/50 py-1 px-2`}>
            {leftSection}
            <input type="text" onChange={(e) => handleSearch(e, index)} className="flex flex-row w-full p-2 text-sm lg:text-base inset-shadow-sm rounded-md" placeholder={searchString} />
        </div>
    )
}