export default function InTextButton({ buttonText, action, ariaLabel }: { buttonText: string, action: () => void, ariaLabel: string }) {

    //text-blue-700 hover:text-blue-300

    return (
        <button type='button' className="text-accent hover:text-[#d94f33] underline cursor-pointer" aria-label={ariaLabel} onClick={action}>
            {buttonText}
        </button>
    )
}