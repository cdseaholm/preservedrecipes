export default function ContentButtons({ content, onClick, extraProps }: { content: string, onClick: () => void, extraProps: string }) {
    return (
        <button className={`${extraProps} p-3 rounded-lg hover:bg-mainText hover:scale-105 transition-all duration-300 shadow-md text-lightText font-medium tracking-wide hover:shadow-lg bg-highlight border border-accent text-md md:text-lg lg:text-xl`} onClick={onClick} aria-label={content}>
            {content}
        </button>
    )
}