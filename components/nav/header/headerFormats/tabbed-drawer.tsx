'use client';

import { Drawer, ScrollArea } from "@mantine/core";
import MenuContent from "./menuContent";
import { Session } from "next-auth";
import { JSX } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { IUser } from "@/models/types/personal/user";

export function TabbedDrawer({
    profile,
    signOutElement,
    signIn,
    session,
    widthQuery,
    handleMenuToggle,
    openMenu,
    userInfo
}: {
    profile: React.ReactNode;
    signOutElement: JSX.Element;
    signIn: JSX.Element;
    session: Session | null;
    widthQuery: number;
    handleMenuToggle: (menu: 'main' | 'sub' | null) => void;
    openMenu: 'main' | 'sub' | null;
    userInfo: IUser | null;

}) {

    const size = widthQuery < 600 ? '90%' : widthQuery < 900 ? '60%' : '50%';

    return (
        <>
            <Drawer
                opened={openMenu === 'main'}
                onClose={() => handleMenuToggle(null)}
                withCloseButton={true}
                closeButtonProps={{ 'aria-label': 'Close navigation menu' }}
                padding={0}
                w={"100%"}
                h={"100dvh"}
                size={size}
                title={
                    <p className="text-lg font-semibold underline text-navText">
                        {`RecipeSafe Menu`}
                    </p>
                }

                closeOnClickOutside={true}
                closeOnEscape={true}
                position={'right'}
                transitionProps={{
                    transition: 'slide-left',
                    duration: 300,
                    timingFunction: 'ease'
                }}
                styles={{
                    content: {
                        backgroundColor: 'var(--mainBack)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
                        overflow: 'hidden',
                    },
                    body: {
                        paddingTop: 12,
                        height: 'calc(100dvh - 60px)',
                        backgroundColor: 'var(--mainBack)',
                        overflow: 'hidden',
                    },
                    header: {
                        backgroundColor: 'var(--navBack)',
                        borderBottom: '2px solid color-mix(in srgb, var(--accent) 35%, transparent)',
                        paddingInline: '20px'
                    }
                }}
            >

                <ScrollArea h="calc(100dvh - 72px)" px="md" w={"100%"} type="auto" offsetScrollbars>
                    <div className="flex min-h-full flex-col justify-start items-center w-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)] overflow-x-hidden rounded-md p-1">
                        <MenuContent
                            profile={profile}
                            signOutElement={signOutElement}
                            session={session}
                            signIn={signIn}
                            userData={userInfo}
                            closeDrawer={() => handleMenuToggle(null)}
                        />
                    </div>
                </ScrollArea>
            </Drawer>

            {/* Tab Triggers - Icon-based */}
            <button
                type="button"
                className={`group w-1/2 cursor-pointer rounded-bl-xl min-h-[50px] flex flex-row items-end justify-end text-navText transition-all`}
                onClick={() => handleMenuToggle('main')}
                aria-label="Open site navigation"
                title="Open site navigation"
                aria-haspopup="dialog"
                aria-expanded={openMenu === 'main'}
            >
                <div className="mb-1 flex flex-col items-center justify-center rounded-md px-3 py-1 transition-colors group-hover:bg-white/10">
                    <HiOutlineMenu size={24} className="text-navText group-hover:text-navTextMuted my-1" aria-hidden="true" />
                    <span className="text-[10px] font-medium text-navTextMuted group-hover:text-navText">
                        Menu
                    </span>
                </div>

            </button>
        </>
    );
}
