'use client';

import { useStateStore } from "@/context/stateStore";
import { GoSignOut, GoSignIn } from "react-icons/go";
import { AiOutlineProfile } from "react-icons/ai";
import { useUserStore } from "@/context/userStore";
import { handleZoomClick, handleZoomClose, handleSignInModal, getFirstName } from "../navFunctions/functions";
import { HeaderLarge, HeaderSmall } from "./headerFormats/headerFormats";
import { Session } from "next-auth";

const signOutElement = <GoSignOut color="red" />;
const signIn = <GoSignIn color="blue" />;
const profile = <AiOutlineProfile />;

export default function MainHeader({ session }: { session: Session | null }) {

    const userInfo = useUserStore(state => state.userInfo);

    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;
    const height = useStateStore(state => state.heightQuery);
    const shortStack = useStateStore(state => state.shortStack);
    const short = shortStack && height < 420 ? true : false;

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

    return (
        isMediumScreenOrLess ? (
            <HeaderSmall signIn={signIn} {...commonParams} short={short} />
        ) : (
            <HeaderLarge {...commonParams} short={short} />
        )
    );
}