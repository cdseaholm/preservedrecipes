'use client'

import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useStateStore } from "@/context/stateStore";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Menu, Tabs } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/context/profileStore";
import { useUserStore } from "@/context/userStore";
import FamilyTab from "./profile/family/familyTab";
import AccountTab from "./profile/accountTab";
import RecipeTab from "./profile/recipeTab";
//import CommunityTab from "./profile/communityTab";
import { useFamilyStore } from "@/context/familyStore";
import { IFamilyMember } from "@/models/types/familyMember";


export default function ProfilePage({ admin }: { admin: string }) {

    //globals
    const router = useRouter();
    const width = useStateStore(s => s.widthQuery);
    const { data: session } = useSession();
    const userInfo = useUserStore(s => s.userInfo);

    //states
    const initialTab = useProfileStore(s => s.tab)
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [subTab, setSubTab] = useState('');
    const userRecipes = useUserStore(s => s.userRecipes);
    const suggestions = useUserStore(s => s.suggestions);
    //const userCommunities = useUserStore(s => s.userCommunities);
    const family = useFamilyStore(s => s.family);
    const members = family ? family.familyMembers : [] as IFamilyMember[];
    const admins = members ? members.filter((member) => member.permissionStatus === 'Admin') : [] as IFamilyMember[];
    const numAdmins = admins ? admins.length : 0;
    const userFamInfo = members ? members.find((member) => member.familyMemberID === userInfo._id.toString()) as IFamilyMember : {} as IFamilyMember;
    const userFamPrivs = userFamInfo ? userFamInfo.permissionStatus as string : '';
    const userAdminPrivs = userFamPrivs && userFamPrivs === 'Admin' ? true : false;
    //variables
    const user = session ? session.user as User : null;
    const userName = user ? user.name : '';



    const tabsClass = `flex flex-col h-full w-full justify-evenly items-center py-8 px-4`

    const tabs = ['Account', 'Family', 'Recipes'];

    const finalStrings = [
        ['Create a family recipe', 'family recipes', 'family recipe'] as string[],
        ['Add a family members', 'family members', 'family member'],
        ['Create a recipe', 'recipes', 'recipe']
    ];
    {/**['Edit your communities', 'current communities', 'community'] */ }


    //effects
    useEffect(() => {
        if (!session) {
            router.replace('/');
            toast.error('Unauthorized to access this page');
        }
        setActiveTab(initialTab);
        setLoading(false);
    }, [session, router, initialTab]);

    const handleTabChange = (value: string, famSubTab: string) => {
        setActiveTab(value);
        setSubTab(famSubTab)
    };


    return (
        loading ? (
            <LoadingSpinner screen={true} />
        ) : (
            <section className="flex flex-col justify-start items-center w-full h-content gap-5 pt-6">
                <Tabs color="red" defaultValue={activeTab} className="h-full">
                    <div className="flex flex-col justify-evenly items-start sm:flex-row sm:justify-between sm:items-center py-1 px-8 w-screen h-content border-b border-accent/50">
                        <p className="max-sm:pl-4 max-sm:pb-4">{`${userName}'s Profile`}</p>
                        <Tabs.List className="sm:space-x-3">
                            {tabs.map((tab, index) => (
                                <div className="flex flex-col justify-center items-center w-content h-content" key={index}>
                                    {index === 1 ? (
                                        <Menu offset={0}>
                                            <Menu.Target>
                                                <Tabs.Tab
                                                    value={tab.toLowerCase()}
                                                    style={{
                                                        fontSize: `${width < 640 && width > 415 ? '14px' : width < 415 ? '12px' : '16px'}`,
                                                        borderTopLeftRadius: '8px',
                                                        borderTopRightRadius: '8px'
                                                    }}
                                                >
                                                    {tab}
                                                </Tabs.Tab>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item onClick={() => handleTabChange('family', 'recipes')}>Recipes</Menu.Item>
                                                <Menu.Item onClick={() => handleTabChange('family', 'members')}>Members</Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    ) : (
                                        <Tabs.Tab
                                            value={tab.toLowerCase()}
                                            style={{
                                                fontSize: `${width < 640 && width > 415 ? '14px' : width < 415 ? '12px' : '16px'}`, borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
                                            }}
                                        >
                                            {tab}
                                        </Tabs.Tab>
                                    )}
                                </div>
                            ))}
                        </Tabs.List>
                    </div>

                    <Tabs.Panel value="account">
                        <AccountTab numAdmins={numAdmins} userAdminPrivs={userAdminPrivs} family={family} suggestions={suggestions} session={session} admin={admin} />
                    </Tabs.Panel>

                    <Tabs.Panel value="family" className={tabsClass}>
                        <FamilyTab userInfo={userInfo} type={'Family'} additionString={[finalStrings[0][0], finalStrings[1][0]]} searchString={[finalStrings[0][1], finalStrings[1][1]]} promoString={[finalStrings[0][2], finalStrings[1][2]]} numAdmins={numAdmins} userAdminPrivs={userAdminPrivs} subTab={subTab} />
                    </Tabs.Panel>

                    <Tabs.Panel value="recipes" className={tabsClass}>
                        <RecipeTab userRecipes={userRecipes} type={'Recipes'} additionString={finalStrings[2][0]} searchString={finalStrings[2][1]} promoString={finalStrings[2][2]} session={session} />
                    </Tabs.Panel>

                    {/* <Tabs.Panel value="communities" className={tabsClass}>
                        <CommunityTab userCommunities={userCommunities} type={'Communities'} additionString={finalStrings[3][0]} searchString={finalStrings[3][1]} promoString={finalStrings[3][2]} />
                    </Tabs.Panel> */}
                </Tabs >
            </section >
        )
    );
}