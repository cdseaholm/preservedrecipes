'use client'

import dynamic from "next/dynamic"

const MainHeader = dynamic(() => import("@/components/nav/header/appHeader"), {
    ssr: false
});

export default function HeaderWrapper() {
    return <MainHeader />
}