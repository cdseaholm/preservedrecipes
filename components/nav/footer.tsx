'use client'

import { useStateStore } from "@/context/stateStore";
import { useSession } from "next-auth/react";
import RightsFooter from "./footer/rightsFoot";

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
    const setColorPickerMode = useStateStore(state => state.setColorPickerMode);
    const colorPickerMode = useStateStore(state => state.colorPickerMode);

    const handleColorPicker = () => {
        setColorPickerMode(!colorPickerMode)
    }

    const sections = ['User', 'Product', 'Pages', 'More'];

    const sectionsInfo = [
        (session ? ['Profile', 'Sign out'] : ['Create Account', 'Sign in']),

        (['About', 'Pricing', 'Contact']),

        (['Homepage', 'About', 'For Fun - Color Picker']),

        (['Upcoming Features', 'Terms Of Service', 'Privacy Policy'])
    ];
    //extracting communities for now

    return (
        <footer className="bg-mainBack border-t border-accent w-screen mb-12 min-h-[30vh] flex flex-col justify-start items-start md:items-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
                {sections.map((section, index) => {
                    return (
                        <FooterColumn key={index}>
                            <h3 className={footerSectionText}>
                                {section}
                            </h3>
                            {sectionsInfo[index].map((sectionInfo, sectionIndex) => {
                                if (index === 2 && sectionIndex === 3) {
                                    return (
                                        <button onClick={() => handleColorPicker()} className={footerButtonText} key={sectionIndex}>
                                            {sectionInfo}
                                        </button>
                                    )
                                } else {
                                    return (
                                        <p className={footerButtonText} key={sectionIndex}>{sectionInfo}</p>
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

{/**
    {session ? (
                    <FooterColumn>
                        <h3 className={footerSectionText}>User</h3>
                        <p className={footerButtonText}>Profile</p>
                        <p className={footerButtonText}>Sign out</p>
                    </FooterColumn>
                ) : (
                    <FooterColumn>
                        <h3 className={footerSectionText}>User</h3>
                        <p className={footerButtonText}>Create Account</p>
                        <p className={footerButtonText}>Sign in</p>
                    </FooterColumn>
                )}
                <FooterColumn>
                    <h3 className={footerSectionText}>Product</h3>
                    <p className={footerButtonText}>About</p>
                    <p className={footerButtonText}>Pricing</p>
                    <p className={footerButtonText}>Contact</p>
                </FooterColumn>
                <FooterColumn>
                    <h3 className={footerSectionText}>Pages</h3>
                    <p className={footerButtonText}>Homepage</p>
                    <p className={footerButtonText}>Communities</p>
                    <p className={footerButtonText}>About</p>
                    <p className={footerButtonText}>Login</p>
                    <button onClick={() => handleColorPicker()} className={footerButtonText}>
                        For fun - Color Picker
                    </button>
                </FooterColumn>
                
                */}