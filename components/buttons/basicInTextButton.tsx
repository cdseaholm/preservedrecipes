export default function InTextButton({ buttonText, action, ariaLabel }: { buttonText: string, action: () => void, ariaLabel: string }) {
    return (
        <button type='button' className="text-blue-700 hover:text-blue-300 hover:underline cursor-pointer" aria-label={ariaLabel} onClick={action}>
            {buttonText}
        </button>
    )
}