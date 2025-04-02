'use client'

import { useSession } from "next-auth/react";
import RightsFooter from "./footer/rightsFoot";
import Link from "next/link";
import { toast } from "sonner";

const FooterColumn = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-start items-start pl-12 md:pl-6 space-y-2 w-full h-content">
            {children}
        </div>
    );
}

const footerButtonText = "text-blue-400 hover:text-black hover:underline rounded-md p-1 cursor-pointer";
const footerSectionText = "text-lg font-semibold underline p-1"

export default function MainFooter() {

    const { data: session } = useSession();

    const sections = ['User', 'Product', 'Pages', 'More'];

    const sectionsInfo = [
        (session ? ['Profile', 'Sign out'] : ['Create Account', 'Sign in']),

        (['About', 'Pricing', 'Contact']),

        (['Homepage', 'About', 'For Fun - Color Picker']),

        (['Upcoming Features', 'Terms Of Service', 'Privacy Policy'])
    ];
    //extracting communities for now

    return (
        <footer className="bg-mainBack border-t border-accent w-screen pb-12 min-h-[30vh] flex flex-col justify-start items-start md:items-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
                {sections.map((section, index) => {
                    return (
                        <FooterColumn key={index}>
                            <h3 className={footerSectionText}>
                                {section}
                            </h3>
                            {sectionsInfo[index].map((sectionInfo, sectionIndex) => {
                                if (index === 2 && sectionIndex === 2) {
                                    return (
                                        <Link href={'/color-picker-mode'} className={footerButtonText} key={sectionIndex} aria-label="Color Picker Mode">
                                            {sectionInfo}
                                        </Link>
                                    )
                                } else if (index === 0 && sectionIndex === 1) {
                                    return (
                                        <button onClick={() => toast.info(sectionInfo)} className={footerButtonText} key={sectionIndex} aria-label={sectionInfo}>
                                            {sectionInfo}
                                        </button>
                                    )
                                } else {
                                    const refToUse = index === 3 && sectionIndex === 0 ? 'upcoming' : sectionInfo.toLowerCase().split(' ').join('-');
                                    return (
                                        <Link href={refToUse} className={footerButtonText} key={sectionIndex} aria-label={sectionInfo}>
                                            {sectionInfo}
                                        </Link>
                                    )
                                }
                            })}
                        </FooterColumn>
                    )
                })}
            </div>
            <RightsFooter footerButtonText={footerButtonText} />
        </footer>
    );
}