'use client'

import { useProfileStore } from "@/context/profileStore";
import { IUser } from "@/models/types/user";
import { Menu, Divider } from "@mantine/core";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { JSX } from "react";
import { GiFamilyTree } from "react-icons/gi";
import { IoHomeOutline } from "react-icons/io5";
import { PiCookieThin } from "react-icons/pi";
import { signOut } from 'next-auth/react';
// import { RiCommunityLine } from "react-icons/ri";
import { toast } from "sonner";
import { modals } from '@mantine/modals';

const fam = <GiFamilyTree />;
const recipes = <PiCookieThin />;
// const communities = <RiCommunityLine />;

export default function MenuContent({ userInfo, session, profile, firstName, signOutElement, setSignInModal, signIn, handleZoomClick, handleUpdate }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; signOutElement: JSX.Element; setSignInModal: (open: boolean) => void, session: Session | null, signIn: JSX.Element | null, handleUpdate: () => Promise<void> }) {

    const pathname = usePathname();
    const router = useRouter();
    const recipesData = userInfo ? userInfo.recipeIDs as string[] : [] as string[];
    const userFamilyID = userInfo ? userInfo.userFamilyID as string : '';
    // const communitiesData = userInfo ? userInfo.communityIDs as string[] : [] as string[];
    const setTab = useProfileStore(s => s.setTab);

    const handleTab = async (tab: number) => {
        setTab({ child: 0, parent: tab })
    }

    const handleNavigation = async (tab: number, href: string) => {
        if (href === '/profile') {
            await handleTab(tab);
        }
        router.push(href);
    };

    const signingOut = async () => {
        handleZoomClick();
        await signOut();
        await handleUpdate();
    }

    const ConfirmModal = () => modals.openConfirmModal({
        title: 'Confirm sign out',
        labels: { confirm: 'Sign out', cancel: 'Cancel' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => signingOut(),
    });

    return session ? (
        <Menu.Dropdown style={{ border: '1px solid #716040', outlineOffset: '-2px' }}>
            <Menu.Label>{!firstName ? 'User Specific' : `Hello ${firstName}!`}</Menu.Label>
            <Divider />
            <Menu.Item onClick={() => {
                router.push('/');
            }} leftSection={<IoHomeOutline />} pb={'sm'} pt={'sm'}>
                Home
            </Menu.Item>
            <Menu.Item onClick={() => {

                router.push('/profile')
            }} leftSection={profile} disabled={pathname.includes('/profile')} style={{ textDecoration: pathname.includes('/profile') ? 'underline' : '' }} pb={'sm'}>
                Profile
            </Menu.Item>
            <Menu.Item leftSection={recipes} onClick={() => {
                handleNavigation(2, '/profile')
            }} pb={'sm'}>
                {recipesData && recipesData.length > 0 ? (`Your Recipes`) : (`Create a Recipe`)}
            </Menu.Item>


            <Menu.Item leftSection={fam} onClick={() => {
                handleNavigation(1, '/profile');
            }} pb={'sm'}>
                {userFamilyID && userFamilyID !== '' ? (`Your Family`) : (`Create a family`)}
            </Menu.Item >

            <Divider />
            <Menu.Item onClick={ConfirmModal} leftSection={signOutElement} pb={'sm'}>
                Sign Out
            </Menu.Item>
        </Menu.Dropdown>
    ) : (
        <Menu.Dropdown style={{ border: '1px solid #716040', outlineOffset: '-2px' }}>
            <Menu.Label>PreservedRecipes Specific</Menu.Label>
            <Menu.Item onClick={() => {
                router.push('/')
            }} leftSection={<IoHomeOutline />} pb={'sm'} pt={'sm'}>
                Home
            </Menu.Item>
            <Menu.Item pb={'sm'} onClick={() => {
                router.push('/about')
            }}>
                About
            </Menu.Item>
            <Menu.Item onClick={() => {
                toast.info("Looking at Pricing!")
            }} pb={'sm'}>Pricing</Menu.Item>
            <Divider />
            <Menu.Label pb={'sm'}>User Specific</Menu.Label>
            <Menu.Item onClick={() => {
                setSignInModal(true);
                handleZoomClick();
            }} leftSection={signIn} pb={'sm'}>
                Sign In
            </Menu.Item>
            <Menu.Item onClick={() => {
                router.push('/register')
            }} pb={'sm'}>Register</Menu.Item>
        </Menu.Dropdown>
    );
};