'use client'

import { Divider } from "@mantine/core";
import { Session } from "next-auth";
import { JSX, MouseEvent } from "react";
import { PiCookieThin } from "react-icons/pi";
import MenuPanelHooks from "@/components/hooks/menu/menu-panel-hooks";
import { GiFamilyTree } from "react-icons/gi";
import { MdHome, MdInfoOutline, MdOutlineAttachMoney } from "react-icons/md";
import { RiCommunityLine } from "react-icons/ri";
import { TfiWrite } from "react-icons/tfi";
import { IUser } from "@/models/types/personal/user";
import Link from "next/link";
import { useStateStore } from "@/context/stateStore";

const recipes = <PiCookieThin />;
const communities = <RiCommunityLine />;
const fam = <GiFamilyTree />;

export default function MenuContent({ session, profile, signOutElement, signIn, userData, closeDrawer }: { profile: React.ReactNode; signOutElement: JSX.Element; session: Session | null, signIn: JSX.Element | null, userData: IUser | null, closeDrawer: () => void }) {

    const { handleSignOutClick, handleSignInClick } = MenuPanelHooks();
    const setIsNavigating = useStateStore(state => state.setIsNavigating);
    const isAuthenticated = Boolean(session || userData?._id);
    const familyRoute = userData ? `/family/${userData.userFamilyID}` : '/'

    const handleNavigationClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
        ) {
            return;
        }

        setIsNavigating(true);
        closeDrawer();
    };

    const homeButton = [
        { value: 'Home', label: 'Home', icon: <MdHome />, href: '/' }
    ]

    const buttons = [
        isAuthenticated && { value: 'Recipes', label: 'Recipes', icon: recipes, href: '/u/recipes' },
        isAuthenticated && userData?.userFamilyID && { value: 'Family', label: 'Family', icon: fam, href: familyRoute },
        { value: 'Communities', label: 'Communities', icon: communities, href: '/communities' },
        { value: 'About', label: 'About', icon: <MdInfoOutline />, href: '/about' },
        { value: 'Pricing', label: 'Pricing', icon: <MdOutlineAttachMoney />, href: '/pricing' }
    ];

    const authButtons = [
        isAuthenticated && { value: 'Profile', label: 'Profile', icon: profile, href: '/u/profile' },
        isAuthenticated && { value: 'SignOut', label: 'Sign Out', icon: signOutElement, onClick: () => { handleSignOutClick(); closeDrawer(); } },
        !isAuthenticated && { value: 'SignIn', label: 'Sign In', icon: signIn, onClick: () => { handleSignInClick(); closeDrawer(); } },
        !isAuthenticated && { value: 'Register', label: 'Register', icon: <TfiWrite />, href: '/register' },
    ];

    const buttonClass = `flex flex-row items-center px-6 hover:bg-accent/20 rounded-md space-x-2 w-full cursor-pointer`;
    const textClass = `text-base md:text-lg lg:text-xl font-medium`;
    //const disabledButtonClass = `flex flex-row items-center px-6 rounded-md space-x-2 w-full bg-gray-300/50`;
    //const disabledTextClass = `text-base md:text-lg lg:text-xl font-medium text-gray-500`;

    const menuContent = (
        <>
            {homeButton.map((button) => (
                button && <Link key={button.value} href={button.href} onClick={handleNavigationClick} className={`${buttonClass} mt-4 py-4 w-full`}>
                    <span className={`${textClass}`} aria-hidden="true">{button.icon}</span>
                    <span className={`${textClass}`}>{button.label}</span>
                </Link>
            ))}
            <Divider my={'md'} c={'dark'} w={'100%'} h={'1px'} style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
            }} />
            {buttons.map((button) => (
                button && (
                    <Link key={button.value} href={button.href} onClick={handleNavigationClick} className={`${buttonClass} py-4 mb-2`}>
                        <span className={`${textClass}`} aria-hidden="true">{button.icon}</span>
                        <span className={`${textClass}`}>{button.label}</span>
                    </Link>
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
                            onClick={handleNavigationClick}
                            className={`${buttonClass} py-4 mb-2`}
                        >
                            <span className={`${textClass}`} aria-hidden="true">{button.icon}</span>
                            <span className={`${textClass}`}>{button.label}</span>
                        </Link>
                    );
                }

                return (
                    <button
                        key={button.value}
                        type="button"
                        onClick={button.onClick}
                        aria-label={button.label}
                        className={`${buttonClass} py-4 mb-2`}
                    >
                        <span className={`${textClass}`} aria-hidden="true">{button.icon}</span>
                        <span className={`${textClass}`}>{button.label}</span>
                    </button>
                );
            })}
        </>
    );

    return menuContent;
};
