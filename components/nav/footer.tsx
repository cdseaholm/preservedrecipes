'use client'

import { useStateStore } from "@/context/stateStore";
import { useSession } from "next-auth/react";
import { FaRegCopyright } from "react-icons/fa";

const FooterColumn = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-start items-start pl-12 space-y-2">
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

    return (
        <footer className="bg-mainBack border-t border-accent w-screen mb-12 min-h-[30vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
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
            </div>
            <div className="flex flex-col justify-center items-center text-[12px] pt-10">
                <div className="flex flex-row justify-center items-center text-[12px] w-full space-x-4">
                    <p className={footerButtonText}>Terms Of Service</p>
                    <p className={footerButtonText}>Privacy Policy</p>
                </div>
                <div className="flex flex-row justify-center items-center text-[12px] w-full space-x-4">
                    All rights reserved
                    <span className="px-2">
                        <FaRegCopyright />
                    </span>
                    preservedRecipes.com
                </div>
            </div>
        </footer>
    );
}