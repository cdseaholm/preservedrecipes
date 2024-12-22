'use client'

import { useStateStore } from "@/context/stateStore";
import { Menu, Divider, UnstyledButton } from "@mantine/core";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, JSX } from "react";
import { FiMenu } from "react-icons/fi";
import { toast } from "sonner";

const UserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <UnstyledButton
            ref={ref}
            size={28}
            className="bg-transparent"
            {...others}
        >
            <FiMenu size={28} />
        </UnstyledButton>
    )
);
UserButton.displayName = 'UserButton';

export function HeaderSmallShort({ handleZoomClick, handleZoomClose, handleColorPicker, profile, firstName, recipes, recipeText, fam, familyText, communities, communityText, setOpenSignOutModal, signOut, setSignInModal, signIn, setRegisterModal, session }: { handleZoomClick: () => void; handleZoomClose: () => void; handleColorPicker: () => void; profile: React.ReactNode; firstName: string | null; recipes: React.ReactNode; recipeText: string; fam: React.ReactNode; familyText: string; communities: React.ReactNode; communityText: string; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, signIn: JSX.Element, setRegisterModal: (open: boolean) => void, session: Session | null }) {

    const router = useRouter();
    const width = useStateStore(state => state.widthQuery);
    const rightLabel = !firstName ? 'Hello!' : `Hello ${firstName}!`

    return (
        <nav className="flex flex-row items-center justify-end w-1/3">
            <Menu
                shadow="md"
                width={width - 10}
                withArrow
                arrowSize={12}
                arrowOffset={-2}
                onOpen={handleZoomClick}
                onClose={handleZoomClose}
            >
                <Menu.Target>
                    <UserButton />
                </Menu.Target>
                {session ? (
                    <Menu.Dropdown
                        style={{ border: '1px solid #716040', outlineOffset: '-2px' }}
                    >
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Label>
                                {rightLabel}
                            </Menu.Label>
                            <Menu.Label>
                                {`PreservedRecipes Specific`}
                            </Menu.Label>
                        </div>
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Item onClick={() => router.push('/profile')} leftSection={profile}>
                                Profile
                            </Menu.Item>
                            <Menu.Item>
                                <Link href={'/about'}>
                                    About
                                </Link>
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Item onClick={() => toast.info("Recipes!")} leftSection={recipes}>
                                {recipeText}
                            </Menu.Item>
                            <Menu.Item onClick={handleColorPicker}>
                                Color Picker
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Item onClick={() => router.push('Fam')} leftSection={fam}>
                                {familyText}
                            </Menu.Item>
                            <Menu.Item onClick={() => toast.info("Looking at Pricing!")}>
                                Pricing
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-end px-2 items-center w-full">
                            <Menu.Item onClick={() => toast.info("Communities")} leftSection={communities}>
                                {communityText}
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-end px-2 items-center w-full">
                            <Menu.Item onClick={() => {
                                setOpenSignOutModal(true)
                                handleZoomClick();
                            }} leftSection={signOut}>
                                Sign Out
                            </Menu.Item>
                        </div>
                    </Menu.Dropdown>
                ) : (
                    <Menu.Dropdown
                        style={{ border: '1px solid #716040', outlineOffset: '-2px' }}
                    >
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Label>
                                {`PreservedRecipes Specific`}
                            </Menu.Label>
                            <Menu.Label>
                                {`User Specific`}
                            </Menu.Label>
                        </div>
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Item>
                                <Link href={'/about'}>
                                    About
                                </Link>
                            </Menu.Item>
                            <Menu.Item onClick={() => {
                                setSignInModal(true);
                                handleZoomClick();
                            }} leftSection={signIn}>
                                Sign In
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-between px-2 items-center w-full">
                            <Menu.Item onClick={handleColorPicker}>
                                Color Picker
                            </Menu.Item>
                            <Menu.Item onClick={() => setRegisterModal(true)}>
                                Register
                            </Menu.Item>
                        </div>
                        <div className="flex flex-row justify-start px-2 items-center w-full">
                            <Menu.Item onClick={() => toast.info("Looking at Pricing!")}>
                                Pricing
                            </Menu.Item>
                        </div>
                    </Menu.Dropdown>
                )}
            </Menu>
        </nav>
    )
}

export function HeaderSmallNotShort({ handleZoomClick, handleZoomClose, handleColorPicker, profile, firstName, recipes, recipeText, fam, familyText, communities, communityText, setOpenSignOutModal, signOut, setSignInModal, signIn, setRegisterModal, session }: { handleZoomClick: () => void; handleZoomClose: () => void; handleColorPicker: () => void; profile: React.ReactNode; firstName: string | null; recipes: React.ReactNode; recipeText: string; fam: React.ReactNode; familyText: string; communities: React.ReactNode; communityText: string; setOpenSignOutModal: (open: boolean) => void; signOut: JSX.Element; setSignInModal: (open: boolean) => void, signIn: JSX.Element, setRegisterModal: (open: boolean) => void, session: Session | null }) {

    const router = useRouter();

    return (
        <nav className="flex flex-row items-center justify-end w-1/3">
            <Menu
                shadow="md"
                width={250}
                withArrow
                arrowSize={12}
                arrowOffset={-2}
                onOpen={handleZoomClick}
                onClose={handleZoomClose}
            >
                <Menu.Target>
                    <UserButton />
                </Menu.Target>
                <Menu.Dropdown
                    style={{ border: '1px solid #716040', outlineOffset: '-2px' }}
                >
                    <Menu.Label>
                        PreservedRecipes Specific
                    </Menu.Label>
                    <Menu.Item>
                        <Link href={'/about'}>
                            About
                        </Link>
                    </Menu.Item>
                    <Menu.Item onClick={handleColorPicker}>
                        Color Picker
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info("Looking at Pricing!")}>
                        Pricing
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>
                        {!firstName ? 'User Specific' : `Hello ${firstName}!`}
                    </Menu.Label>
                    <Divider />
                    {session ? (
                        <>
                            <Menu.Item onClick={() => router.push('/profile')} leftSection={profile}>
                                Profile
                            </Menu.Item>
                            <Menu.Item onClick={() => toast.info("Recipes!")} leftSection={recipes}>
                                {recipeText}
                            </Menu.Item>
                            <Menu.Item onClick={() => router.push('Fam')} leftSection={fam}>
                                {familyText}
                            </Menu.Item>
                            <Menu.Item onClick={() => toast.info("Communities")} leftSection={communities}>
                                {communityText}
                            </Menu.Item>
                            <Menu.Item onClick={() => {
                                setOpenSignOutModal(true)
                                handleZoomClick();
                            }} leftSection={signOut}>
                                Sign Out
                            </Menu.Item>
                        </>
                    ) : (
                        <>
                            <Menu.Item onClick={() => {
                                setSignInModal(true);
                                handleZoomClick();
                            }} leftSection={signIn}>
                                Sign In
                            </Menu.Item>
                            <Menu.Item onClick={() => setRegisterModal(true)}>
                                Register
                            </Menu.Item>
                        </>
                    )}
                </Menu.Dropdown>
            </Menu>
        </nav>
    )
}