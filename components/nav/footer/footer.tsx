'use client'

import { useSession } from "next-auth/react";
import RightsFooter from "./rightsFoot";
import Link from "next/link";
import { toast } from "sonner";
import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { useWindowSizes } from "@/context/width-height-store";

const FooterColumn = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-start items-start pl-12 sm:pl-4 space-y-2 w-full ">
            {children}
        </div>
    );
}

const footerButtonText = "text-blue-600 hover:text-blue-200 hover:underline rounded-md p-1 cursor-pointer text-[14px] sm:text-[16px] text-left bg-transparent border-none";
const footerSectionText = "text-base sm:text-lg font-semibold underline p-1"

export default function MainFooter() {

    const { data: session } = useSession();
    const { width } = useWindowSizes();
    const family = useFamilyStore(state => state.family);
    const familyID = family ? family._id : '';
    const user = session && session.user ? session.user : null;
    const userEmail = user && user.email ? user.email : '';
    const userInfo = useUserStore(state => state.userInfo);

    const sections = ['User', 'Product', 'Pages', 'More'];

    const sectionsInfo = [
        (userEmail !== '' && familyID !== '' ? ['Profile', 'Family Dashboard', 'Sign out'] : userEmail !== '' && familyID === '' ? ['Profile', 'Create Family', 'Sign out'] : ['Create Account', 'Sign in']),

        (['About', 'Pricing', 'Upcoming Features']),

        (['Homepage', 'Communities',  'Contact']),

        (['Terms Of Service', 'Privacy Policy', 'For Fun - Color Picker'])
    ];

    const relativeClicks = [
        (userEmail !== '' && familyID !== '' ? (
            [{ ref: `/u/${userInfo?._id}/profile`, aLabel: 'Profile' }, { ref: `/family/${familyID}/dashboard`, aLabel: 'Family Dashboard' }, { ref: '/api/auth/signout', aLabel: 'Sign out' }]
        ) : userEmail !== '' && familyID === '' ? (
            [{ ref: ``, aLabel: 'Profile' }, { ref: '/create-family', aLabel: 'Create Family' }, { ref: '/api/auth/signout', aLabel: 'Sign out' }]
        ) : (
            [{ ref: '/register', aLabel: 'Create Account' }, { ref: '/api/auth/signin', aLabel: 'Sign in' }]
        )),

        ([{ ref: '/about', aLabel: 'About' }, { ref: '/pricing', aLabel: 'Pricing' }, { ref: '/upcoming', aLabel: 'Upcoming Features' }]),

        ([{ ref: '/homepage', aLabel: 'HomePage' }, { ref: '/communities', aLabel: 'Communities' }, { ref: '/contact', aLabel: 'Contact' }]),

        ([{ ref: '/terms-of-service', aLabel: 'Terms Of Service' }, { ref: '/privacy-policy', aLabel: 'Privacy Policy' }, { ref: '/color-picker-mode', aLabel: 'Color Picker Mode' }])
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
                    if (index === 0 && sectionIndex === 1 || relativeClicks[index] === null) {
                        {/**Family and Family Dash not allowed for now */}
                        return (
                            <button type="button" onClick={() => toast.info(sectionInfo)} className={footerButtonText} style={{ fontSize: width < 640 ? '14px' : '16px' }} key={sectionIndex} aria-label={sectionInfo}>
                                {sectionInfo}
                            </button>
                        )
                    } else if (index === 2 && sectionIndex === 1) {
                        {/**Communities not allowed for now */}
                        return (
                            <button type="button" onClick={() => toast.info('Communities coming soon!')} className={footerButtonText} style={{ fontSize: width < 640 ? '14px' : '16px' }} key={sectionIndex} aria-label={'Communities'}>
                                {'Communities'}
                            </button>
                        )
                    } else {
                        return (
                            <Link href={relativeClicks[index][sectionIndex].ref} className={footerButtonText} key={sectionIndex} aria-label={relativeClicks[index][sectionIndex].aLabel}>
                                {sectionInfo}
                            </Link>
                        )
                    }
                })}
            </FooterColumn>
        )
    });

    return (
        <footer className="bg-[#694b33ff]/20 backdrop-blur-sm border-t border-accent w-full py-12 min-h-[30vh] flex flex-col justify-start items-start md:items-center h-content mt-12">
            <div className="flex flex-col justify-start items-start space-y-12 sm:flex-row sm:justify-start sm:items-start sm:space-x-8 md:space-x-12 w-full h-content sm:px-12">
                {sectionsMapped}
            </div>
            <RightsFooter footerButtonText={footerButtonText} />
        </footer>
    );
}