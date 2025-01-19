'use client'

import { Menu, Divider } from "@mantine/core";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react";
import { toast } from "sonner";

export default function MenuContent({ session, profile, firstName, recipeText, familyText, communityText, setOpenSignOutModal, signOut, setSignInModal, signIn, setRegisterModal, handleZoomClick }: { handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; recipeText: JSX.Element; familyText: JSX.Element; communityText: JSX.Element; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, setRegisterModal: (open: boolean) => void, session: Session | null, signIn: JSX.Element | null }) {

    const pathname = usePathname();
    const router = useRouter();

    return session ? (
        <Menu.Dropdown style={{ border: '1px solid #716040', outlineOffset: '-2px' }}>
            <Menu.Label>{!firstName ? 'User Specific' : `Hello ${firstName}!`}</Menu.Label>
            <Divider />
            <Menu.Item onClick={() => router.push('/profile')} leftSection={profile} disabled={pathname.includes('/profile')} style={{ textDecoration: pathname.includes('/profile') ? 'underline' : '' }}>
                Profile
            </Menu.Item>
            {recipeText}
            {familyText}
            {communityText}
            <Divider />
            <Menu.Item onClick={() => {
                setOpenSignOutModal(true);
                handleZoomClick();
            }} leftSection={signOut}>
                Sign Out
            </Menu.Item>
        </Menu.Dropdown>
    ) : (
        <Menu.Dropdown style={{ border: '1px solid #716040', outlineOffset: '-2px' }}>
            <Menu.Label>PreservedRecipes Specific</Menu.Label>
            <Menu.Item>
                <Link href={'/about'}>About</Link>
            </Menu.Item>
            <Menu.Item onClick={() => toast.info("Looking at Pricing!")}>Pricing</Menu.Item>
            <Divider />
            <Menu.Label>User Specific</Menu.Label>
            <Menu.Item onClick={() => {
                setSignInModal(true);
                handleZoomClick();
            }} leftSection={signIn}>
                Sign In
            </Menu.Item>
            <Menu.Item onClick={() => setRegisterModal(true)}>Register</Menu.Item>
        </Menu.Dropdown>
    );
};