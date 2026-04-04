'use client'

import { ScrollArea } from "@mantine/core"
import PaginationComp from "../nav/pagination"

export default function ListWrapper({ children, searchBar, numberOfPages, isPending, currentPage, editButtons }: { children: React.ReactNode, searchBar: React.ReactNode | null, numberOfPages: number, isPending: boolean, currentPage: number, editButtons: React.ReactNode | null }) {
    return (
        <div className="flex flex-col justify-start items-start w-[100%] h-full bg-cardBack border border-accent/30 rounded-md">
            {searchBar}
            {editButtons}
            <ScrollArea w={'100%'} scrollbarSize={10} className="h-full z-3 shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)] overflow-x-hidden flex flex-col justify-start items-center rounded-b-md" scrollbars='y' p={'sm'}>
                {children}
            </ScrollArea>
            {numberOfPages > 1 && !isPending ? (
                <div className="w-full flex justify-center mt-4">
                    <PaginationComp currentPage={currentPage} totalPages={numberOfPages} />
                </div>
            ) : isPending ? (
                <div className="text-sm text-gray-500 mt-2">Searching...</div>
            ) : (
                null
            )}
        </div>
    )
}