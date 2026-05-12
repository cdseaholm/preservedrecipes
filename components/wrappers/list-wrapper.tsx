'use client'

import PaginationComp from "../nav/pagination"

export default function ListWrapper({ children, searchBar, numberOfPages, isPending, currentPage, editButtons, onPageChange }: { children: React.ReactNode, searchBar: React.ReactNode | null, numberOfPages: number, isPending: boolean, currentPage: number, editButtons: React.ReactNode | null, onPageChange?: (page: number) => void }) {
    return (
        <div className="flex w-full min-h-[60dvh] flex-col items-start justify-start sm:min-h-[75dvh]">
            {searchBar}
            {editButtons}
            <div className="flex w-full flex-1 flex-col items-center justify-start gap-2 rounded-none bg-transparent p-0 shadow-none sm:rounded-md sm:bg-cardBack sm:p-2 sm:shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)]">
                {children}
            </div>
            {numberOfPages > 1 && !isPending ? (
                <div className="flex w-full justify-center py-2">
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
