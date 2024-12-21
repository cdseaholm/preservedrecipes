'use client'

import { useStateStore } from "@/context/stateStore"
import { Divider, Group, Menu, UnstyledButton } from "@mantine/core";
import { forwardRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useModalStore } from "@/context/modalStore";
import { useSession } from "next-auth/react";
import { Session, User } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { AiOutlineProfile } from "react-icons/ai";
import { GiFamilyTree } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import { PiCookieThin } from "react-icons/pi"
import { useUserStore } from "@/context/userStore";
import { IRecipe } from "@/models/types/recipe";

export default function MainHeader() {
    const { data: session } = useSession();
    const userInfo = useUserStore(state => state.userInfo);
    const recipes = userInfo ? userInfo.recipes as IRecipe[] : [] as IRecipe[];
    const familyID = userInfo ? userInfo.familyID as string : '';
    const communities = userInfo ? userInfo.communityIDs as string[] : [] as string[];
    const recipeText = recipes && recipes.length > 0 ? 'Your Recipes' : 'Create a Recipe';
    const familyText = familyID && familyID !== '' ? 'Your Family' : 'Create or Join a family';
    const communityText = communities && communities.length > 0 ? 'Your Communities' : 'Join a Community';
    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;
    const setColorPickerMode = useStateStore(state => state.setColorPickerMode);
    const colorPickerMode = useStateStore(state => state.colorPickerMode);

    const handleColorPicker = () => {
        setColorPickerMode(!colorPickerMode)
    }

    return (
        <header className={`bg-mainBack w-full flex flex-row justify-between items-center px-5 border-b border-accent text-mainText sticky top-0 z-30 ${isMediumScreenOrLess ? "px-5 py-2" : 'px-12 py-2'}`} style={{ height: '7vh' }}>
            <section className="text-base font-bold">
                <Link href={'/'}>
                    {isMediumScreenOrLess ? 'PreservedRecipes Image Here' : 'PreservedRecipes'}
                </Link>
            </section>
            {isMediumScreenOrLess ? (
                <SmallHeader session={session} recipeText={recipeText} familyText={familyText} communityText={communityText} handleColorPicker={handleColorPicker} />
            ) : (
                <LargeHeader session={session} recipeText={recipeText} familyText={familyText} communityText={communityText} handleColorPicker={handleColorPicker} />
            )}
        </header>
    )
}

const UserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <UnstyledButton
            ref={ref}
            className="bg-transparent"
            {...others}
        >
            <Group>
                <FiMenu />
            </Group>
        </UnstyledButton>
    )
);
UserButton.displayName = 'UserButton';

const LargeUserButton = forwardRef<HTMLButtonElement>(
    ({ ...others }, ref) => (
        <UnstyledButton
            ref={ref}
            className="bg-transparent"
            {...others}
        >
            <Group>
                <FaRegUserCircle size={20} />
            </Group>
        </UnstyledButton>
    )
);
LargeUserButton.displayName = 'LargeUserButton'

const signOut = (
    <GoSignOut color="red" />
)

const signIn = (
    <GoSignIn color="blue" />
)

const profile = (
    <AiOutlineProfile />
)

const fam = (
    <GiFamilyTree />
)

const recipes = (
    <PiCookieThin />
)

const communities = (
    <RiCommunityLine />
)

function SmallHeader({ session, recipeText, familyText, communityText, handleColorPicker }: { session: Session | null, recipeText: string, familyText: string, communityText: string, handleColorPicker: () => void }) {

    const router = useRouter();
    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    let firstName = userName ? userName.split(' ')[0] : null;
    const setSignInModal = useModalStore(state => state.setOpenSignInModal);
    const setOpenSignOutModal = useModalStore(state => state.setOpenSignOutModal);
    const setRegisterModal = useModalStore(state => state.setOpenRegisterModal);

    return (
        <nav>
            <Menu
                shadow="md"
                width={250}
                withArrow
                arrowSize={12}
                arrowOffset={-2}
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
                            <Menu.Item onClick={() => setOpenSignOutModal(true)} leftSection={signOut}>
                                Sign Out
                            </Menu.Item>
                        </>
                    ) : (
                        <>
                            <Menu.Item onClick={() => setSignInModal(true)} leftSection={signIn}>
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

function LargeHeader({ session, recipeText, familyText, communityText, handleColorPicker }: { session: Session | null, recipeText: string, familyText: string, communityText: string, handleColorPicker: () => void }) {

    const router = useRouter();
    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    let firstName = userName ? userName.split(' ')[0] : null;
    const setSignInModal = useModalStore(state => state.setOpenSignInModal);
    const setOpenSignOutModal = useModalStore(state => state.setOpenSignOutModal);
    const setRegisterModal = useModalStore(state => state.setOpenRegisterModal);

    return (
        <nav className="flex flex-row justify-end items-center w-1/3 space-x-8">
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
                        <Divider />
                        <Menu.Item onClick={() => setOpenSignOutModal(true)} leftSection={signOut}>
                            Sign Out
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            ) : (
                <>
                    <button onClick={() => setSignInModal(true)}>
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