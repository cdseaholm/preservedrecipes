'use client'

import { Menu } from "@mantine/core";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export default function TabsList({ width, parentTabs, handleParentChange, currentChildTabs, activeParentIndex, chevron, handleChevron, handleTab }: { width: number, parentTabs: string[], handleParentChange: (value: number) => void, currentChildTabs: string[], activeParentIndex: number, chevron: boolean, handleChevron: () => void, handleTab: (index: number) => void }) {

    return (
        <div className="flex flex-row justify-evenly items-center w-content h-content space-x-4">
            {parentTabs.map((parentTab, index) => {
                const active = activeParentIndex === index && chevron;
                return (
                    <Menu key={index} offset={0} onClose={() => handleChevron()} onOpen={() => handleChevron()}>
                        <Menu.Target>
                            <button
                                style={{
                                    fontSize: `${width < 640 && width > 415 ? '14px' : width < 415 ? '12px' : '16px'}`,
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px'
                                }}
                                onClick={() => handleParentChange(index)}
                                className={`flex flex-row justify-evenly items-center space-x-2 ${active ? 'underline' : 'hover:underline hover:bg-gray-200/40'} p-2`}
                            >
                                {parentTab}
                                {active ? <BiChevronUp /> : <BiChevronDown />}
                            </button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {currentChildTabs && currentChildTabs.map((tab, childIndex) => {
                                const disabled = activeParentIndex === 2 && childIndex === 1 ? true : false;
                                return (
                                    <Menu.Item key={childIndex} onClick={() => handleTab(childIndex)} p={'md'} disabled={disabled} title={disabled ? 'To come' : tab}>
                                        {tab}
                                    </Menu.Item>
                                )
                            })}
                        </Menu.Dropdown>
                    </Menu>
                )
            })}
        </div>
    )
}