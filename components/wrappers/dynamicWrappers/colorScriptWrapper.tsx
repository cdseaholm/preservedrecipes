'use client'

import dynamic from "next/dynamic"

const ColorSchemeScript = dynamic(() => import("@mantine/core").then((mod) => mod.ColorSchemeScript), {
    ssr: false
});

export default function ColorScriptWrapper() {
    return <ColorSchemeScript />
}