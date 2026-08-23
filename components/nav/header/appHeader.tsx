'use client'

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { AiOutlineProfile } from "react-icons/ai";
import { GoSignOut, GoSignIn } from "react-icons/go";
import { TabbedDrawer } from "./headerFormats/tabbed-drawer";
import { IUser } from "@/models/types/personal/user";
import { useWindowSizes } from "@/context/width-height-store";

const signOutElement = <GoSignOut color="red" />;
const signInIcon = <GoSignIn color="blue" />;
const profile = <AiOutlineProfile />;

export default function AppHeader({ handleMenuToggle, openMenu, userInfo }: { handleMenuToggle: (menu: 'main' | 'sub' | null) => void, openMenu: 'main' | 'sub' | null, userInfo: IUser | null }) {

    const { data: session } = useSession();
    const { width } = useWindowSizes();

    const headerClass = `bg-navBack w-screen flex flex-row items-center fixed text-navText min-h-[60px] border-b border-black/30 shadow-md`;

    const toRender = (
        <header className={`${headerClass} justify-between px-12 md:px-16 lg:px-20`}>
            <nav className="flex min-h-[50px] w-1/2 flex-row items-center justify-start" aria-label="Primary">
                <Link
                    href="/"
                    title="RecipeSafe home"
                    aria-label="RecipeSafe home"
                    className="group flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white/10"
                >
                    <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-navText/10 ring-1 ring-navText/15">
                        <Image
                            src="/images/favicon.png"
                            alt=""
                            fill
                            sizes="36px"
                            className="object-contain p-0.5"
                            priority
                        />
                    </span>
                    <span className="truncate text-base font-bold leading-none text-navText group-hover:text-navTextMuted sm:text-lg">
                        RecipeSafe
                    </span>
                </Link>
            </nav>
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
    );

    return toRender;
}

