export default function CancelButton({handleCancel}: {handleCancel: () => void}) {
    return (
        <button type="button" onClick={handleCancel} className="border border-neutral-200 rounded-md hover:bg-neutral-200 p-2 w-1/5 text-xs sm:text-sm" aria-label="Cancel">
            Cancel
        </button>
    )
}