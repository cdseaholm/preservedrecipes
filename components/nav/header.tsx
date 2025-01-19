'use client';

import { useSession } from "next-auth/react";
import { useStateStore } from "@/context/stateStore";
import { JSX, Suspense } from "react";
import Link from "next/link";
import { GoSignOut, GoSignIn } from "react-icons/go";
import { AiOutlineProfile } from "react-icons/ai";
import { GiFamilyTree } from "react-icons/gi";
import { PiCookieThin } from "react-icons/pi";
import { RiCommunityLine } from "react-icons/ri";
import { useUserStore } from "@/context/userStore";
import { HeaderSmallShort, HeaderSmallNotShort, HeaderLargeShort, HeaderLargeNotShort } from "./headerFormats/headerFormats";
import { handleZoomClick, handleZoomClose, handleSignOutModal, handleSignInModal, handleRegisterModal, getFirstName } from "./navFunctions/functions";
import MakeTexts from "./navFunctions/makeTexts";

const signOut = <GoSignOut color="red" />;
const signIn = <GoSignIn color="blue" />;
const profile = <AiOutlineProfile />;
const fam = <GiFamilyTree />;
const recipes = <PiCookieThin />;
const communities = <RiCommunityLine />;

export default function MainHeader() {
    const { data: session } = useSession();
    const userInfo = useUserStore(state => state.userInfo);
    const textElements = MakeTexts({ userInfo: userInfo, elements: [recipes, fam, communities] }) as JSX.Element[];

    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;
    const height = useStateStore(state => state.heightQuery);
    const shortStack = useStateStore(state => state.shortStack);

    const commonParams = {
        handleZoomClick: handleZoomClick,
        handleZoomClose: handleZoomClose,
        profile: profile,
        firstName: getFirstName(session),
        recipes: recipes,
        fam: fam,
        communities: communities,
        session: session,
        recipeText: textElements[0],
        familyText: textElements[1],
        communityText: textElements[2],
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