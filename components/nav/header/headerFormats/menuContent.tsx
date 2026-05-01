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
import { toast } from "sonner";
import { useStateStore } from "@/context/stateStore";

const recipes = <PiCookieThin />;
const communities = <RiCommunityLine />;
const fam = <GiFamilyTree />;

export default function MenuContent({ session, profile, signOutElement, signIn, userData, closeDrawer }: { profile: React.ReactNode; signOutElement: JSX.Element; session: Session | null, signIn: JSX.Element | null, userData: IUser | null, closeDrawer: () => void }) {

    const { handleSignOutClick, handleSignInClick } = MenuPanelHooks();
    const setIsNavigating = useStateStore(state => state.setIsNavigating);
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
        session && { value: 'Recipes', label: 'Recipes', icon: recipes, href: '/u/recipes' },
        session && userData?.userFamilyID && { value: 'Family', label: 'Family', icon: fam, href: familyRoute },
        { value: 'Communities', label: 'Communities', icon: communities, href: '/communities' },
        { value: 'About', label: 'About', icon: <MdInfoOutline />, href: '/about' },
        { value: 'Pricing', label: 'Pricing', icon: <MdOutlineAttachMoney />, href: '/pricing' }
    ];

    const authButtons = [
        session && { value: 'Profile', label: 'Profile', icon: profile, href: '/u/profile' },
        session && { value: 'SignOut', label: 'Sign Out', icon: signOutElement, onClick: () => { handleSignOutClick(); closeDrawer(); } },
        !session && { value: 'SignIn', label: 'Sign In', icon: signIn, onClick: () => { handleSignInClick(); closeDrawer(); } },
        !session && { value: 'Register', label: 'Register', icon: <TfiWrite />, href: '/register' },
    ];

    const buttonClass = `flex flex-row items-center px-6 hover:bg-accent/20 rounded-md space-x-2 w-full cursor-pointer`;
    const textClass = `text-base md:text-lg lg:text-xl font-medium`;
    const disabledButtonClass = `flex flex-row items-center px-6 rounded-md space-x-2 w-full bg-gray-300/50`;
    const disabledTextClass = `text-base md:text-lg lg:text-xl font-medium text-gray-500`;

    const menuContent = (
        <>
            {homeButton.map((button) => (
                button && <Link key={button.value} href={button.href} onClick={handleNavigationClick} className={`${buttonClass} mt-4 py-4 w-full`}>
                    <span className={`${textClass}`}>{button.icon}</span>
                    <span className={`${textClass}`}>{button.label}</span>
                </Link>
            ))}
            <Divider my={'md'} c={'dark'} w={'100%'} h={'1px'} style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
            }} />
            {buttons.map((button) => (
                button && (
                    /**(button.value === 'Family' || button.value === 'Communities')*/
                    (button.value === 'Communities') ? (
                        <button key={button.value} onClick={() => toast.info('Communities is under construction')} className={`${disabledButtonClass} py-4 mb-2`} disabled={true} title="Under Construction">
                            <span className={`${disabledTextClass}`}>{button.icon}</span>
                            <span className={`${disabledTextClass}`}>{button.label}</span>
                        </button>
                    ) : (
                        <Link key={button.value} href={button.href} onClick={handleNavigationClick} className={`${buttonClass} py-4 mb-2`}>
                            <span className={`${textClass}`}>{button.icon}</span>
                            <span className={`${textClass}`}>{button.label}</span>
                        </Link>
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
                            onClick={handleNavigationClick}
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
