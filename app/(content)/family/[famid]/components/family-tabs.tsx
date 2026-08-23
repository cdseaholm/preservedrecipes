'use client'

import { useWindowSizes } from '@/context/width-height-store'
import { Divider, rem, Tabs } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import { FiUsers } from 'react-icons/fi'
import { IoIosSettings, IoIosStats } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import { PiCookieThin } from 'react-icons/pi'
import { toast } from 'sonner'

export default function FamilyTabs({
    famid
}: {
    famid: string
}) {

    //page specific
    const router = useRouter();
    const pathname = usePathname();
    const pageSplit = pathname.split("/");
    const page = pageSplit.length > 3 ? pageSplit.pop() : 'dashboard';

    //style specific
    const { width } = useWindowSizes();
    const tabContainerStyle = "flex h-content w-full flex-row items-end justify-between rounded-md border border-accent/10 bg-mainBack/45 p-2";
    const tabFontSize = width > 768 ? '16px' : '13px';
    // const famInfoContainerStyle = `flex flex-col items-end justify-end h-content w-fit ${width > 768 ? 'pb-2' : ''}`;
    // const famNameStyle = width > 768 ? "text-3xl font-bold underline" : "text-lg font-bold underline";
    // const famHeritageStyle = width > 768 ? "text-lg" : "text-xs";
    const iconStyle = { width: rem(16), height: rem(16) };

    const tabs = [
        { label: <MdDashboard style={iconStyle} />, labelTitle: 'Dashboard', value: 'dashboard' },
        { label: <PiCookieThin style={iconStyle} />, labelTitle: 'Recipes', value: 'recipes' },
        { label: <FiUsers style={iconStyle} />, labelTitle: 'Members', value: 'members' },
        { label: <IoIosStats style={iconStyle} />, labelTitle: 'Stats', value: 'stats' },
        { label: <IoIosSettings style={iconStyle} />, labelTitle: 'Settings', value: 'settings' },
    ];

    const tabOrder = width > 768 ? (
        <div className={tabContainerStyle}>
            <Tabs.List w={'100%'} grow>
                {tabs.map((tab) => (
                    <Tabs.Tab
                        key={tab.value}
                        value={tab.value}
                        leftSection={
                            tab.label
                        }
                        bd={'1px solid var(--surfaceBorder)'}
                    >
                        {tab.labelTitle}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
        </div>
    ) : (
        <div className={tabContainerStyle}>
            <Tabs.List w={'100%'} grow>
                {tabs.map((tab) => (
                    <Tabs.Tab
                        key={tab.value}
                        value={tab.value}
                        styles={{ tabLabel: { fontSize: tabFontSize, fontWeight: 500 } }}
                        title={tab.labelTitle}
                        bd={'1px solid var(--surfaceBorder)'}
                    >
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
        </div>
    )

    return (
        <>
            <Divider />
            <Tabs
                w={'100%'}
                h={'fit-content'}
                value={page}
                variant='pills'
                radius={'md'}
                defaultValue={'dashboard'}
                onChange={(value) => {

                    if (!value) {
                        toast.error("Invalid tab selection");
                        return;
                    }

                    if (value !== page) {
                        const url = value === 'dashboard' ? `/family/${famid}` : `/family/${famid}/${value}`;
                        router.push(url);
                    }

                }}
            >
                {tabOrder}
            </Tabs>
            <Divider />
        </>
    )
}
