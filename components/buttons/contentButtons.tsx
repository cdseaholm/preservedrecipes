export default function ContentButtons({content, onClick, extraProps}: {content: string, onClick: () => void, extraProps: string}) {
    return (
        <button className={`
            ${extraProps}
            text-sm md:w-3/4 lg:w-2/3 lg:text-lg xl:w-1/2 2xl:w-2/5 p-3
            rounded-lg
            hover:bg-opacity-70
            hover:scale-105
            transition-all 
            duration-300
            shadow-md
            text-white 
            font-medium
            tracking-wide
            hover:shadow-lg
            bg-highlight
            border
            border-accent
        `} onClick={onClick}>
            {content}
        </button>
    )
}