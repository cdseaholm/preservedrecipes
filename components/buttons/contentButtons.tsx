export default function ContentButtons({ content, onClick, extraProps }: { content: string, onClick: () => void, extraProps: string }) {
    return (
        <button className={`${extraProps} text-sm lg:text-lg p-3 rounded-lg hover:bg-mainText hover:scale-105 transition-all duration-300 shadow-md text-lightText font-medium tracking-wide hover:shadow-lg bg-highlight border border-accent
        `} onClick={onClick} style={{minHeight: '170'}}>
            {content}
        </button>
    )
}