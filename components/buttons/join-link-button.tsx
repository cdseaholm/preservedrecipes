'use client'

import { BasicButtonClass } from "@/models/types/misc/basic-button-class"
import Link from "next/link"

export default function JoinLinkButton({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {

    return (
        <Link href={href} className={BasicButtonClass}>
            {icon}
            {label}
        </Link>
    )
}