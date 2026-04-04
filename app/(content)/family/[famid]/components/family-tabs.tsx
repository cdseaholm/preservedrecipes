'use client'

import { useNavigation } from '@/components/hooks/menu/use-navigation-hook'
import { useWindowSizes } from '@/context/width-height-store'
import { IFamily } from '@/models/types/family/family'
import { Tabs } from '@mantine/core'
import { usePathname } from 'next/navigation'
import { FiUsers } from 'react-icons/fi'
import { IoIosSettings, IoIosStats } from 'react-icons/io'
import { MdDashboard } from 'react-icons/md'
import { PiCookieThin } from 'react-icons/pi'
import { toast } from 'sonner'

export default function FamilyTabs({
    children,
    family,
    famid
}: {
    family: IFamily
    children: React.ReactNode,
    famid: string
}) {

    //page specific
    const { navigate } = useNavigation();
    const pathname = usePathname();
    const pageSplit = pathname.split("/");
    const page = pageSplit.length > 3 ? pageSplit.pop() : 'dashboard';

    //style specific
    const { width } = useWindowSizes();
    const tabContainerStyle = width > 768 ? "flex flex-row items-end justify-between w-full h-content px-2" : "flex flex-col items-start justify-start w-full space-y-1 h-content w-full px-4";
    const tabFontSize = width > 768 ? '16px' : '12px';
    const famInfoContainerStyle = `flex flex-col items-end justify-end h-content w-fit ${width > 768 ? 'pb-2' : ''}`;
    const famNameStyle = width > 768 ? "text-3xl font-bold underline" : "text-lg font-bold underline";
    const famHeritageStyle = width > 768 ? "text-lg" : "text-xs";
    const listJustify = 'flex-start';
    const iconSize = width > 768 ? 24 : 18;

    const tabs = [
        { label: <MdDashboard size={iconSize} />, labelTitle: 'Dashboard', value: 'dashboard' },
        { label: <PiCookieThin size={iconSize} />, labelTitle: 'Recipes', value: 'recipes' },
        { label: <FiUsers size={iconSize} />, labelTitle: 'Members', value: 'members' },
        { label: <IoIosStats size={iconSize} />, labelTitle: 'Stats', value: 'stats' },
        { label: <IoIosSettings size={iconSize} />, labelTitle: 'Settings', value: 'settings' },
    ];

    const tabOrder = width > 768 ? (
        <div className={tabContainerStyle}>
            <div className='w-content h-content flex flex-col items-start justify-start'>
                <Tabs.Panel value="dashboard" pb={'2px'} pt={'xs'}>
                    Dashboard
                </Tabs.Panel>
                <Tabs.Panel value="recipes" pb={'2px'} pt={'xs'}>
                    Recipes
                </Tabs.Panel>
                <Tabs.Panel value="members" pb={'2px'} pt={'xs'}>
                    Members
                </Tabs.Panel>
                <Tabs.Panel value="stats" pb={'2px'} pt={'xs'}>
                    Stats
                </Tabs.Panel>
                <Tabs.Panel value="settings" pb={'2px'} pt={'xs'}>
                    Settings
                </Tabs.Panel>
                <Tabs.List justify={listJustify}>
                    {tabs.map((tab) => (
                        <Tabs.Tab key={tab.value} value={tab.value} pb={"xs"}>
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
            </div>
            <div className={famInfoContainerStyle}>
                <h1 className={famNameStyle}>Family: {family ? family.name : 'No Family Name'}</h1>
                <p className={famHeritageStyle}>Heritage: {family && family.heritage ? family.heritage[0]?.name : 'No heritage set'}</p>
            </div>
        </div>
    ) : (
        <div className={tabContainerStyle}>
            <div className='flex flex-row items-end justify-between w-full h-content'>
                <Tabs.Panel value="dashboard" pt="xs" pb={'2px'}>
                    Dashboard
                </Tabs.Panel>
                <Tabs.Panel value="recipes" pt="xs" pb={'2px'}>
                    Recipes
                </Tabs.Panel>
                <Tabs.Panel value="members" pt="xs" pb={'2px'}>
                    Members
                </Tabs.Panel>
                <Tabs.Panel value="stats" pt="xs" pb={'2px'}>
                    Stats
                </Tabs.Panel>
                <Tabs.Panel value="settings" pt="xs" pb={'2px'}>
                    Settings
                </Tabs.Panel>
                <div className={famInfoContainerStyle}>
                    <h1 className={famNameStyle}>Family: {family ? family.name : 'No Family Name'}</h1>
                    <p className={famHeritageStyle}>Heritage: {family && family.heritage ? family.heritage[0]?.name : 'No heritage set'}</p>
                </div>
            </div>
            <Tabs.List w={'100%'} justify={listJustify}>
                {tabs.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value} styles={{ tabLabel: { fontSize: tabFontSize, fontWeight: 500 } }}>
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
        </div>
    )

    return (
        <>
            <Tabs
                w={'100%'}
                h={'fit-content'}
                value={page}
                inverted
                defaultValue={'dashboard'}
                onChange={(value) => {

                    if (!value) {
                        toast.error("Invalid tab selection");
                        return;
                    }

                    if (value !== page) {
                        const url = value === 'dashboard' ? `/family/${famid}` : `/family/${famid}/${value}`;
                        navigate(url);
                    }

                }}
            >
                {tabOrder}
            </Tabs>
            {children}
        </>
    )
}