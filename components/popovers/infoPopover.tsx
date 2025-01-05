'use client'

import { Popover } from "@mantine/core"
import { forwardRef } from "react";
import { GoInfo } from "react-icons/go";


export const MyInfoIcon = forwardRef<HTMLDivElement>(
    (props, ref) => (
        <div ref={ref} {...props} className='cursor-pointer'>
            <GoInfo />
        </div>
    )
);

MyInfoIcon.displayName = 'MyInfoIcon';

export default function InfoPopover({ width, title, infoOne, infoTwo }: { width: number, title: string, infoOne: string, infoTwo: string }) {
    return (
        <div className='flex flex-row justify-between items-center px-2 space-x-2'>
            <Popover width={width > 500 ? 500 : width - 50} position='bottom-start' withArrow shadow="md">
                <Popover.Target>
                    <MyInfoIcon />
                </Popover.Target>
                <Popover.Dropdown styles={{ dropdown: { backgroundColor: 'GrayText', color: 'white' } }}>
                    <p className="pb-2">{infoOne}</p>
                    <p>{infoTwo}</p>
                </Popover.Dropdown>
            </Popover>
            <p>{title}</p>
        </div>
    )
}