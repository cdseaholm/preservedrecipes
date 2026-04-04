'use client'

import { useWindowSizes } from "@/context/width-height-store";
import React from "react"

export default function ContentWrapper({ children, containedChild, paddingNeeded }: { children: React.ReactNode, containedChild: boolean, paddingNeeded: boolean }) {

    const { width, height } = useWindowSizes();
    const widthToUse = width <= 300 ? 'w-[300px]' : 'w-full';
    const heightToUse = containedChild ? (height < 700 ? 'h-[600px]' : `h-[80dvh]`) : 'h-content';

    const toRender = (
        <div className={`flex flex-col justify-start items-center ${widthToUse} ${heightToUse} ${paddingNeeded ? 'px-3 pb-4 pt-2 sm:px-5' : ''}`}>
            {children}
        </div>
    )

    return toRender;
}