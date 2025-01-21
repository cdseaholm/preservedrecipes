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
        <UnstyledButton ref={ref} size={20} className="bg-transparent" {...others}>
            <FaRegUserCircle size={28} />
        </UnstyledButton>
    )
);
LargeUserButton.displayName = 'LargeUserButton';

const UserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <UnstyledButton ref={ref} size={28} className="bg-transparent" {...others}>
            <FiMenu size={28} />
        </UnstyledButton>
    )
);
UserButton.displayName = 'UserButton';

export function HeaderLargeShort({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, setOpenSignOutModal, signOut, setSignInModal, setRegisterModal, session }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, setRegisterModal: (open: boolean) => void, session: Session | null }) {

    const width = useStateStore(state => state.widthQuery);

    return (
        <nav className="flex flex-row justify-end items-center w-2/3 space-x-8">
            <Link href={'/about'}>About</Link>
            <button onClick={() => toast.info(`You'd go to the Pricing page right now!`)}>Pricing</button>
            <Menu shadow="md" width={width / 1.5} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
                <Menu.Target>
                    <LargeUserButton />
                </Menu.Target>
                <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName}setOpenSignOutModal={setOpenSignOutModal} signOut={signOut} setSignInModal={setSignInModal} setRegisterModal={setRegisterModal} session={session} signIn={null} userInfo={userInfo} />
            </Menu>
        </nav>
    );
}

export function HeaderLargeNotShort({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, setOpenSignOutModal, signOut, setSignInModal, setRegisterModal, session }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, setRegisterModal: (open: boolean) => void, session: Session | null }) {

    return (
        <nav className="flex flex-row justify-end items-center w-2/3 space-x-8">
            <Link href={'/about'}>About</Link>
            <button onClick={() => toast.info(`You'd go to the Pricing page right now!`)}>Pricing</button>
            <Menu shadow="md" width={300} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
                <Menu.Target>
                    <LargeUserButton />
                </Menu.Target>
                <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName}setOpenSignOutModal={setOpenSignOutModal} signOut={signOut} setSignInModal={setSignInModal} setRegisterModal={setRegisterModal} session={session} signIn={null} userInfo={userInfo} />
            </Menu>
        </nav>
    );
}

export function HeaderSmallShort({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, setOpenSignOutModal, signOut, setSignInModal, signIn, setRegisterModal, session }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, signIn: JSX.Element, setRegisterModal: (open: boolean) => void, session: Session | null }) {
    const width = useStateStore(state => state.widthQuery);

    return (
        <nav className="flex flex-row items-center justify-end w-1/3">
            <Menu shadow="md" width={width - 10} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
                <Menu.Target>
                    <UserButton />
                </Menu.Target>
                <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName}setOpenSignOutModal={setOpenSignOutModal} signOut={signOut} setSignInModal={setSignInModal} setRegisterModal={setRegisterModal} session={session} signIn={signIn} userInfo={userInfo} />
            </Menu>
        </nav>
    );
}

export function HeaderSmallNotShort({ userInfo, handleZoomClick, handleZoomClose, profile, firstName, setOpenSignOutModal, signOut, setSignInModal, signIn, setRegisterModal, session }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, signIn: JSX.Element, setRegisterModal: (open: boolean) => void, session: Session | null }) {

    return (
        <nav className="flex flex-row items-center justify-end w-1/3">
            <Menu shadow="md" width={250} withArrow arrowSize={12} arrowOffset={-2} onOpen={handleZoomClick} onClose={handleZoomClose}>
                <Menu.Target>
                    <UserButton />
                </Menu.Target>
                <MenuContent handleZoomClick={handleZoomClick} handleZoomClose={handleZoomClose} profile={profile} firstName={firstName}setOpenSignOutModal={setOpenSignOutModal} signOut={signOut} setSignInModal={setSignInModal} setRegisterModal={setRegisterModal} session={session} signIn={signIn} userInfo={userInfo} />
            </Menu>
        </nav>
    );
}