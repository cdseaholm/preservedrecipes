'use client'

import { useStateStore } from "@/context/stateStore"
import { Divider, Group, Menu, UnstyledButton } from "@mantine/core";
import { forwardRef } from "react";
import { FiMenu } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoSignOut } from "react-icons/go";
import { AiOutlineProfile } from "react-icons/ai";
import { GiFamilyTree } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import { PiCookieThin } from "react-icons/pi"

export default function MainHeaderMock() {

    const router = useRouter();
    const { data: session } = useSession();
    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;

    const handleExitColorPicker = () => {
        router.replace('/')
    }

    const handleAboutClick = () => {
        router.push('/?section=about-section');
    };

    return (
        <header className={`bg-mainBack w-full flex flex-row justify-between items-center px-5 border-b border-accent text-mainText sticky top-0 z-30 ${isMediumScreenOrLess ? "px-5 py-2" : 'px-12 py-2'}`} style={{ height: '7vh' }}>
            <section className="text-base font-bold">
                <Link href={'/'}>
                    {isMediumScreenOrLess ? 'PreservedRecipes Image Here' : 'PreservedRecipes'}
                </Link>
            </section>
            {isMediumScreenOrLess ? (
                <SmallHeader session={session} recipeText={'Create a Recipe'} familyText={'See your family Tree'} communityText={'See your communities'} handleColorPicker={handleExitColorPicker} handleAboutClick={handleAboutClick} />
            ) : (
                <LargeHeader session={session} recipeText={'Create a Recipe'} familyText={'See your family Tree'} communityText={'See your communities'} handleColorPicker={handleExitColorPicker} handleAboutClick={handleAboutClick} />
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
            aria-label="Menu"
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
            aria-label="User Menu"
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

function SmallHeader({ recipeText, familyText, communityText, handleColorPicker, handleAboutClick }: { session: Session | null, recipeText: string, familyText: string, communityText: string, handleColorPicker: () => void, handleAboutClick: () => void }) {

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
                    <Menu.Label aria-label="Home">
                        PreservedRecipes Specific
                    </Menu.Label>
                    <Menu.Item onClick={handleAboutClick} aria-label="About">
                        About
                    </Menu.Item>
                    <Menu.Item onClick={handleColorPicker} aria-label="Color Picker">
                        Color Picker
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info("You'd be looking at pricing!")} aria-label="Pricing">
                        Pricing
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>
                        {`Hello Fake User!`}
                    </Menu.Label>
                    <Divider />
                    <Menu.Item onClick={() => toast.info('You would go to your profile here')} leftSection={profile} aria-label="Profile">
                        Profile
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info("You'd see your recipes!")} leftSection={recipes} aria-label="Recipe">
                        {recipeText}
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info(`You'd see your family tree now`)} leftSection={fam} aria-label="Family">
                        {familyText}
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info("You'd see your communities here")} leftSection={communities} aria-label="Community">
                        {communityText}
                    </Menu.Item>
                    <Divider />
                    <Menu.Item onClick={() => toast.info(`You'd sign out now :(`)} leftSection={signOut} aria-label="Sign Out">
                        Sign Out
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </nav>
    )
}

function LargeHeader({ recipeText, familyText, communityText, handleColorPicker, handleAboutClick }: { session: Session | null, recipeText: string, familyText: string, communityText: string, handleColorPicker: () => void, handleAboutClick: () => void }) {

    return (
        <nav className="flex flex-row justify-end items-center w-1/3 space-x-8">
            <button onClick={handleAboutClick} aria-label="About"
            >
                About
            </button>
            <button onClick={handleColorPicker} aria-label="Color Picker">
                Color Picker
            </button>
            <button onClick={() => toast.info(`You'd go to the Pricing page right now!`)} aria-label="Pricing">
                Pricing
            </button>
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
                        {`Hello Fake User!`}
                    </Menu.Label>
                    <Divider />
                    <Menu.Item onClick={() => toast.info('You would go to your profile here')} leftSection={profile} aria-label="Profile">
                        Profile
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info("You'd see your recipes!")} leftSection={recipes} aria-label="Recipe">
                        {recipeText}
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info(`You'd see your family tree now`)} leftSection={fam} aria-label="Family">
                        {familyText}
                    </Menu.Item>
                    <Menu.Item onClick={() => toast.info("You'd see your communities here")} leftSection={communities} aria-label="Community">
                        {communityText}
                    </Menu.Item>
                    <Divider />
                    <Menu.Item onClick={() => toast.info(`You'd sign out now :(`)} leftSection={signOut} aria-label="Sign Out">
                        Sign Out
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </nav>
    )
}