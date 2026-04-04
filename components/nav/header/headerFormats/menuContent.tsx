'use client'

import { Divider } from "@mantine/core";
import { Session } from "next-auth";
import { JSX } from "react";
import { PiCookieThin } from "react-icons/pi";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks";
import { GiFamilyTree } from "react-icons/gi";
import { MdHome, MdInfoOutline, MdOutlineAttachMoney } from "react-icons/md";
import { RiCommunityLine } from "react-icons/ri";
import { TfiWrite } from "react-icons/tfi";
import { IUser } from "@/models/types/personal/user";
import Link from "next/link";
import { useNavigation } from "@/components/hooks/menu/use-navigation-hook";

const recipes = <PiCookieThin />;
const communities = <RiCommunityLine />;
const fam = <GiFamilyTree />;

export default function MenuContent({ session, profile, signOutElement, signIn, userData, closeDrawer }: { profile: React.ReactNode; signOutElement: JSX.Element; session: Session | null, signIn: JSX.Element | null, userData: IUser | null, closeDrawer: () => void }) {

    const { handleSignOutClick, handleSignInClick } = MenuPanelHooks();
    const { navigate } = useNavigation();

    const homeButton = [
        { value: 'Home', label: 'Home', icon: <MdHome />, onClick: () => { navigate('/'); closeDrawer(); } }
    ]

    const buttons = [
        session && { value: 'Recipes', label: 'Recipes', icon: recipes, onClick: () => { navigate(`/u/recipes`); closeDrawer(); } },
        session && { value: 'Family', label: 'Family', icon: fam, onClick: () => { (userData && userData.userFamilyID && navigate(`/family/${userData.userFamilyID}`)); closeDrawer(); } },
        { value: 'Communities', label: 'Communities', icon: communities, onClick: () => { navigate('/communities'); closeDrawer(); } },
        { value: 'About', label: 'About', icon: <MdInfoOutline />, onClick: () => { navigate('/about'); closeDrawer(); } },
        { value: 'Pricing', label: 'Pricing', icon: <MdOutlineAttachMoney />, onClick: () => { navigate('/pricing'); closeDrawer(); } }
    ];

    const authButtons = [
        session && { value: 'Profile', label: 'Profile', icon: profile, href: '/u/profile' },
        session && { value: 'SignOut', label: 'Sign Out', icon: signOutElement, onClick: () => { handleSignOutClick(); closeDrawer(); } },
        !session && { value: 'SignIn', label: 'Sign In', icon: signIn, onClick: () => { handleSignInClick(); closeDrawer(); } },
        !session && { value: 'Register', label: 'Register', icon: <TfiWrite />, href: '/register' },
    ];

    {/**
        const authButtons = [
        session && { value: 'Profile', label: 'Profile', icon: profile, onClick: () => { router.push(`/u/profile`); closeDrawer(); } },
        session && { value: 'SignOut', label: 'Sign Out', icon: signOutElement, onClick: () => { handleSignOutClick(); closeDrawer(); } },
        !session && { value: 'SignIn', label: 'Sign In', icon: signIn, onClick: () => { handleSignInClick(); closeDrawer(); } },
        !session && { value: 'Register', label: 'Register', icon: <TfiWrite />, onClick: () => { router.push('/register'); closeDrawer(); } },
    ];
        */}

    const buttonClass = `flex flex-row items-center px-6 hover:bg-accent/20 rounded-md space-x-2 w-full cursor-pointer`;
    const textClass = `text-base md:text-lg lg:text-xl font-medium`;
    const disabledButtonClass = `flex flex-row items-center px-6 rounded-md space-x-2 w-full bg-gray-300/50`;
    const disabledTextClass = `text-base md:text-lg lg:text-xl font-medium text-gray-500`;

    const menuContent = (
        <>
            {homeButton.map((button) => (
                button && <button key={button.value} onClick={button.onClick} className={`${buttonClass} mt-4 py-4 w-full`}>
                    <span className={`${textClass}`}>{button.icon}</span>
                    <span className={`${textClass}`}>{button.label}</span>
                </button>
            ))}
            <Divider my={'md'} c={'dark'} w={'100%'} h={'1px'} style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
            }} />
            {buttons.map((button) => (
                button && (
                    /**(button.value === 'Family' || button.value === 'Communities')*/
                    (button.value === 'Communities') ? (
                        <button key={button.value} onClick={button.onClick} className={`${disabledButtonClass} py-4 mb-2`} disabled={true} title="Under Construction">
                            <span className={`${disabledTextClass}`}>{button.icon}</span>
                            <span className={`${disabledTextClass}`}>{button.label}</span>
                        </button>
                    ) : (
                        <button key={button.value} onClick={button.onClick} className={`${buttonClass} py-4 mb-2`}>
                            <span className={`${textClass}`}>{button.icon}</span>
                            <span className={`${textClass}`}>{button.label}</span>
                        </button>
                    )
                )
            ))}
            <Divider my={'md'} c={'dark'} w={'100%'} h={'1px'} style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
            }} />
            {authButtons.map((button) => {
                if (!button) return null;

                if ('href' in button && button.href) {
                    return (
                        <Link
                            key={button.value}
                            href={button.href}
                            onClick={closeDrawer}
                            className={`${buttonClass} py-4 mb-2`}
                        >
                            <span className={`${textClass}`}>{button.icon}</span>
                            <span className={`${textClass}`}>{button.label}</span>
                        </Link>
                    );
                }

                return (
                    <button
                        key={button.value}
                        onClick={button.onClick}
                        className={`${buttonClass} py-4 mb-2`}
                    >
                        <span className={`${textClass}`}>{button.icon}</span>
                        <span className={`${textClass}`}>{button.label}</span>
                    </button>
                );
            })}
        </>
    );

    return menuContent;
};