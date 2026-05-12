'use client'

import { JSX } from "react"

export default function SearchBarAndMenu({ handleSearch, searchString, index, leftSection }: { handleSearch: (input: React.ChangeEvent<HTMLInputElement>, index: number) => void, searchString: string, index: number, leftSection: JSX.Element | null }) {
    return (
        <div className={`flex w-full ${leftSection ? 'flex-col items-stretch justify-start gap-2 sm:flex-row sm:items-center sm:justify-between' : 'flex-row items-center justify-start'} py-1 px-0 sm:px-2 h-content`}>
            {leftSection && (
                <div className="flex shrink-0 items-center justify-start w-content">
                    {leftSection}
                </div>
            )}
            <input type="text" onChange={(e) => handleSearch(e, index)} className="flex h-[40px] w-full flex-row rounded-md border border-accent/20 p-2 text-sm inset-shadow-sm lg:text-base" placeholder={searchString} />
        </div>
    )
}
