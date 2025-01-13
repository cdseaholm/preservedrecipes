'use client'

import { useStateStore } from "@/context/stateStore"
import { useModalStore } from "@/context/modalStore";
import { Session, User } from "next-auth";
import Link from "next/link";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { AiOutlineProfile } from "react-icons/ai";
import { GiFamilyTree } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import { PiCookieThin } from "react-icons/pi"
import { useUserStore } from "@/context/userStore";
import { IUserFamily } from "@/models/types/userFamily";
import { HeaderSmallNotShort, HeaderSmallShort } from "./headerFormats/headerSmall";
import { HeaderLargeNotShort, HeaderLargeShort } from "./headerFormats/headerLarge";
import { Suspense } from "react";
import { useSession } from "next-auth/react";

export default function MainHeader() {
    const { data: session } = useSession();
    const userInfo = useUserStore(state => state.userInfo);
    const recipes = userInfo ? userInfo.recipeIDs as string[] : [] as string[];
    const userFamily = userInfo ? userInfo.userFamily as IUserFamily : {} as IUserFamily;
    const familyID = userFamily ? userFamily.familyID as string : '';
    const communities = userInfo ? userInfo.communityIDs as string[] : [] as string[];
    const recipeText = recipes && recipes.length > 0 ? 'Your Recipes' : 'Create a Recipe';
    const familyText = familyID && familyID !== '' ? 'Your Family' : 'Create or Join a family';
    const communityText = communities && communities.length > 0 ? 'Your Communities' : 'Join a Community';
    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;
    const handleZoomMain = useStateStore(state => state.handleZoomReset);
    const width = useStateStore(state => state.widthQuery);

    const handleZoomReset = async (open: boolean) => {
        handleZoomMain(width, open);
    }

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
                    <SmallHeader session={session} recipeText={recipeText} familyText={familyText} communityText={communityText} handleZoomReset={handleZoomReset} />
                ) : (
                    <LargeHeader session={session} recipeText={recipeText} familyText={familyText} communityText={communityText} handleZoomReset={handleZoomReset} />
                )}
            </header>
        </Suspense>
    )
}

const signOut = (
    <GoSignOut color="red" />
)

const signIn = (
    <GoSignIn color="blue" />
)

const profile = (
    <AiOutlineProfile />
)

const fam = (
    <GiFamilyTree />
)

const recipes = (
    <PiCookieThin />
)

const communities = (
    <RiCommunityLine />
)

function SmallHeader({ session, recipeText, familyText, communityText, handleZoomReset }: { session: Session | null, recipeText: string, familyText: string, communityText: string, handleZoomReset: (open: boolean) => Promise<void> }) {

    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    let firstName = userName ? userName.split(' ')[0] : null;
    const setSignInModal = useModalStore(state => state.setOpenSignInModal);
    const setOpenSignOutModal = useModalStore(state => state.setOpenSignOutModal);
    const setRegisterModal = useModalStore(state => state.setOpenRegisterModal);
    const height = useStateStore(state => state.heightQuery);
    const shortStack = useStateStore(state => state.shortStack);

    const handleZoomClick = async () => {
        await handleZoomReset(true);
    };

    const handleZoomClose = async () => {
        await handleZoomReset(false);
    };

    const handleSignOutModal = (open: boolean) => {
        setOpenSignOutModal(open);
    };

    const handleSignInModal = (open: boolean) => {
        setSignInModal(open)
    };

    const handleRegisterModal = (open: boolean) => {
        setRegisterModal(open)
    };

    return (
        shortStack && height < 420 ? (
            <HeaderSmallShort
                handleZoomClick={handleZoomClick}
                handleZoomClose={handleZoomClose}
                profile={profile}
                firstName={firstName}
                recipes={recipes}
                fam={fam}
                communities={communities}
                session={session}
                recipeText={recipeText}
                familyText={familyText}
                communityText={communityText}
                setOpenSignOutModal={handleSignOutModal}
                signOut={signOut}
                setSignInModal={handleSignInModal}
                signIn={signIn}
                setRegisterModal={handleRegisterModal}
            />
        ) : (
            <HeaderSmallNotShort
                handleZoomClick={handleZoomClick}
                handleZoomClose={handleZoomClose}
                profile={profile}
                firstName={firstName}
                recipes={recipes}
                fam={fam}
                communities={communities}
                session={session}
                recipeText={recipeText}
                familyText={familyText}
                communityText={communityText}
                setOpenSignOutModal={handleSignOutModal}
                signOut={signOut}
                setSignInModal={handleSignInModal}
                signIn={signIn}
                setRegisterModal={handleRegisterModal}
            />
        )
    )
}

function LargeHeader({ session, recipeText, familyText, communityText, handleZoomReset }: { session: Session | null, recipeText: string, familyText: string, communityText: string, handleZoomReset: (open: boolean) => Promise<void> }) {

    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    let firstName = userName ? userName.split(' ')[0] : null;
    const setSignInModal = useModalStore(state => state.setOpenSignInModal);
    const setOpenSignOutModal = useModalStore(state => state.setOpenSignOutModal);
    const setRegisterModal = useModalStore(state => state.setOpenRegisterModal);
    const height = useStateStore(state => state.heightQuery);
    const shortStack = useStateStore(state => state.shortStack);

    const handleZoomClick = async () => {
        await handleZoomReset(true);
    }

    const handleZoomClose = async () => {
        await handleZoomReset(false);
    }

    const handleSignOutModal = (open: boolean) => {
        setOpenSignOutModal(open);
    };

    const handleSignInModal = (open: boolean) => {
        setSignInModal(open)
    };

    const handleRegisterModal = (open: boolean) => {
        setRegisterModal(open)
    };

    return (
        shortStack && height < 420 ? (
            <HeaderLargeShort
                handleZoomClick={handleZoomClick}
                handleZoomClose={handleZoomClose}
                profile={profile}
                firstName={firstName}
                recipes={recipes}
                fam={fam}
                communities={communities}
                session={session}
                recipeText={recipeText}
                familyText={familyText}
                communityText={communityText}
                setOpenSignOutModal={handleSignOutModal}
                signOut={signOut}
                setSignInModal={handleSignInModal}
                setRegisterModal={handleRegisterModal}
            />
        ) : (
            <HeaderLargeNotShort
                handleZoomClick={handleZoomClick}
                handleZoomClose={handleZoomClose}
                profile={profile}
                firstName={firstName}
                recipes={recipes}
                fam={fam}
                communities={communities}
                session={session}
                recipeText={recipeText}
                familyText={familyText}
                communityText={communityText}
                setOpenSignOutModal={handleSignOutModal}
                signOut={signOut}
                setSignInModal={handleSignInModal}
                setRegisterModal={handleRegisterModal}
            />
        )
    )
}