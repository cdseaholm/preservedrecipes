'use client';

import { useSession } from "next-auth/react";
import { useStateStore } from "@/context/stateStore";
import { Suspense } from "react";
import Link from "next/link";
import { GoSignOut, GoSignIn } from "react-icons/go";
import { AiOutlineProfile } from "react-icons/ai";
import { useUserStore } from "@/context/userStore";
import { HeaderSmallShort, HeaderSmallNotShort, HeaderLargeShort, HeaderLargeNotShort } from "./headerFormats/headerFormats";
import { handleZoomClick, handleZoomClose, handleSignOutModal, handleSignInModal, handleRegisterModal, getFirstName } from "./navFunctions/functions";

const signOut = <GoSignOut color="red" />;
const signIn = <GoSignIn color="blue" />;
const profile = <AiOutlineProfile />;

export default function MainHeader() {
    const { data: session } = useSession();
    const userInfo = useUserStore(state => state.userInfo);

    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;
    const height = useStateStore(state => state.heightQuery);
    const shortStack = useStateStore(state => state.shortStack);

    const commonParams = {
        userInfo: userInfo,
        handleZoomClick: handleZoomClick,
        handleZoomClose: handleZoomClose,
        profile: profile,
        firstName: getFirstName(session),
        session: session,
        setOpenSignOutModal: handleSignOutModal,
        signOut: signOut,
        setSignInModal: handleSignInModal,
        setRegisterModal: handleRegisterModal,
    };

    return (
        <Suspense fallback={
            <header className={`bg-mainBack w-full flex flex-row justify-start items-center px-5 border-b border-accent fixed text-mainText ${isMediumScreenOrLess ? "px-5 py-2" : 'px-12 py-2'} min-h-[75px]`}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        PreservedRecipes
                    </Link>
                </section>
            </header>
        }>
            <header className={`bg-mainBack w-full flex flex-row justify-between items-center px-5 border-b border-accent fixed text-mainText ${isMediumScreenOrLess ? "px-5 py-2" : 'px-12 py-2'} min-h-[75px]`}>
                <section className="text-base font-bold w-2/3 md:w-1/3">
                    <Link href={'/'}>
                        {isMediumScreenOrLess ? 'PreservedRecipes Image Here' : 'PreservedRecipes'}
                    </Link>
                </section>

                {isMediumScreenOrLess ? (
                    shortStack && height < 420 ? (
                        <HeaderSmallShort signIn={signIn} {...commonParams} />
                    ) : (
                        <HeaderSmallNotShort signIn={signIn} {...commonParams} />
                    )
                ) : (
                    shortStack && height < 420 ? (
                        <HeaderLargeShort {...commonParams} />
                    ) : (
                        <HeaderLargeNotShort {...commonParams} />
                    )
                )}
            </header>
        </Suspense>
    );
}