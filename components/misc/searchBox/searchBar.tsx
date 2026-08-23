'use client'

import { JSX } from "react"

export default function SearchBarAndMenu({ handleSearch, searchString, index, leftSection }: { handleSearch: (input: React.ChangeEvent<HTMLInputElement>, index: number) => void, searchString: string, index: number, leftSection: JSX.Element | null }) {
    const inputId = `search-input-${index}`;
    const label = searchString?.trim() || 'Search';

    return (
        <div className={`flex w-full ${leftSection ? 'flex-col items-stretch justify-start gap-2 sm:flex-row sm:items-center sm:justify-between' : 'flex-row items-center justify-start'} rounded-md border border-accent/10 bg-[var(--surfaceWash)] p-2 shadow-[var(--tightShadow)]`}>
            {leftSection && (
                <div className="flex w-full shrink-0 items-center justify-start sm:w-auto">
                    {leftSection}
                </div>
            )}
            <label htmlFor={inputId} className="sr-only">{label}</label>
            <input
                id={inputId}
                name={inputId}
                type="search"
                onChange={(e) => handleSearch(e, index)}
                className="flex h-11 w-full flex-row rounded-md border border-accent/20 bg-cardBack/90 px-3 py-2 text-base text-mainText shadow-inner outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder={searchString}
                aria-label={label}
            />
        </div>
    )
}
