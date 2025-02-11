'use client'

import dynamic from "next/dynamic"

const MantineProvider = dynamic(() => import("@mantine/core").then((mod) => mod.MantineProvider), {
    ssr: false
});

export default function MantineWrapper({ children }: { children: React.ReactNode }) {
    return <MantineProvider>{children}</MantineProvider>
}