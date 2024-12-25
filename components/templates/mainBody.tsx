'use client'

import { useStateStore } from "@/context/stateStore"
import ColorPickerMode from "../misc/colorpicker/colorPickerMode"

export default function MainBody({ children }: { children: React.ReactNode }) {
    const colorPickerMode = useStateStore(state => state.colorPickerMode);

    return (
        colorPickerMode ? (
            <ColorPickerMode />
        ) : (
            <div className="h-screen w-screen overflow-hidden bg-mainBack">
                {children}
            </div>
        )
    )
}