'use client'

import PaginationComp from "../nav/pagination"

export default function ListWrapper({ children, searchBar, numberOfPages, isPending, currentPage, editButtons, onPageChange }: { children: React.ReactNode, searchBar: React.ReactNode | null, numberOfPages: number, isPending: boolean, currentPage: number, editButtons: React.ReactNode | null, onPageChange?: (page: number) => void }) {
    return (
        <div className="flex flex-col justify-start items-start w-full min-h-[75dvh] bg-cardBack border border-accent/30 rounded-md shadow-md p-6 sm:p-8 gap-4">
            {searchBar}
            {editButtons}
            <div className="w-full flex-1 p-2 flex flex-col justify-start items-center gap-2 rounded-md shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)]">
                {children}
            </div>
            {numberOfPages > 1 && !isPending ? (
                <div className="w-full flex justify-center">
                    <PaginationComp currentPage={currentPage} totalPages={numberOfPages} onChange={onPageChange} />
                </div>
            ) : isPending ? (
                <div className="text-sm text-gray-500">Searching...</div>
            ) : (
                null
            )}
        </div>
    )
}
