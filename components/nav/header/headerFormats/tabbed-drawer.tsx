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
                padding={0}
                w={"100%"}
                h={"100vh"}
                size={size}
                title={
                    <p className="text-lg font-semibold underline">
                        {`Preserved Recipes Menu`}
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
                        backgroundImage: 'url(/images/old-paper.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
                        overflow: 'hidden',
                    },
                    body: {
                        paddingTop: 12,
                        height: '100%',
                        backgroundColor: 'rgba(250, 244, 232, 0.7)'
                    },
                    header: {
                        backgroundColor: 'rgba(187, 151, 121, 1)',
                        borderBottom: '2px solid rgba(105, 75, 51, 0.3)',
                        paddingInline: '20px'
                    }
                }}
            >

                <ScrollArea h="calc(100vh - 60px)" px="md" w={"100%"}>
                    <div className="flex flex-col justify-start items-center w-full h-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.10),inset_0_-2px_8px_rgba(0,0,0,0.10)] overflow-x-hidden rounded-md p-1">
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
                className={`group w-1/2 cursor-pointer rounded-bl-xl min-h-[50px] flex flex-row items-end justify-center transition-all group-hover:text-mainText/60`}
                onClick={() => handleMenuToggle('main')}
                aria-label="Site Navigation"
                title="Site Navigation"
            >
                <div className="flex flex-col items-end justify-center w-full">
                    <HiOutlineMenu size={24} className="text-mainText group-hover:text-mainText/70 my-1" />
                    <span className="text-[10px] mb-1 font-medium text-mainText/80 group-hover:text-mainText/60">
                        Menu
                    </span>
                </div>

            </button>
        </>
    );
}