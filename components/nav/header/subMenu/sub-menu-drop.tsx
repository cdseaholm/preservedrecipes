'use client'

import { useWindowSizes } from "@/context/width-height-store";
import { Menu } from "@mantine/core"
import { BsLightningCharge } from "react-icons/bs";

export default function SubMenuDrop({ subMenu }: { subMenu: { title: string, onClick: () => void, textClass: string, buttonClass: string, label: string }[] }) {

    const { width } = useWindowSizes();

    const groupedItems = subMenu.reduce((acc, item) => {
        if (!acc[item.label]) {
            acc[item.label] = [];
        }
        acc[item.label].push(item);
        return acc;
    }, {} as Record<string, typeof subMenu>);

    const capitalizeLabel = (label: string) => label.charAt(0).toUpperCase() + label.slice(1);
    const dropdownWidth = width > 500 ? '20rem' : '80dvw';

    return (
        <Menu shadow="md" width={dropdownWidth} variant="light" position="bottom-start">
            <Menu.Target>
                <div className="flex flex-col items-center justify-center py-1 px-2 w-1/4 sm:w-1/5 md:w-1/6 lg:w-1/8 rounded-md bg-accent/20 hover:bg-accent/40 cursor-pointer">
                    <BsLightningCharge />
                    <span className="text-xs">Actions</span>
                </div>
            </Menu.Target>

            <Menu.Dropdown w={dropdownWidth} bg={'white'} p={0} classNames={{ dropdown: 'border-0 p-0' }} style={{borderRadius: '8px'}}>
                <div className="flex flex-col justify-start items-start w-full bg-accent/10 border border-accent/30 rounded-md py-2 px-2 space-y-2">
                    {Object.entries(groupedItems).map(([label, items]) => (
                        <div key={label} className="w-full">
                            <Menu.Label>
                                <p className="text-sm font-semibold text-gray-500 underline mt-2">
                                    {capitalizeLabel(label)}
                                </p>
                            </Menu.Label>
                            <div className="flex flex-col w-full items-center justify-start bg-gray-200/50 inset-shadow-sm rounded-md space-y-2 py-2 px-1">
                                {items.map((button, index) => (
                                    <Menu.Item key={index} className={button.buttonClass} w={'100%'} onClick={button.onClick}>
                                        {button.title}
                                    </Menu.Item>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Menu.Dropdown>
        </Menu>
    )
}