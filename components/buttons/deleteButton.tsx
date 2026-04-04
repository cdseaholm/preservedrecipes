export default function DeleteButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button type="button" className={`h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-red-100 hover:text-red-600 text-red-500 rounded-md text-sm sm:text-base space-x-1 cursor-pointer`} onClick={onClick} aria-label={label}>
            {icon}
            <p>{label}</p>
        </button>

    )
}