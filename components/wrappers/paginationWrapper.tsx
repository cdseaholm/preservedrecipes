import PaginationComp from "@/components/nav/pagination";

export default function PaginationWrapper({ currentPage, numberOfPages, children }: { currentPage: number, numberOfPages: number, children: React.ReactNode }) {
    return (
        <div className="flex flex-col w-full min-h-screen items-center justify-between p-2">
            <div className="w-full h-full flex flex-col justify-start items-center py-1 px-5">
                {children}
            </div>
            <div className="w-full flex justify-center mt-4">
                <PaginationComp currentPage={currentPage} totalPages={numberOfPages} />
            </div>
        </div>
    )
}