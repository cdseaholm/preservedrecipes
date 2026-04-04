export function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-900"></div>
        </div>
    );
}