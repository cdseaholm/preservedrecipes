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

export default function MainHeader() {
    const { data: session } = useSession();
    const widthQuery = useStateStore((state) => state.widthQuery);
    const isMediumScreenOrLess = widthQuery < 768;

    return (
        <header className="bg-white w-full text-black w-screen h-fit">
            {isMediumScreenOrLess ? (
                <SmallHeader session={session} />
            ) : (
                <LargeHeader session={session} />
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

function SmallHeader({ session }: { session: Session | null }) {

    const router = useRouter();
    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    let firstName = userName ? userName.split(' ')[0] : null;
    const setSignInModal = useModalStore(state => state.setOpenSignInModal);
    const setOpenSignOutModal = useModalStore(state => state.setOpenSignOutModal);
    const setRegisterModal = useModalStore(state => state.setOpenRegisterModal)

    return (
        <div className="flex flex-row justify-between items-center px-5 py-2 w-full border-b border-neutral-300">
            <section className="text-base font-bold">
                PreservedRecipes Image Here
            </section>
            <nav>
                <Menu shadow="md" width={150}>
                    <Menu.Target>
                        <UserButton />
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>
                            PreservedRecipes Specific
                        </Menu.Label>
                        <Menu.Item onClick={() => toast.info("Let's learn about VacayAI!")}>
                            About
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
                                <Menu.Item onClick={() => router.push('/profile')}>
                                    Profile
                                </Menu.Item>
                                <Menu.Item onClick={() => toast.info("Creating Vacay!")}>
                                    Create New Recipe
                                </Menu.Item>
                                <Menu.Item onClick={() => setOpenSignOutModal(true)}>
                                    Sign Out
                                </Menu.Item>
                            </>
                        ) : (
                            <>
                                <Menu.Item onClick={() => setSignInModal(true)}>
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
        </div>
    )
}

function LargeHeader({ session }: { session: Session | null }) {

    const router = useRouter();
    let user = session ? session.user as User : {} as User;
    let userName = user ? user.name : '';
    let firstName = userName ? userName.split(' ')[0] : null;
    const setSignInModal = useModalStore(state => state.setOpenSignInModal);
    const setOpenSignOutModal = useModalStore(state => state.setOpenSignOutModal);
    const setRegisterModal = useModalStore(state => state.setOpenRegisterModal)

    return (
        <div className="flex flex-row justify-between items-center px-12 py-2 w-full border-b border-neutral-300 bg-gray-50">
            <section className="text-base font-bold">
                PreservedRecipes
            </section>
            <nav className="flex flex-row justify-end items-center w-1/3 space-x-8">
                <button onClick={() => toast.info(`You'd go to the About page right now!`)}>
                    About
                </button>
                <button onClick={() => toast.info(`You'd go to the Pricing page right now!`)}>
                    Pricing
                </button>
                {session ? (
                    <Menu shadow="md" width={150}>
                        <Menu.Target>
                            <LargeUserButton />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>
                                {!firstName ? 'User Specific' : `Hello ${firstName}!`}
                            </Menu.Label>
                            <Divider />
                            <Menu.Item onClick={() => router.push('/profile')}>
                                Profile
                            </Menu.Item>
                            <Menu.Item onClick={() => toast.info("Creating Vacay!")}>
                                Create New Recipe
                            </Menu.Item>
                            <Menu.Item onClick={() => setOpenSignOutModal(true)}>
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
        </div>
    )
}