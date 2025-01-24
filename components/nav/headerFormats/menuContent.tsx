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
// import { RiCommunityLine } from "react-icons/ri";
import { toast } from "sonner";

const fam = <GiFamilyTree />;
const recipes = <PiCookieThin />;
// const communities = <RiCommunityLine />;

export default function MenuContent({ userInfo, session, profile, firstName, setOpenSignOutModal, signOut, setSignInModal, signIn, handleZoomClick }: { userInfo: IUser, handleZoomClick: () => void; handleZoomClose: () => void; profile: React.ReactNode; firstName: string | null; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, session: Session | null, signIn: JSX.Element | null }) {

    const pathname = usePathname();
    const router = useRouter();
    const recipesData = userInfo ? userInfo.recipeIDs as string[] : [] as string[];
    const userFamilyID = userInfo ? userInfo.userFamilyID as string : '';
    // const communitiesData = userInfo ? userInfo.communityIDs as string[] : [] as string[];
    const setTab = useProfileStore(s => s.setTab);
    const handleTab = async (tab: string) => {
        setTab(tab)
    }

    const handleNavigation = async (tab: string, href: string) => {
        await handleTab(tab);
        router.push(href);
    };

    return session ? (
        <Menu.Dropdown style={{ border: '1px solid #716040', outlineOffset: '-2px' }}>
            <Menu.Label>{!firstName ? 'User Specific' : `Hello ${firstName}!`}</Menu.Label>
            <Divider />
            <Menu.Item onClick={() => router.push('/')} leftSection={<IoHomeOutline />} pb={'sm'} pt={'sm'}>
                Home
            </Menu.Item>
            <Menu.Item onClick={() => router.push('/profile')} leftSection={profile} disabled={pathname.includes('/profile')} style={{ textDecoration: pathname.includes('/profile') ? 'underline' : '' }} pb={'sm'}>
                Profile
            </Menu.Item>
            <Menu.Item leftSection={recipes} onClick={() => handleNavigation('recipes', '/profile')} pb={'sm'}>
                {recipesData && recipesData.length > 0 ? (`Your Recipes`) : (`Create a Recipe`)}
            </Menu.Item>


            <Menu.Item leftSection={fam} onClick={() => handleNavigation('family', '/profile')} pb={'sm'}>
                {userFamilyID && userFamilyID !== '' ? (`Your Family`) : (`Create a family`)}
            </Menu.Item >


            {/* <Menu.Item leftSection={communities} onClick={communitiesData && communitiesData.length > 0 ? (() => handleNavigation('communities', '/profile')) : (() => router.push('/community'))} pb={'sm'}>
                {communitiesData && communitiesData.length > 0 ? (`Your Communities`) : (`Join a Community`)}
            </Menu.Item > */}

            <Divider />
            <Menu.Item onClick={() => {
                setOpenSignOutModal(true);
                handleZoomClick();
            }} leftSection={signOut} pb={'sm'}>
                Sign Out
            </Menu.Item>
        </Menu.Dropdown>
    ) : (
        <Menu.Dropdown style={{ border: '1px solid #716040', outlineOffset: '-2px' }}>
            <Menu.Label>PreservedRecipes Specific</Menu.Label>
            <Menu.Item onClick={() => router.push('/')} leftSection={<IoHomeOutline />} pb={'sm'} pt={'sm'}>
                Home
            </Menu.Item>
            <Menu.Item pb={'sm'} onClick={() => router.push('/about')}>
                About
            </Menu.Item>
            <Menu.Item onClick={() => toast.info("Looking at Pricing!")} pb={'sm'}>Pricing</Menu.Item>
            <Divider />
            <Menu.Label pb={'sm'}>User Specific</Menu.Label>
            <Menu.Item onClick={() => {
                setSignInModal(true);
                handleZoomClick();
            }} leftSection={signIn} pb={'sm'}>
                Sign In
            </Menu.Item>
            <Menu.Item onClick={() => router.push('/register')} pb={'sm'}>Register</Menu.Item>
        </Menu.Dropdown>
    );
};