'use client'

import dynamic from "next/dynamic"

const RouterTransition = dynamic(() => import('@/components/misc/routerTransition'), { ssr: false })

export default function RouterTransitionWrapper() {
    return <RouterTransition />
}