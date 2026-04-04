'use client'

import CommunityCard from "./communityCard";
import { ChangeEvent, useEffect, useState, useMemo } from "react";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import SearchBar from "@/components/misc/searchBox/searchBar";
import { BiPlus } from "react-icons/bi";
import { useRouter, useSearchParams } from "next/navigation";
import SortCommunities from "@/components/buttons/filter-and-sorts/community-sort";
import { ICommunity } from "@/models/types/community/community";
import { useModalStore } from "@/context/modalStore";
import NavWrapper from "@/components/wrappers/navWrapper";
import { IUser } from "@/models/types/personal/user";
import { useUserStore } from "@/context/userStore";
import { useDataStore } from "@/context/dataStore";
import CommunityFilter from "@/components/buttons/filter-and-sorts/community-filter";
import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box";
import ListWrapper from "@/components/wrappers/list-wrapper";
import { useWindowSizes } from "@/context/width-height-store";

export default function CommunityMain({
  userCommunities,
  allCommunities,
  itemsPerPage,
  currentPage: initialPage,
  searchQuery: initialSearch,
  sortQuery: initialSort,
  filterQuery: initialFilter,
  statusQuery: initialStatus,
  userInfo
}: {
  userCommunities: ICommunity[],
  allCommunities: ICommunity[],
  itemsPerPage: number,
  currentPage: number,
  searchQuery: string | null,
  sortQuery: string | null,
  filterQuery: string[] | null,
  statusQuery: string | null,
  userInfo: IUser | null
}) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const setOpenCreateCommunityModal = useModalStore(state => state.setOpenCreateCommunityModal);
  const setUserInfo = useUserStore(state => state.setUserInfo);
  const setUserCommunities = useUserStore(state => state.setUserCommunities);
  const setCommunities = useDataStore(state => state.setCommunities);
  const [loading, setLoading] = useState(false);
  
  // Get from Zustand store (always up-to-date)
  const storedCommunities = useDataStore(state => state.communities);
  const [searchText, setSearchText] = useState(initialSearch || '');
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { width } = useWindowSizes();

  // Sync URL params with state
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';
    setCurrentPage(page);
    setSearchText(search);
  }, [searchParams]);

  // Filter, sort, and paginate - all on client side using Zustand
  //can add filteredAndSorted to return if needed elsewhere
  const { totalPages, currentCommunities, currentCommunityTags } = useMemo(() => {
    let communities = [...storedCommunities];

    // Apply search filter
    if (searchText.trim()) {
      communities = communities.filter(c => 
        c.name.toLowerCase().includes(searchText.toLowerCase().trim()) ||
        c.description?.toLowerCase().includes(searchText.toLowerCase().trim())
      );
    }

    // Apply tag filters
    if (initialFilter && initialFilter.length > 0) {
      communities = communities.filter(c =>
        c.tags.some(tag => initialFilter.includes(tag))
      );
    }

    // Apply status filter
    if (initialStatus) {
      communities = communities.filter(c => c.privacyLevel === initialStatus);
    }

    // Apply sorting
    communities.sort((a, b) => {
      switch (initialSort) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'members_asc':
          return a.communityMemberIDs.length - b.communityMemberIDs.length;
        case 'members_desc':
          return b.communityMemberIDs.length - a.communityMemberIDs.length;
        case 'createdAt_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'createdAt_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'activity_asc':
          return a.postIDs.length - b.postIDs.length;
        case 'activity_desc':
          return b.postIDs.length - a.postIDs.length;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    const currentCommunityTags = Array.from(new Set(communities.flatMap(c => c.tags)));

    // Calculate pagination
    const totalPages = Math.ceil(communities.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCommunities = communities.slice(startIndex, endIndex);

    setLoading(false);

    //can add this to return if needed later: filteredAndSorted: communities, 
    return { 
      totalPages, 
      currentCommunities,
      currentCommunityTags
    };
  }, [storedCommunities, searchText, initialFilter, initialStatus, initialSort, currentPage, itemsPerPage]);

  const handleTransiton = (url: string) => {
    setLoading(true);
    router.push(url);
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearchText(value);
    
    // Update URL after debounce
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      if (value.trim()) {
        params.set('search', value.trim());
      } else {
        params.delete('search');
      }
      router.push(`/communities?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }

  const handleCreate = () => {
    setOpenCreateCommunityModal(true);
  }

  // Hydrate Zustand store on mount
  useEffect(() => {
    if (userInfo) setUserInfo(userInfo);
    if (userCommunities) setUserCommunities(userCommunities);
    if (allCommunities) setCommunities(allCommunities);
  }, [userInfo, userCommunities, allCommunities, setUserInfo, setUserCommunities, setCommunities]);

  return (
    <NavWrapper userInfo={userInfo} loadingChild={loading}>
      <ContentWrapper containedChild={true} paddingNeeded={true}>
        <PageSpecButtonBox
          leftHandButtons={
            <>
              <SortCommunities 
                key="sort" 
                searchParams={searchParams} 
                widthQuery={width} 
                handleTransiton={handleTransiton} 
              />
              <CommunityFilter 
                key="filter" 
                searchParams={searchParams} 
                widthQuery={width} 
                handleTransiton={handleTransiton}
                tags={currentCommunityTags}
              />
            </>
          }
          rightHandButtons={
            userInfo && <button onClick={handleCreate} className={`h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-base space-x-1 cursor-pointer`} aria-label="Create Community" title="Create Community">
              <BiPlus size={20} />
              <span className="hidden sm:inline">Create Community</span>
            </button>
          }
          leftLabel="Sort-and-Filter"
          rightLabel="Add"
        />

        <ListWrapper 
          numberOfPages={totalPages}
          isPending={false}
          currentPage={currentPage}
          searchBar={<SearchBar
            handleSearch={handleSearch}
            searchString={searchText || 'Search Communities'}
            index={0} leftSection={null} />} editButtons={undefined}>
          {currentCommunities && currentCommunities.length > 0 ? (
            currentCommunities.map((community, index) => (
              <CommunityCard key={community._id} community={community} index={index} userInfo={userInfo} />
            ))
          ) : (
            <ul className="p-2 text-start pl-7">
              {searchText ? `No communities found matching "${searchText}"` : 'No communities found'}
            </ul>
          )}
        </ListWrapper>
      </ContentWrapper>
    </NavWrapper>
  )
}