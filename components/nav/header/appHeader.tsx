'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { AiOutlineProfile } from "react-icons/ai";
import { GoSignOut, GoSignIn } from "react-icons/go";
import { TabbedDrawer } from "./headerFormats/tabbed-drawer";
import { IUser } from "@/models/types/personal/user";
import { FiHome } from "react-icons/fi";
import { useWindowSizes } from "@/context/width-height-store";

const signOutElement = <GoSignOut color="red" />;
const signInIcon = <GoSignIn color="blue" />;
const profile = <AiOutlineProfile />;

export default function AppHeader({ handleMenuToggle, openMenu, userInfo }: { handleMenuToggle: (menu: 'main' | 'sub' | null) => void, openMenu: 'main' | 'sub' | null, userInfo: IUser | null }) {

    const pathname = usePathname();
    const { data: session } = useSession();
    const { width } = useWindowSizes();

    const headerClass = `bg-[#694b33ff]/30 w-screen flex flex-row items-center fixed text-mainText min-h-[60px] border-b border-black/30`;

    const toRender = (
        pathname === '/color-picker-mode' ? (
            <header className={`${headerClass} justify-end`}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        Exit Color Picker Mode
                    </Link>
                </section>
            </header>
        ) : (
            <header className={`${headerClass} justify-between px-12 md:px-16 lg:px-20`}>
                <section className="text-sm sm:text-base md:text-lg lg:text-xl font-bold w-content w-1/2 cursor-pointer hover:underline hover:text-mainText/70 min-h-[50px] flex flex-row items-center justify-start">
                    <Link href={'/'} title="Home">
                        {width < 768 ? (
                            <div className="flex flex-col items-center justify-center">
                                <FiHome size={24} className="text-mainText group-hover:text-mainText/70 my-1" />
                                <span className="text-[10px] mb-1 font-medium text-mainText/80 group-hover:text-mainText/60">
                                    Home
                                </span>
                            </div>
                        ) : 'Preserved Recipes'}
                    </Link>
                </section>
                <TabbedDrawer
                    profile={profile}
                    session={session}
                    signOutElement={signOutElement}
                    widthQuery={width}
                    signIn={signInIcon}
                    handleMenuToggle={handleMenuToggle}
                    openMenu={openMenu}
                    userInfo={userInfo}
                />
            </header>
        )
    );

    return toRender;
}

