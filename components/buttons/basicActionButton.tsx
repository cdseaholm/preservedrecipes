export default function ActionButton({ buttonTitle, action }: { buttonTitle: string, action: () => void }) {
    return (
        <button type='button' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5 text-xs sm:text-sm cursor-pointer" aria-label={buttonTitle} onClick={action}>
            {buttonTitle}
        </button>
    )
}