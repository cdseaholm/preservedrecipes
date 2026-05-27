'use client'

import { BasicButtonClass } from "@/models/types/misc/basic-button-class"

export default function CreateButton({ onClick, icon, additionString }: { onClick: () => void, icon: React.ReactNode, additionString: string }) {
    return (
        <button type="button" onClick={onClick} className={BasicButtonClass} aria-label={additionString}>
            <span aria-hidden="true">{icon}</span>
            {additionString}
        </button>
    )
}
