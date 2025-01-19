'use client'

import { useStateStore } from "@/context/stateStore";
import { Popover } from "@mantine/core"
import { forwardRef } from "react";
import { GoInfo } from "react-icons/go";


export const MyInfoIcon = forwardRef<HTMLDivElement, { title: string }>(
    ({ title, ...props }, ref) => (
        <div ref={ref} {...props} className='cursor-pointer flex flex-row justify-evenly items-center w-full h-full space-x-2'>
            <GoInfo />
            <p>{title}</p>
        </div>
    )
);

MyInfoIcon.displayName = 'MyInfoIcon';

export default function InfoPopover({ title, infoOne, infoTwo }: { title: string, infoOne: string, infoTwo: string }) {

    const width = useStateStore(s => s.widthQuery);

    return (
        <div className='flex flex-row justify-between items-center px-2 space-x-2'>
            <Popover width={width > 500 ? 500 : width - 50} position='bottom-start' withArrow shadow="md">
                <Popover.Target>
                    <MyInfoIcon title={title} />
                </Popover.Target>
                <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
                    <p className="pb-2">{infoOne}</p>
                    <p>{infoTwo}</p>
                </Popover.Dropdown>
            </Popover>
        </div>
    )
}