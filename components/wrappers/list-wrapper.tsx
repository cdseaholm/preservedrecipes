'use client'

import PaginationComp from "../nav/pagination"

export default function ListWrapper({ children, searchBar, numberOfPages, isPending, currentPage, editButtons, onPageChange }: { children: React.ReactNode, searchBar: React.ReactNode | null, numberOfPages: number, isPending: boolean, currentPage: number, editButtons: React.ReactNode | null, onPageChange?: (page: number) => void }) {
    return (
        <div className="flex w-full min-h-[58dvh] flex-col items-start justify-start gap-3 sm:min-h-[70dvh]">
            {searchBar}
            {editButtons}
            <div className="flex w-full flex-1 flex-col items-center justify-start gap-2 rounded-md border border-accent/10 bg-mainBack/35 p-1.5 shadow-[inset_0_1px_10px_rgba(90,57,36,0.08)] sm:p-2.5">
                {children}
            </div>
            {numberOfPages > 1 && !isPending ? (
                <div className="flex w-full justify-center pb-1 pt-2">
                    <PaginationComp currentPage={currentPage} totalPages={numberOfPages} onChange={onPageChange} />
                </div>
            ) : isPending ? (
                <div className="px-1 text-sm text-mainText/60">Searching...</div>
            ) : (
                null
            )}
        </div>
    )
}
