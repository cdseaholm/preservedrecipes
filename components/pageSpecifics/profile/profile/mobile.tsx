'use client'

import LinkTextButton from "@/components/buttons/linkTextButtons"
import { Avatar, Tabs } from "@mantine/core"
import { useState, ChangeEvent } from "react"
import PersonalTabs from "./profileMobileTabs/personalTab"
import FamilyTabs from "./profileMobileTabs/familyTab"
import SettingsTab from "./profileMobileTabs/settingsTab"

export default function MobileProfilePage({ userName, handleCreate, userInfo }: { userName: string, handleCreate: (which: string, open: boolean) => void, userInfo: string }) {

    const [recipeSearch, setRecipeSearch] = useState('');
    const [communitySearch, setCommunitySearch] = useState('');
    const recipes = ['Chicken', 'Beef', 'Potatoes'];
    const communities = ['1', '2', '3'];

    const options = recipes
        .filter((item) => item.toLowerCase().includes(recipeSearch.toLowerCase().trim()))
        .map((item) => (
            <button value={item} key={item} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
                -{item}
            </button>
        ));

    const communityOptions = communities.filter((item) => item.toLowerCase().includes(communitySearch.toLowerCase().trim())).map((item) => (
        <button value={item} key={item} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
            -{item}
        </button>
    ))

    const handleRecipeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setRecipeSearch(e.currentTarget.value)
    }

    const handleCommunitySearch = (e: ChangeEvent<HTMLInputElement>) => {
        setCommunitySearch(e.currentTarget.value);
    }

    return (
        <section className="flex flex-col justify-center items-center w-full overflow-y-hidden overflow-x-auto bg-mainBack min-h-[750px] p-2">
            <Tabs defaultValue={'personal'} style={{ width: '95%', minHeight: '100%', height: '100%' }}>
                <div className="flex flex-row justify-between items-start h-fit w-full bg-mainContent rounded-t-md divide-x">
                    <p className="p-2">
                        {`${userName}'s Profile`}
                    </p>
                    <Tabs.List>
                        <Tabs.Tab value="personal">
                            Personal
                        </Tabs.Tab>
                        <Tabs.Tab value='family'>
                            Family
                        </Tabs.Tab>
                        <Tabs.Tab value='settings'>
                            Settings
                        </Tabs.Tab>
                    </Tabs.List>
                </div>
                <div className="flex flex-row justify-start items-center h-fit w-full bg-mainContent p-2 pl-4">
                    <Avatar radius={'xl'} />
                    <LinkTextButton link={'/profile/settings'} content="Profile Settings" />
                </div>
                <div className="flex flex-row justify-center items-start w-full h-[700px] bg-mainContent rounded-b-md">
                    <Tabs.Panel value="personal" w={'100%'} h={'100%'}>
                        <PersonalTabs options={options} communityOptions={communityOptions} handleCreate={handleCreate} handleCommunitySearch={handleCommunitySearch} handleRecipeSearch={handleRecipeSearch} />
                    </Tabs.Panel>
                    <Tabs.Panel value="family">
                        <FamilyTabs userInfo={userInfo} />
                    </Tabs.Panel>
                    <Tabs.Panel value="settings">
                        <SettingsTab />
                    </Tabs.Panel>
                </div>
            </Tabs>
        </section >
    )
}