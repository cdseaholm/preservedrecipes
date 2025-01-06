'use client'

import Link from "next/link";

export default function LinkTextButton({ link, content }: { link: string, content: string }) {
    return (
        <Link href={link} className="text-md lg:text-base text-blue-500 hover:bg-gray-100 hover:text-blue-300 mb-2 p-2 rounded-md">
            {content}
        </Link>
    )
}