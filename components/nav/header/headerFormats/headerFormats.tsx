'use client';

import { useStateStore } from "@/context/stateStore";
import { Menu, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { forwardRef, JSX } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { toast } from "sonner";
import { Session } from "next-auth";
import MenuContent from "./menuContent";
import { IUser } from "@/models/types/user";

const LargeUserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <UnstyledButton ref={ref} size={20} className="bg-transparent" {...others} aria-label="User Menu">
            <FaRegUserCircle size={28} />
        </UnstyledButton>
    )
);
LargeUserButton.displayName = 'LargeUserButton';

const UserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <UnstyledButton ref={ref} size={28} className="bg-transparent" {...others} aria-label="Menu">
            <FiMenu size={28} />
        </UnstyledButton>
    )
);
UserButton.displayName = 'UserButton';

export function HeaderLarge({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, signOutElement, setSignInModal, session, short }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; signOutElement: JSX.Element; setSignInModal: (open: boolean) => void, session: Session | null, short: boolean }) {

    const width = useStateStore(state => state.widthQuery);
    const widthToUse = short ? (width / 1.5) : 300;

    return (

        <nav className="flex flex-row justify-end items-center w-2/3 space-x-8">
            <Link href={'/about'} aria-label="About">About</Link>
            <button onClick={() => toast.info(`You'd go to the Pricing page right now!`)} aria-label="Pricing">Pricing</button>
            <Menu shadow="md" width={widthToUse} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
                <Menu.Target>
                    <LargeUserButton />
                </Menu.Target>
                <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName} signOutElement={signOutElement} setSignInModal={setSignInModal} session={session} signIn={null} userInfo={userInfo} />
            </Menu>
        </nav>

    );
}

export function HeaderSmall({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, signOutElement, setSignInModal, signIn, session, short }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; signOutElement: JSX.Element; setSignInModal: (open: boolean) => void, signIn: JSX.Element, session: Session | null, short: boolean }) {

    const width = useStateStore(state => state.widthQuery);
    const widthToUse = short ? (width - 10) : 250;

    return (
        <nav className="flex flex-row items-center justify-end w-1/3">
            <Menu shadow="md" width={widthToUse} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
                <Menu.Target>
                    <UserButton />
                </Menu.Target>
                <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName} signOutElement={signOutElement} setSignInModal={setSignInModal} session={session} signIn={signIn} userInfo={userInfo} />
            </Menu>
        </nav>
    );
}