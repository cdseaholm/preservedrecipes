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
<<<<<<< Updated upstream
            className={`mx-auto flex w-full min-w-[300px] max-w-6xl flex-col items-center justify-start gap-3 sm:gap-5 ${paddingNeeded ? 'px-2 pb-4 pt-5 sm:px-5 sm:pb-8 sm:pt-8' : ''}`}
=======
            className={`flex flex-col justify-start items-center gap-4 w-full min-w-0 max-w-full min-h-[80dvh] ${paddingNeeded ? 'px-3 pb-4 pt-8 sm:px-5' : ''}`}
>>>>>>> Stashed changes
        >
            {children}
        </div>
    )

    return toRender;
}
