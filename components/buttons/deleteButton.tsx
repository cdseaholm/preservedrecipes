export default function DeleteButton({ icon, label, onClick, extraCss }: { icon: React.ReactNode, label: string, onClick: () => void, extraCss?: string }) {
    return (
        <button type="button" className={`${extraCss ?? ''} flex h-9 w-content cursor-pointer flex-row items-center justify-evenly gap-1 rounded-md border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100 sm:text-base`} onClick={onClick} aria-label={label}>
            {icon}
            <p>{label}</p>
        </button>

    )
}
