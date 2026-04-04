'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton"
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import CreateButton from "@/components/buttons/create-button";
import DeleteButton from "@/components/buttons/deleteButton";
import EditButton from "@/components/buttons/edit-button";
import JoinLinkButton from "@/components/buttons/join-link-button";
import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box";
import SearchBar from "@/components/misc/searchBox/searchBar";
import { BiCheck, BiPencil, BiPlus } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import { ICommunity } from "@/models/types/community/community";
import ListWrapper from "@/components/wrappers/list-wrapper";
import ContentWrapper from "@/components/wrappers/contentWrapper";

export default function UserCommunitiesList({ userCommunities }: { userCommunities: ICommunity[] }) {

    const [edit, setEdit] = useState(false);
    const [communitySearch, setCommunitySearch] = useState('');
    
    // ✅ Use Set of community IDs instead of boolean array
    const [checkedCommunities, setCheckedCommunities] = useState<Set<string>>(new Set());

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setCommunitySearch(e.currentTarget.value);
    }

    const handleCreate = () => {
        toast.success('Create Community clicked');
    }

    // ✅ Toggle community by ID
    const handleToggleCommunity = (communityId: string) => {
        setCheckedCommunities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(communityId)) {
                newSet.delete(communityId);
            } else {
                newSet.add(communityId);
            }
            return newSet;
        });
    }

    const handleEdit = () => {
        setEdit(!edit);
        // ✅ Clear selections when toggling edit mode
        if (edit) {
            setCheckedCommunities(new Set());
        }
    }

    const handleDelete = () => {
        const itemsToDelete = Array.from(checkedCommunities);
        
        if (itemsToDelete.length === 0) {
            toast.info('No communities selected');
            return;
        }

        const userConfirmed = window.confirm(
            `Are you sure you want to leave ${itemsToDelete.length} communit${itemsToDelete.length === 1 ? 'y' : 'ies'}?`
        );

        if (!userConfirmed) {
            toast.info('Cancelled');
            return;
        }

        // TODO: Implement delete server action
        toast.info(`Delete ${itemsToDelete.length} communities`);
        setCheckedCommunities(new Set());
        setEdit(false);
    }

    const handleSeeItem = (community: ICommunity) => {
        // TODO: Navigate to community page
        toast.info(`View community: ${community.name}`);
    }

    // ✅ Filter communities based on search
    const filteredCommunities = userCommunities.filter((community) =>
        community.name.toLowerCase().includes(communitySearch.toLowerCase().trim())
    );

    return (
        <ContentWrapper containedChild={true} paddingNeeded={true}>
            <PageSpecButtonBox
                leftHandButtons={
                    edit && (
                        <DeleteButton 
                            icon={<FaRegTrashAlt />} 
                            label={`Delete ${checkedCommunities.size}`} 
                            onClick={handleDelete} 
                        />
                    )
                }
                rightHandButtons={
                    <>
                        <EditButton 
                            onClick={handleEdit} 
                            icon={edit ? <BiCheck /> : <BiPencil />} 
                            label={edit ? 'Done' : 'Edit'} 
                            optionsLength={userCommunities?.length || 0} 
                        />
                        <CreateButton 
                            onClick={handleCreate} 
                            icon={<BiPlus />} 
                            additionString={'Community'} 
                        />
                        <JoinLinkButton 
                            href="/communities" 
                            icon={<CiSearch />} 
                            label="Join" 
                        />
                    </>
                }
                leftLabel="Manage Communities"
                rightLabel="Community Actions"
            />
            <ListWrapper 
                searchBar={<SearchBar
                    handleSearch={handleSearch}
                    searchString={communitySearch || 'Search your communities'}
                    index={3} leftSection={null} />}
                numberOfPages={1}
                isPending={false}
                currentPage={1} editButtons={undefined}            >
                {filteredCommunities.length > 0 ? (
                    filteredCommunities.map((community, index) => (
                        <InSearchItemButton 
                            key={community._id}
                            item={community.name}
                            handleChecked={() => handleToggleCommunity(community._id)}
                            edit={edit}
                            checked={checkedCommunities.has(community._id)}
                            handleSeeItem={() => handleSeeItem(community)}
                        >
                            <ul className="space-x-2 cursor-pointer">
                                {index + 1}. {community.name}
                            </ul>
                        </InSearchItemButton>
                    ))
                ) : (
                    <ul className="p-2 text-start pl-7">
                        {communitySearch ? 'No communities found' : 'Join a community to see it here'}
                    </ul>
                )}
            </ListWrapper>
        </ContentWrapper>
    );
}