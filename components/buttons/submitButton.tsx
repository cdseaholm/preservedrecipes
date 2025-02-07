export default function SubmitButton({ buttonTitle }: { buttonTitle: string }) {
    return (
        <button type='submit' className="border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 w-1/5 text-xs sm:text-sm" aria-label={buttonTitle}>
            {buttonTitle}
        </button>
    )
}