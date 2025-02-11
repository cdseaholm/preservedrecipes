'use client'

import dynamic from "next/dynamic"

const MainFooter = dynamic(() => import("@/components/nav/footer"), {
    ssr: false
});

export default function FooterWrapper() {
    return <MainFooter />
}