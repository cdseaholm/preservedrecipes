'use client'

import InSearchItemButton from "@/components/buttons/inSearchItemButton";
import { useState, ChangeEvent, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { IInquiry } from "@/models/types/misc/inquiry";
import DeleteButton from "@/components/buttons/deleteButton";
import EditButton from "@/components/buttons/edit-button";
import SearchBar from "@/components/misc/searchBox/searchBar";
import { BiCheck, BiPencil } from "react-icons/bi";
import { FaRegTrashAlt } from "react-icons/fa";
import { useModalStore } from "@/context/modalStore";
import { useUserStore } from "@/context/userStore";
import { GrDocumentUpdate } from "react-icons/gr";
import { IUser } from "@/models/types/personal/user";
import { Checkbox } from "@mantine/core";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import NavWrapper from "@/components/wrappers/navWrapper";
import { useInquiryActions } from "@/components/hooks/inquiry/inquiry-hooks";
import LoadingOverlayComponent from "@/components/misc/loading/loading-overlay";
import BasicSort from "@/components/buttons/filter-and-sorts/basic-sort";
import BasicFilter from "@/components/buttons/filter-and-sorts/basic-filter";
import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box";
import ListWrapper from "@/components/wrappers/list-wrapper";
import { useWindowSizes } from "@/context/width-height-store";

export const filtersValueKeyInquiries = [
    { label: 'Newest', value: 'createdAt_desc' },
    { label: 'Oldest', value: 'createdAt_asc' },
];

export default function InquiryTab({
    inquiries,
    userInfo
}: {
    inquiries: IInquiry[];
    userInfo: IUser;
}) {
    const { width } = useWindowSizes();
    const setOpenInquiryModal = useModalStore(state => state.setOpenInquiryModal);
    const setUserInfo = useUserStore(state => state.setUserInfo);
    const setInquiries = useUserStore(state => state.setInquiries);
    const setViewSpecificInquiry = useModalStore(state => state.setViewSpecificInquiry);
    const { loading, editInquiries, deleteInquiries, storedInquiries } = useInquiryActions();

    const [edit, setEdit] = useState(false);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeSort, setActiveSort] = useState('createdAt_desc');

    // ✅ Use Set of inquiry IDs
    const [checkedInquiries, setCheckedInquiries] = useState<Set<string>>(new Set());

    const filteredInquiries = activeFilter === 'All'
        ? storedInquiries
        : storedInquiries.filter(inquiry => inquiry.inquiryType === activeFilter);

    const sortedInquiries = useMemo(() => {
        let sorted = [...filteredInquiries];
        switch (activeSort) {
            case 'createdAt_asc':
                sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'createdAt_desc':
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            default:
                break;
        }
        return sorted;
    }, [filteredInquiries, activeSort]);

    const searchedInquiries = sortedInquiries.filter((item) =>
        item.inquiryTitle.toLowerCase().includes(search.toLowerCase().trim())
    );

    const handleSort = (newSort: string | null) => {
        setActiveSort(newSort || 'createdAt_desc');
    };

    const handleFilter = (newFilter: string | null) => {
        setActiveFilter(newFilter || 'All');
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    const handleCreate = () => {
        setOpenInquiryModal(true);
    };

    // ✅ Toggle inquiry by ID
    const handleToggleInquiry = (inquiryId: string) => {
        setCheckedInquiries(prev => {
            const newSet = new Set(prev);
            if (newSet.has(inquiryId)) {
                newSet.delete(inquiryId);
            } else {
                newSet.add(inquiryId);
            }
            return newSet;
        });
    };

    const selectAll = () => {
        if (checkedInquiries.size === searchedInquiries.length) {
            setCheckedInquiries(new Set());
        } else {
            setCheckedInquiries(new Set(searchedInquiries.map(i => i._id)));
        }
    };

    const handleEditInquiries = async () => {
        const inquiriesToEdit = storedInquiries
            .filter(inquiry => checkedInquiries.has(inquiry._id))
            .map(inquiry => ({
                ...inquiry,
                handled: true,
                updatedAt: new Date()
            }));

        const result = await editInquiries(inquiriesToEdit);

        if (result.success) {
            setCheckedInquiries(new Set());
            setEdit(false);
        }
    };

    const handleEdit = () => {
        setEdit(!edit);
        if (edit) {
            setCheckedInquiries(new Set());
        }
    };

    const handleSeeItem = (item: IInquiry) => {
        setViewSpecificInquiry(item);
        setOpenInquiryModal(true);
    };

    const handleDelete = async () => {
        const inquiriesToDelete = storedInquiries.filter(inquiry =>
            checkedInquiries.has(inquiry._id)
        );

        if (inquiriesToDelete.length === 0) {
            toast.info('No inquiries selected');
            return;
        }

        const result = await deleteInquiries(inquiriesToDelete);

        if (result.success) {
            setCheckedInquiries(new Set());
            setEdit(false);
        }
    };

    useEffect(() => {
        if (userInfo) setUserInfo(userInfo);
        if (inquiries) setInquiries(inquiries);
    }, [userInfo, inquiries, setUserInfo, setInquiries]);

    return (
        <NavWrapper
            userInfo={userInfo}
            loadingChild={<LoadingOverlayComponent visible={loading} />}
        >
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <PageSpecButtonBox
                    leftHandButtons={
                        <>
                            {!edit && (
                                <>
                                    <BasicSort
                                        widthQuery={width}
                                        handleSort={handleSort}
                                        defaultValue="createdAt_desc"
                                        data={filtersValueKeyInquiries}
                                        value={activeSort}
                                    />
                                    <BasicFilter
                                        widthQuery={width}
                                        handleFilter={handleFilter}
                                        data={[
                                            { label: 'All', value: 'All' },
                                            { label: 'General', value: 'General' },
                                            { label: 'Bug Report', value: 'Bug Report' },
                                            { label: 'Suggestion', value: 'Suggestion' },
                                            { label: 'Feature Request', value: 'Feature Request' }
                                        ]}
                                        defaultFilter={activeFilter}
                                        value={activeFilter}
                                    />
                                </>
                            )}
                            {edit && (
                                <>
                                    <button
                                        type="button"
                                        className="h-content w-content flex flex-row p-1 justify-evenly items-center rounded-md text-sm sm:text-base space-x-1 cursor-pointer hover:text-blue-600 text-blue-500"
                                        onClick={selectAll}
                                    >
                                        <Checkbox
                                            checked={checkedInquiries.size === searchedInquiries.length && searchedInquiries.length > 0}
                                            onChange={selectAll}
                                        />
                                    </button>
                                    <DeleteButton
                                        icon={<FaRegTrashAlt />}
                                        label={`Delete ${checkedInquiries.size}`}
                                        onClick={handleDelete}
                                    />
                                    <button
                                        type="button"
                                        className={`h-content w-content flex flex-row p-1 justify-evenly items-center rounded-md text-sm sm:text-base space-x-1 ${checkedInquiries.size > 0
                                                ? 'cursor-pointer hover:text-green-600 text-green-500'
                                                : 'text-gray-500 cursor-not-allowed'
                                            }`}
                                        onClick={handleEditInquiries}
                                        disabled={checkedInquiries.size === 0}
                                    >
                                        <GrDocumentUpdate />
                                        <p>{checkedInquiries.size === 0 ? 'None to update' : `Complete ${checkedInquiries.size}`}</p>
                                    </button>
                                </>
                            )}
                        </>
                    }
                    leftLabel="Inquiry filters and sorts"
                    rightHandButtons={
                        <div className="flex flex-row justify-evenly items-end w-content h-full space-x-7 pb-1">
                            <EditButton
                                onClick={handleEdit}
                                icon={edit ? <BiCheck /> : <BiPencil />}
                                label={edit ? 'Done' : 'Edit'}
                                optionsLength={filteredInquiries.length}
                            />
                            <button
                                onClick={handleCreate}
                                className="h-content w-content flex flex-row p-1 justify-evenly items-center hover:bg-gray-100 hover:text-blue-300 text-blue-500 rounded-md text-sm sm:text-base space-x-1 cursor-pointer"
                            >
                                Create Inquiry
                            </button>
                        </div>
                    }
                    rightLabel="Add and Edit Inquiries"
                    extraCss={edit ? 'pt-[32px]' : ''}
                />
                <ListWrapper
                    searchBar={<SearchBar
                        handleSearch={handleSearch}
                        searchString={search || 'Search your inquiries'}
                        index={2} leftSection={null} />}
                    currentPage={1}
                    numberOfPages={1}
                    isPending={false} editButtons={undefined}>
                    {searchedInquiries.length > 0 ? (
                        searchedInquiries.map((item, index) => {
                            const handled = item.handled ?? false;
                            return (
                                <InSearchItemButton
                                    key={item._id}
                                    item={item.inquiryTitle}
                                    handleChecked={() => handleToggleInquiry(item._id)}
                                    edit={edit}
                                    checked={checkedInquiries.has(item._id)}
                                    handleSeeItem={() => handleSeeItem(item)}
                                >
                                    <ul className="space-x-2 text-ellipses flex flex-row justify-between items-center w-full h-content space-x-2 pr-4">
                                        <p>{index + 1}. {item.inquiryTitle}</p>
                                        <p>
                                            Completed: <span className={`font-semibold ${handled ? 'text-green-500' : 'text-red-500'}`}>
                                                {handled ? 'Yes' : 'No'}
                                            </span>
                                        </p>
                                    </ul>
                                </InSearchItemButton>
                            );
                        })
                    ) : (
                        <ul className="p-2 text-start pl-7">Empty</ul>
                    )}
                </ListWrapper>
            </ContentWrapper>
        </NavWrapper>
    );
}