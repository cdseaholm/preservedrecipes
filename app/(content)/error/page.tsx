'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ErrorPage() {

    const router = useRouter();

    useEffect(() => {
        router.replace('/')
    }, [router]);

    return (
        <section className="flex flex-col justify-start items-center w-full h-full gap-5 pt-10">
            Error here
        </section>
    )
}