'use client'

import { useWindowSizes } from "@/context/width-height-store";
import React from "react"

type ContentWrapperProps = {
    children: React.ReactNode;
    containedChild: boolean;
    paddingNeeded: boolean;
};

export default function ContentWrapper({ children, paddingNeeded }: ContentWrapperProps) {

    const { width } = useWindowSizes();
    const widthToUse = width <= 300 ? 'w-[300px]' : 'w-full';

    const toRender = (
        <div 
            className={`flex flex-col justify-start items-center gap-4 ${widthToUse} min-h-[80dvh] ${paddingNeeded ? 'px-3 pb-4 pt-8 sm:px-5' : ''}`}
        >
            {children}
        </div>
    )

    return toRender;
}
