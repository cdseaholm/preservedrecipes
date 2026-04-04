export default function ActionButton({ buttonTitle, action, width }: { buttonTitle: string, action: () => void, width: string }) {
    return (
        <button 
            type='button' 
            className={`border border-neutral-200 rounded-md hover:bg-blue-200 bg-blue-400 p-2 ${width} text-xs sm:text-sm cursor-pointer`} 
            aria-label={buttonTitle} 
            onClick={(e) => {
                console.log(`ActionButton ${buttonTitle} clicked`);
                e.preventDefault();
                e.stopPropagation();
                action();
            }}
        >
            {buttonTitle}
        </button>
    )
}