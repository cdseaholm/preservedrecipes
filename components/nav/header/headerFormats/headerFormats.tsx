'use client';

import { useStateStore } from "@/context/stateStore";
import { forwardRef, JSX } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { Session } from "next-auth";
import { IUser } from "@/models/types/user";
import dynamic from "next/dynamic";
import { Menu, MenuTarget } from "@mantine/core";

const MenuContent = dynamic(() => import('./menuContent'), { ssr: false })

const LargeUserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <button ref={ref} className="bg-transparent" {...others} aria-label="User Menu" style={{ cursor: 'pointer' }}>
            <FaRegUserCircle size={28} />
        </button>
    )
);
LargeUserButton.displayName = 'LargeUserButton';

const UserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <button ref={ref} className="bg-transparent cursor-pointer" {...others} aria-label="Menu" style={{ cursor: 'pointer' }}>
            <FiMenu size={28} />
        </button>
    )
);
UserButton.displayName = 'UserButton';

export function HeaderLarge({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, signOutElement, setSignInModal, session, short }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; signOutElement: JSX.Element; setSignInModal: (open: boolean) => void, session: Session | null, short: boolean }) {

    const width = useStateStore(state => state.widthQuery);
    const widthToUse = short ? (width / 1.5) : 300;

    return (

        <Menu shadow="md" width={widthToUse} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
            <MenuTarget>
                <LargeUserButton />
            </MenuTarget>
            <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName} signOutElement={signOutElement} setSignInModal={setSignInModal} session={session} signIn={null} userInfo={userInfo} />
        </Menu>

    );
}

export function HeaderSmall({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, signOutElement, setSignInModal, signIn, session, short }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; signOutElement: JSX.Element; setSignInModal: (open: boolean) => void, signIn: JSX.Element, session: Session | null, short: boolean }) {

    const width = useStateStore(state => state.widthQuery);
    const widthToUse = short ? (width - 10) : 250;

    return (
        <Menu shadow="md" width={widthToUse} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
            <MenuTarget>
                <UserButton />
            </MenuTarget>
            <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName} signOutElement={signOutElement} setSignInModal={setSignInModal} session={session} signIn={signIn} userInfo={userInfo} />
        </Menu>
    );
}