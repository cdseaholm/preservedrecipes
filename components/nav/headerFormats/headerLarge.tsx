'use client'

import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { Menu, Divider, UnstyledButton } from "@mantine/core";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, JSX } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "sonner";

const LargeUserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <UnstyledButton
            ref={ref}
            size={20}
            className="bg-transparent"
            {...others}
        >
            <FaRegUserCircle size={28} />
        </UnstyledButton>
    )
);
LargeUserButton.displayName = 'LargeUserButton'

export function HeaderLargeShort({ handleZoomClick, handleZoomClose, handleColorPicker, profile, firstName, recipes, recipeText, fam, familyText, communities, communityText, setOpenSignOutModal, signOut, setSignInModal, setRegisterModal, session }: { handleZoomClick: () => void; handleZoomClose: () => void; handleColorPicker: () => void; profile: React.ReactNode; firstName: string | null; recipes: React.ReactNode; recipeText: string; fam: React.ReactNode; familyText: string; communities: React.ReactNode; communityText: string; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, setRegisterModal: (open: boolean) => void, session: Session | null }) {

    const pathname = usePathname()
    const router = useRouter();
    const width = useStateStore(state => state.widthQuery);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);

    return (
        <nav className="flex flex-row justify-end items-center w-2/3 space-x-8">
            <Link href={'/about'}>
                About
            </Link>
            <button onClick={handleColorPicker}>
                Color Picker
            </button>
            <button onClick={() => toast.info(`You'd go to the Pricing page right now!`)}>
                Pricing
            </button>
            {session ? (
                <Menu
                    shadow="md"
                    width={width / 1.5}
                    withArrow
                    arrowSize={12}
                    arrowOffset={-2}
                    onOpen={handleZoomClick}
                    onClose={handleZoomClose}
                >
                    <Menu.Target>
                        <LargeUserButton />
                    </Menu.Target>
                    <Menu.Dropdown
                        style={{ border: '1px solid #716040', outlineOffset: '-2px' }}
                    >
                        <Menu.Label>
                            {!firstName ? 'User Specific' : `Hello ${firstName}!`}
                        </Menu.Label>
                        <Divider />
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Item onClick={() => router.push('/profile')} leftSection={profile} disabled={pathname.includes('/profile') ? true : false} style={{ textDecoration: `${pathname.includes('/profile') ? 'underline' : ''}` }}>
                                Profile
                            </Menu.Item>
                            <Menu.Item onClick={() => {
                                setOpenSignOutModal(true);
                                handleZoomClick();
                            }} leftSection={signOut}>
                                Sign Out
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Item onClick={() => setOpenCreateRecipeModal(true)} leftSection={recipes}>
                                {recipeText}
                            </Menu.Item>
                            <Menu.Item onClick={() => toast.info("Communities")} leftSection={communities}>
                                {communityText}
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-start px-2 items-center w-full">
                            <Menu.Item onClick={() => router.push('Fam')} leftSection={fam}>
                                {familyText}
                            </Menu.Item>
                        </div>
                        <Divider />
                    </Menu.Dropdown>
                </Menu>
            ) : (
                <>
                    <button onClick={() => {
                        setSignInModal(true);
                        handleZoomClick();
                    }}>
                        Sign In
                    </button>
                    <button onClick={() => setRegisterModal(true)}>
                        Register
                    </button>
                </>
            )}
        </nav>
    )
}

export function HeaderLargeNotShort({ handleZoomClick, handleZoomClose, handleColorPicker, profile, firstName, recipes, recipeText, fam, familyText, communities, communityText, setOpenSignOutModal, signOut, setSignInModal, setRegisterModal, session }: { handleZoomClick: () => void; handleZoomClose: () => void; handleColorPicker: () => void; profile: React.ReactNode; firstName: string | null; recipes: React.ReactNode; recipeText: string; fam: React.ReactNode; familyText: string; communities: React.ReactNode; communityText: string; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, setRegisterModal: (open: boolean) => void, session: Session | null }) {

    const pathname = usePathname()
    const router = useRouter();
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);

    return (
        <nav className="flex flex-row justify-end items-center w-2/3 space-x-8">
            <Link href={'/about'}>
                About
            </Link>
            <button onClick={handleColorPicker}>
                Color Picker
            </button>
            <button onClick={() => toast.info(`You'd go to the Pricing page right now!`)}>
                Pricing
            </button>
            {session ? (
                <Menu
                    shadow="md"
                    width={300}
                    withArrow
                    arrowSize={12}
                    arrowOffset={-2}
                    onOpen={handleZoomClick}
                    onClose={handleZoomClose}
                >
                    <Menu.Target>
                        <LargeUserButton />
                    </Menu.Target>
                    <Menu.Dropdown
                        style={{ border: '1px solid #716040', outlineOffset: '-2px' }}
                    >
                        <Menu.Label>
                            {!firstName ? 'User Specific' : `Hello ${firstName}!`}
                        </Menu.Label>
                        <Divider />
                        <Menu.Item onClick={() => router.push('/profile')} leftSection={profile} disabled={pathname.includes('/profile') ? true : false} style={{ textDecoration: `${pathname.includes('/profile') ? 'underline' : ''}` }}>
                            Profile
                        </Menu.Item>
                        <Menu.Item onClick={() => setOpenCreateRecipeModal(true)} leftSection={recipes}>
                            {recipeText}
                        </Menu.Item>
                        <Menu.Item onClick={() => router.push('Fam')} leftSection={fam}>
                            {familyText}
                        </Menu.Item>
                        <Menu.Item onClick={() => toast.info("Communities")} leftSection={communities}>
                            {communityText}
                        </Menu.Item>
                        <Divider />
                        <Menu.Item onClick={() => {
                            setOpenSignOutModal(true);
                            handleZoomClick();
                        }} leftSection={signOut}>
                            Sign Out
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            ) : (
                <>
                    <button onClick={() => {
                        setSignInModal(true);
                        handleZoomClick();
                    }}>
                        Sign In
                    </button>
                    <button onClick={() => setRegisterModal(true)}>
                        Register
                    </button>
                </>
            )}
        </nav>
    )
}