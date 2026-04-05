'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box"
import SearchBar from "@/components/misc/searchBox/searchBar"
import ContentWrapper from "@/components/wrappers/contentWrapper"
import NavWrapper from "@/components/wrappers/navWrapper"
import { useUserStore } from "@/context/userStore"
import { ICommunity } from "@/models/types/community/community"
import { CommunityMember } from "@/models/types/community/community-member"
import { IRequesterInfo } from "@/models/types/misc/request"
import { IUser } from "@/models/types/personal/user"
import { Tabs } from "@mantine/core"
import Link from "next/link"
import { useState, useEffect, ChangeEvent } from "react"
import { BiFoodMenu, BiPlus } from "react-icons/bi"
import { MdOutlineSpaceDashboard } from "react-icons/md"
import { toast } from "sonner"

export default function MembersMain({ 
    members, 
    userInfo, 
    requesters, 
    community 
}: { 
    members: CommunityMember[];
    userInfo: IUser | null;
    requesters: IRequesterInfo[];
    community: ICommunity;
}) {

    const setUserInfo = useUserStore(state => state.setUserInfo);
    
    const [activeTab, setActiveTab] = useState<string | null>('members');
    const [search, setSearch] = useState('');
    
    // ✅ Use Set of IDs instead of boolean array
    const [checkedMembers, setCheckedMembers] = useState<Set<string>>(new Set());
    const [checkedRequesters, setCheckedRequesters] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (userInfo) setUserInfo(userInfo);
    }, [userInfo, setUserInfo]);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    }

    // ✅ Toggle checked by ID
    const handleToggleMember = (memberId: string) => {
        setCheckedMembers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };

    const handleToggleRequester = (requesterId: string) => {
        setCheckedRequesters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(requesterId)) {
                newSet.delete(requesterId);
            } else {
                newSet.add(requesterId);
            }
            return newSet;
        });
    };

    const switchLocals = () => {
        setSearch('');
        setCheckedMembers(new Set());
        setCheckedRequesters(new Set());
        setActiveTab(activeTab === 'members' ? 'requests' : 'members');
    }

    const handleSeeItem = (item: CommonInfo) => {
        if (item.which === 'members') {
            toast.info(`Viewing member: ${item.name}`);
        } else {
            toast.info(`Viewing requester: ${item.name}`);
        }
    }

    const renderItem = (
        <Tabs 
            value={activeTab} 
            onChange={switchLocals} 
            w={'100%'} 
            h={'100%'} 
            className="flex flex-col justify-start items-center w-full h-full space-y-4"
        >
            <PageSpecButtonBox
                leftHandButtons={
                    <Link href={`/communities/${community._id}`}>
                        <button 
                            className="h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-base space-x-2 cursor-pointer" 
                            aria-label="Back to Community" 
                            title="Back to Community"
                        >
                            <BiPlus size={20} className="rotate-45" />
                            <p>Back to Community</p>
                        </button>
                    </Link>
                }
                rightHandButtons={
                    <Tabs.List w={'auto'}>
                        <Tabs.Tab 
                            value="members" 
                            leftSection={<MdOutlineSpaceDashboard size={12} />} 
                            w={'1/3'}
                        >
                            Members ({members.length})
                        </Tabs.Tab>
                        <Tabs.Tab 
                            value="requests" 
                            leftSection={<BiFoodMenu size={12} />} 
                            w={'1/3'}
                        >
                            Requests ({requesters.length})
                        </Tabs.Tab>
                    </Tabs.List>
                }
                leftLabel={"Community Navigation"}
                rightLabel={"Community Tabs"}
            />

            <Tabs.Panel value="members" w={'100%'} h={'100%'}>
                <MembersAndRequestsTabs 
                    data={members.map((member) => ({
                        id: member.id,
                        name: member.name,
                        email: member.memberEmail,
                        which: 'members'
                    } as CommonInfo))} 
                    handleSearch={handleSearch} 
                    search={search} 
                    checkedIds={checkedMembers}
                    handleToggle={handleToggleMember}
                    handleSeeItem={handleSeeItem} 
                    tab="members" 
                />
            </Tabs.Panel>

            <Tabs.Panel value="requests" w={'100%'} h={'100%'}>
                <MembersAndRequestsTabs 
                    data={requesters.map((requester) => ({
                        id: requester.id,
                        name: requester.name,
                        email: requester.email,
                        which: 'requests'
                    } as CommonInfo))} 
                    handleSearch={handleSearch} 
                    search={search} 
                    checkedIds={checkedRequesters}
                    handleToggle={handleToggleRequester}
                    handleSeeItem={handleSeeItem} 
                    tab="requests" 
                />
            </Tabs.Panel>
        </Tabs>
    );

    return (
        <NavWrapper 
            loadingChild={null} 
            userInfo={userInfo}
        >
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                {renderItem}
            </ContentWrapper>
        </NavWrapper>
    )
}

const MembersAndRequestsTabs = ({ 
    tab, 
    data, 
    handleSearch, 
    search, 
    checkedIds,
    handleToggle,
    handleSeeItem 
}: { 
    tab: string;
    data: CommonInfo[];
    handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
    search: string;
    checkedIds: Set<string>;
    handleToggle: (id: string) => void;
    handleSeeItem: (item: CommonInfo) => void;
}) => {
    const filteredData = data.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase().trim())
    );

    return (
        <>
            <SearchBar 
                handleSearch={handleSearch}
                searchString={search === '' ? `Search ${tab}` : search}
                index={2} leftSection={null}
            />
            {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                    <InSearchItemButton 
                        key={item.id}
                        item={item.name}
                        handleChecked={() => handleToggle(item.id)}
                        edit={true}
                        checked={checkedIds.has(item.id)}
                        handleSeeItem={() => handleSeeItem(item)}
                    >
                        <ul className="space-x-2">
                            {index + 1}. {item.name}
                            {item.email && <span className="text-gray-500 text-sm">({item.email})</span>}
                        </ul>
                    </InSearchItemButton>
                ))
            ) : (
                <ul className="p-2 text-start pl-7">
                    {`No ${tab} found`}
                </ul>
            )}
        </>
    );
}

type CommonInfo = {
    id: string;
    name: string;
    email?: string;
    which: 'members' | 'requests';
}