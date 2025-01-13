'use client'

import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { User } from "next-auth";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd";
import { Tabs } from "@mantine/core";
import { useSession } from "next-auth/react";
import { ICommunity } from "@/models/types/community";
import { IRecipe } from "@/models/types/recipe";
import { FamilyMemberRelation } from "@/models/types/familyMemberRelation";

const ProfileButton = ({ which }: { which: string }) => {

    return (
        <button onClick={() => toast.info(which)}>
            {which}
        </button>
    )
}


export default function ProfilePage({ members, familyRecipes, communities, recipes }: { members: FamilyMemberRelation[], communities: ICommunity[], recipes: IRecipe[], familyRecipes: IRecipe[] }) {

    //globals
    const router = useRouter();
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);
    const width = useStateStore(s => s.widthQuery);
    const { data: session } = useSession();

    //states
    const [loading, setLoading] = useState<boolean>(true);
    const [recipeSearch, setRecipeSearch] = useState('');
    const [communitySearch, setCommunitySearch] = useState('');
    const [familySearch, setFamilySearch] = useState('');
    const [familyRecipeSearch, setFamilyRecipeSearch] = useState('');

    //variables
    const user = session ? session.user as User : null;
    const userName = user ? user.name : '';
    const mobile = width < 700 ? true : false;
    const recipeTitle = recipes ? recipes.map((rec) => rec.name) : [] as string[];
    const communityTitles = communities ? communities.map((com) => com.name) : [] as string[];
    const memberNames = members ? members.map((mem) => mem.familyMemberName) : [] as string[];
    const famRecipeTitles = familyRecipes ? familyRecipes.map((rec) => rec.name) : [] as string[];

    const tabsClass = `flex flex-col h-full w-full justify-evenly items-center py-8 px-4`

    const tabs = ['Account', 'Family Info', 'Recipes', 'Communities'];
    const profileTabs = ['Profile Settings', 'Account Settings', 'Account History'];

    const finalStrings = [
        ['See family recipes', 'family recipes', 'family recipe'] as string[],
        ['See family members', 'family members', 'family member'],
        ['Create a recipe', 'recipes', 'recipe'],
        ['Edit your communities', 'current communities', 'community']
    ];

    //functions

    const getSearchAndAddParams = (index: number) => {
        const optionsArray = [familyRecipesOptions, familyOptions, options, communityOptions];
        const typeArray = [tabs[0], tabs[1], tabs[2], tabs[3]];
        const additionStringArray = [finalStrings[0][0], finalStrings[1][0], finalStrings[2][0], finalStrings[3][0]];
        const searchStringArray = [finalStrings[0][1], finalStrings[1][1], finalStrings[2][1], finalStrings[3][1]];
        const promoStringArray = [finalStrings[0][2], finalStrings[1][2], finalStrings[2][2], finalStrings[3][2]];

        return {
            handleSearch,
            handleCreate,
            options: optionsArray[index],
            type: typeArray[index],
            mobile,
            additionString: additionStringArray[index],
            searchString: searchStringArray[index],
            promoString: promoStringArray[index],
            index
        };
    };

    const options = recipeTitle.filter((item) => item.toLowerCase().includes(recipeSearch.toLowerCase().trim())).map((item, index) => (
        <button value={item} key={index} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
            -{item}
        </button>
    ));

    const communityOptions = communityTitles.filter((item) => item.toLowerCase().includes(communitySearch.toLowerCase().trim())).map((item, index) => (
        <button value={item} key={index} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
            -{item}
        </button>
    ))

    const familyOptions = memberNames.filter((item) => item.toLowerCase().includes(familySearch.toLowerCase().trim())).map((item, index) => (
        <button value={item} key={index} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
            -{item}
        </button>
    ))

    const familyRecipesOptions = famRecipeTitles.filter((item) => item.toLowerCase().includes(familyRecipeSearch.toLowerCase().trim())).map((item, index) => (
        <button value={item} key={index} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
            -{item}
        </button>
    ));

    const handleSearch = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        if (index === 1) {
            setFamilySearch(e.currentTarget.value);
        } else if (index === 2) {
            setRecipeSearch(e.currentTarget.value);
        } else if (index === 3) {
            setCommunitySearch(e.currentTarget.value)
        } else {
            setFamilyRecipeSearch(e.currentTarget.value)
        }
    }

    const handleCreate = (which: string, open: boolean) => {
        if (which === 'recipe') {
            setOpenCreateRecipeModal(open);
        }
    }

    //effects
    useEffect(() => {
        if (!session) {
            router.replace('/');
            toast.error('Unauthorized to access this page');
        }
        setLoading(false);
    }, [session, router]);

    return (
        loading ? (
            <LoadingSpinner screen={true} />
        ) : (
            <section className="flex flex-col justify-start items-center w-full h-content gap-5 pt-10">
                <Tabs color="red" defaultValue="account" className="h-full">
                    <div className="flex flex-col justify-evenly items-start sm:flex-row sm:justify-between sm:items-center py-1 px-8 w-screen h-content border-b border-accent/50">
                        <p className="max-sm:pl-4 max-sm:pb-4">{`${userName}'s Profile`}</p>
                        <Tabs.List className="sm:space-x-3">
                            {tabs.map((tab, index) => (
                                <Tabs.Tab
                                    key={index}
                                    value={tab.toLowerCase()}
                                    style={{
                                        fontSize: `${width < 640 && width > 415 ? '12px' : width < 415 ? '10px' : '14px'}`, borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
                                    }}
                                >
                                    {tab}
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                    </div>

                    <Tabs.Panel value="account">
                        <div className={`bg-mainBack p-1 w-full h-[600px] flex flex-col justify-center items-center pt-3 px-5 pb-5 space-y-5`}>
                            {profileTabs.map((tab, index) => (
                                <ProfileButton which={tab} key={index} />
                            ))}
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel value="family info" className={tabsClass}>
                        <SearchAndAdd {...getSearchAndAddParams(0)} />
                        <SearchAndAdd {...getSearchAndAddParams(1)} />
                    </Tabs.Panel>

                    <Tabs.Panel value="recipes" className={tabsClass}>
                        <SearchAndAdd {...getSearchAndAddParams(2)} />
                    </Tabs.Panel>

                    <Tabs.Panel value="communities" className={tabsClass}>
                        <SearchAndAdd {...getSearchAndAddParams(3)} />
                    </Tabs.Panel>
                </Tabs>
            </section>
        )
    );
}