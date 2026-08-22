'use client'

import { useSession } from "next-auth/react";
import RightsFooter from "./rightsFoot";
import Link from "next/link";
import { useFamilyStore } from "@/context/familyStore";

const FooterColumn = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-start items-start pl-12 sm:pl-4 space-y-2 w-full ">
            {children}
        </div>
    );
}

const footerButtonText = "text-footerLink hover:text-accent hover:underline rounded-md p-1 cursor-pointer text-[14px] sm:text-[16px] text-left bg-transparent border-none font-medium";
const footerSectionText = "text-base sm:text-lg font-semibold underline p-1 text-footerText"

export default function MainFooter() {

    const { data: session } = useSession();
    const family = useFamilyStore(state => state.family);
    const familyID = family ? family._id : '';
    const user = session && session.user ? session.user : null;
    const userEmail = user && user.email ? user.email : '';

    const sections = ['User', 'Product', 'Pages', 'More'];

    const sectionsInfo = [
        (userEmail !== '' && familyID !== '' ? ['Profile', 'Family Dashboard', 'Sign out'] : userEmail !== '' && familyID === '' ? ['Profile', 'Create Family', 'Sign out'] : ['Create Account', 'Sign in']),

        (['About', 'Pricing']),

        (['Homepage', 'Contact']),

        (['Terms Of Service', 'Privacy Policy'])
    ];

    const relativeClicks = [
        (userEmail !== '' && familyID !== '' ? (
            [{ ref: '/u/profile', aLabel: 'Profile' }, { ref: `/family/${familyID}`, aLabel: 'Family Dashboard' }, { ref: '/api/auth/signout', aLabel: 'Sign out' }]
        ) : userEmail !== '' && familyID === '' ? (
            [{ ref: '/u/profile', aLabel: 'Profile' }, { ref: '/u/profile', aLabel: 'Create Family' }, { ref: '/api/auth/signout', aLabel: 'Sign out' }]
        ) : (
            [{ ref: '/register', aLabel: 'Create Account' }, { ref: '/api/auth/signin', aLabel: 'Sign in' }]
        )),

        ([{ ref: '/about', aLabel: 'About' }, { ref: '/pricing', aLabel: 'Pricing' }]),

        ([{ ref: '/', aLabel: 'HomePage' }, { ref: '/contact', aLabel: 'Contact' }]),

        ([{ ref: '/terms-of-service', aLabel: 'Terms Of Service' }, { ref: '/privacy-policy', aLabel: 'Privacy Policy' }])
    ]

    //extracting communities for now

    const sectionsMapped = sections.map((section, index) => {
        if (section === null) return null;
        return (
            <FooterColumn key={index}>
                <h3 className={footerSectionText}>
                    {section}
                </h3>
                {sectionsInfo[index] && sectionsInfo[index].map((sectionInfo, sectionIndex) => {
                    return (
                        <Link href={relativeClicks[index][sectionIndex].ref} className={footerButtonText} key={sectionIndex} aria-label={relativeClicks[index][sectionIndex].aLabel}>
                            {sectionInfo}
                        </Link>
                    )
                })}
            </FooterColumn>
        )
    });

    return (
        <footer className="bg-footerBack text-footerText backdrop-blur-sm border-t border-accent/60 w-full py-12 min-h-[30vh] flex flex-col justify-start items-start md:items-center h-content mt-8 shadow-[0_-6px_24px_rgba(44,26,13,0.08)]">
            <div className="flex flex-col justify-start items-start space-y-12 sm:flex-row sm:justify-start sm:items-start sm:space-x-8 md:space-x-12 w-full h-content sm:px-12">
                {sectionsMapped}
            </div>
            <RightsFooter footerButtonText={footerButtonText} />
        </footer>
    );
}
