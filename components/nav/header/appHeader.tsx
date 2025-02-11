'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStateStore } from "@/context/stateStore";
import { useUserStore } from "@/context/userStore";
import { handleZoomClick, handleZoomClose, getFirstName, handleSignInModal } from "../navFunctions/functions";
import { AiOutlineProfile } from "react-icons/ai";
import { GoSignOut, GoSignIn } from "react-icons/go";
import { HeaderSmall, HeaderLarge } from "./headerFormats/headerFormats";

const signOutElement = <GoSignOut color="red" />;
const signInIcon = <GoSignIn color="blue" />;
const profile = <AiOutlineProfile />;

export default function AppHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userInfo = useUserStore(state => state.userInfo);
    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;
    const height = useStateStore(state => state.heightQuery);
    const shortStack = useStateStore(state => state.shortStack);
    const short = shortStack && height < 420 ? true : false;

    const handleClick = async () => {
        const { toast } = await import('sonner');
        toast.info(`You'd go to the Pricing page right now!`)
    }

    const commonParams = {
        userInfo: userInfo,
        handleZoomClick: handleZoomClick,
        handleZoomClose: handleZoomClose,
        profile: profile,
        firstName: getFirstName(session),
        session: session,
        signOutElement: signOutElement,
        setSignInModal: handleSignInModal
    };

    const headerClass = `bg-mainBack w-full flex flex-row items-center px-5 border-b border-accent fixed text-mainText px-5 py-2 md:px-12 md:py-2 min-h-[75px]`;

    if (pathname === '/color-picker-mode') {
        return (
            <header className={`${headerClass} justify-end`}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        Exit Color Picker Mode
                    </Link>
                </section>
            </header>
        )
    }

    return (
        <header className={`${headerClass} justify-between`}>
            <section className="text-base font-bold w-2/3 md:w-1/3">
                <Link href={'/'}>
                    {'Preserved Recipes'}
                </Link>
            </section>

            {isMediumScreenOrLess ? (
                <nav className="flex flex-row items-center justify-end w-1/3">
                    <HeaderSmall signIn={signInIcon} {...commonParams} short={short} />
                </nav>
            ) : (
                <nav className="flex flex-row justify-end items-center w-2/3 space-x-8">
                    <Link href={'/about'} aria-label="About">About</Link>
                    <button onClick={handleClick} aria-label="Pricing">Pricing</button>
                    <HeaderLarge {...commonParams} short={short} />
                </nav>
            )}
        </header>
    )
}