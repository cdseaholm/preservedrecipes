import { LoadingSpinner } from "@/components/misc/loadingSpinner";

export default function LoadingModal({ open }: { open: boolean }) {
    return (
        <div id="crud-modal" tabIndex={-1} aria-hidden={open ? "false" : "true"} className={`${open ? 'flex' : 'hidden'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full inset-0 h-full max-h-full backdrop-blur-xs`}>
            <div className={`relative p-4 w-full max-w-md max-h-full`}>
                <div className={`relative bg-white rounded-lg shadow-sm dark:bg-gray-700`}>
                    <main style={{ minWidth: '30vw', minHeight: '30vh' }} className="flex flex-col justify-center items-center">
                        <LoadingSpinner screen={false} />
                    </main>
                </div>
            </div>
        </div>
    )
}