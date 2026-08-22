'use client'

import Link from "next/link"
import { FaRegCopyright } from "react-icons/fa"

export default function RightsFooter({ footerButtonText }: { footerButtonText: string }) {
    return (
        <div className="flex flex-col justify-center items-center pt-10 w-full h-content">
            <div className="flex flex-row justify-center items-center text-[12px] w-full space-x-4">
                <Link href={'terms-of-service'} className={footerButtonText} aria-label="Terms of Service">Terms Of Service</Link>
                <Link href={'privacy-policy'} className={footerButtonText} aria-label="Privacy Policy">Privacy Policy</Link>
            </div>
            <div className="flex flex-row justify-center items-center text-[12px] w-full space-x-4">
                All rights reserved
                <span className="px-2">
                    <FaRegCopyright />
                </span>
                getrecipesafe.com
            </div>
            <div className="text-[10px] opacity-75">
                v0.48.02
            </div>
        </div>
    )
}
