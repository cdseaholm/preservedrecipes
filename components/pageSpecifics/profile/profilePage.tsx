'use client'

import { LoadingSpinner } from "@/components/misc/loadingSpinner";
import { useModalStore } from "@/context/modalStore";
import { useStateStore } from "@/context/stateStore";
import { Session, User } from "next-auth";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { IUser } from "@/models/types/user";
import SearchAndAdd from "@/components/misc/searchBox/searchAndAdd";
import { Box, Collapse } from "@mantine/core";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

const ProfileButton = ({ which }: { which: string }) => {

    return (
        <button onClick={() => toast.info(which)}>
            {which}
        </button>
    )
}

export default function ProfilePage({ session, userInfo }: { session: Session | null, userInfo: IUser }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const setOpenCreateRecipeModal = useModalStore(state => state.setOpenCreateRecipeModal);
    const user = session ? session.user as User : null;
    const userName = user ? user.name : '';
    const width = useStateStore(s => s.widthQuery);
    const tabs = ['Account', 'Family Info', 'Recipes', 'Communities'];
    const profileTabs = ['Profile Settings', 'Account Settings', 'Account History'];
    const [openedIndex, setOpenedIndex] = useState<number | null>(null);

    const [recipeSearch, setRecipeSearch] = useState('');
    const [communitySearch, setCommunitySearch] = useState('');
    const [familySearch, setFamilySearch] = useState('');
    const [familyRecipeSearch, setFamilyRecipeSearch] = useState('');
    console.log(userInfo)
    const recipes = ['Chicken', 'Beef', 'Potatoes'];
    const communities = ['1', '2', '3'];
    const members = ['Annie', 'Ellie', 'Ruth', 'Steve'];
    const familyRecipes = ['Porpetes'];
    const widthToUse = width * .8;

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

    const familyOptions = members.filter((item) => item.toLowerCase().includes(familySearch.toLowerCase().trim())).map((item) => (
        <button value={item} key={item} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
            -{item}
        </button>
    ))

    const familyRecipesOptions = familyRecipes.filter((item) => item.toLowerCase().includes(familyRecipeSearch.toLowerCase().trim())).map((item) => (
        <button value={item} key={item} className="flex flex-row w-[100%] text-sm lg:text-md hover:bg-gray-200 hover:text-highlight p-2 text-start pl-7">
            -{item}
        </button>
    ));

    const handleToggle = (index: number) => {
        setOpenedIndex(openedIndex === index ? null : index);
    };

    const finalStrings = [
        ['See family recipes', 'Search your family recipes', 'Add a family recipe'] as string[],
        ['See family members', 'Search your family members', 'Add members'],
        ['Create a recipe', 'Search your communities', 'Join Communities'],
        ['Edit your communities', 'Search your current communities', 'Search for new communities']
    ];

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

    useEffect(() => {
        if (!session) {
            router.replace('/');
            toast.error('Unauthorized to access this page');
        }
        setLoading(false);
    }, [session, router]);

    return (
        loading ? (
            <LoadingSpinner />
        ) : (
            <section className="flex flex-col justify-start items-center w-full h-full gap-5 pt-10">
                <Box maw={widthToUse} mx="auto" className="flex flex-row justify-start items-center border-b border-highlight w-full">
                    {`${userName}'s Profile`}
                </Box>
                {tabs.map((tab, index) => {
                    const mobile = width < 700 ? true : false;
                    return (
                        <Box maw={widthToUse} mx="auto" key={index} className="w-full">
                            <button
                                onClick={() => handleToggle(index)}
                                className="flex flex-row justify-between items-center border-b border-highlight w-full hover:bg-gray-300 rounded-t-md shadow-md p-2"
                            >
                                {tab}
                                {openedIndex === index ? <BiChevronUp /> : <BiChevronDown />}
                            </button>
                            <Collapse
                                in={openedIndex === index}
                                className="w-full"
                            >
                                {index === 0 ? (
                                    <div className={`bg-mainBack p-1 w-full ${mobile ? 'min-h-[300px] h-full' : 'min-h-[230px] h-1/2'} flex flex-col justify-start items-center rounded-b-md border border-accent/50 pt-3 px-5 pb-5 space-y-5`}>
                                        {profileTabs.map((tab) => (
                                            <ProfileButton which={tab} key={tab} />
                                        ))}
                                    </div>
                                ) : (
                                    <SearchAndAdd
                                        handleSearch={handleSearch}
                                        handleCreate={handleCreate}
                                        options={index === 2 ? options : index === 1 ? familyOptions : index === 0 ? familyRecipesOptions : communityOptions}
                                        type={tab}
                                        mobile={mobile}
                                        additionString={finalStrings[index][0]}
                                        searchString={finalStrings[index][1]}
                                        promoString={finalStrings[index][2]}
                                        index={index}
                                    />
                                )}
                            </Collapse>
                        </Box>
                    );
                })}
            </section>
        )
    );
}