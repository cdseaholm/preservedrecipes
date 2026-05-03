'use client'

import React from "react"

type ContentWrapperProps = {
    children: React.ReactNode;
    containedChild: boolean;
    paddingNeeded: boolean;
};

export default function ContentWrapper({ children, paddingNeeded }: ContentWrapperProps) {

    const toRender = (
        <div 
            className={`flex flex-col justify-start items-center gap-4 w-full min-w-[300px] min-h-[80dvh] ${paddingNeeded ? 'px-3 pb-4 pt-8 sm:px-5' : ''}`}
        >
            {children}
        </div>
    )

    return toRender;
}
