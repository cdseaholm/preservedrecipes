'use client'

import { BasicButtonClass, BasicButtonDisabledClass } from "@/models/types/misc/basic-button-class"

export default function EditButton({ onClick, icon, label, optionsLength }: { onClick: () => void, icon: React.ReactNode, label: string, optionsLength: number }) {
    return (
        <button type="button" onClick={onClick} className={optionsLength > 0 ? BasicButtonClass : BasicButtonDisabledClass} disabled={optionsLength > 0 ? false : true} aria-label="Toggle Edit">
            {icon}
            <p>{label}</p>
        </button>
    )
}