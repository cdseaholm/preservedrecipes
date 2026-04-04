'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper";
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ErrorPage() {

    const router = useRouter();

    useEffect(() => {
        router.replace('/')
    }, [router]);

    return (
        <ContentWrapper containedChild={false} paddingNeeded={false}>
            Error here
        </ContentWrapper>
    )
}