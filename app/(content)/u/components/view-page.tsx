'use client'

import { ChangeEvent, useState } from "react";
import PageSpecButtonBox from "@/components/buttons/page-spec-button-box/page-spec-button-box";
import ContentWrapper from "@/components/wrappers/contentWrapper";
import { IUserView } from "@/models/types/family/member-view";
import InSearchItemButton from "@/components/buttons/inSearchItemButton";
import SearchBar from "@/components/misc/searchBox/searchBar";
import ListWrapper from "@/components/wrappers/list-wrapper";
import { useCombobox, Accordion, Combobox, InputBase, Input, Select } from "@mantine/core";
import { DateValue, DatePicker } from "@mantine/dates";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";

export type GroupItem = {
    title: string;
    val: any;
    link: string;
}

export default function ViewPage({ memberToView }: { memberToView: IUserView }) {

    const combobox = useCombobox({

    });
    const [loading, setLoading] = useState(false);
    const [dateValue, setDateValue] = useState<[DateValue | null, DateValue | null]>([null, null]);
    const [groupFilter, setGroupFilter] = useState<string | null>(null);
    const router = useRouter();

    {/**Need to smooth out the new Reviews that holds both Comments and Ratings */ }
    const groupNames = [
        { label: 'Communities', options: [...memberToView.publicCommunities.map((comm) => ({ title: comm.name, val: comm, link: `communities/${comm._id}` })), ...(memberToView.overlappingCommunities?.map((comm) => ({ title: comm.name, val: comm, link: `communities/${comm._id}` })) ?? [])] },
        { label: 'Recipes', options: memberToView.publicRecipes.map((rec) => ({ title: rec.name, val: rec, link: `recipes/${rec._id}` })) },
        { label: 'Comments Made', options: memberToView.publicReviews.map((review, index) => ({ title: `Comment ${index + 1}`, val: review.comment, link: null })) },
        { label: 'Ratings Given', options: memberToView.publicReviews.map((review, index) => ({ title: `Review ${index + 1}`, link: null, val: review.rating })) },
        memberToView.sameFamily && { label: 'Family Membership', options: [{ title: `Member of ${memberToView.familyMemberName}'s Family`, val: memberToView.familyMemberID, link: `family/${memberToView.familyMemberID}` }] }
    ] as { label: string, options: GroupItem[] }[];

    const allGroups = groupNames.reduce((acc, group) => {
        acc.push(...group.options);
        return acc;
    }, [] as any[]);

    const [search, setSearch] = useState('');

    const shouldFilterOptions = allGroups.every((item) => item !== search);
    const filteredGroups = groupNames.map((group) => {
        if (!groupFilter || group.label === groupFilter) {
            const filteredOptions = shouldFilterOptions
                ? group.options.filter((item) => item.title.toLowerCase().includes(search.toLowerCase().trim()))
                : group.options;

            return { ...group, options: filteredOptions };
        }
    });

    const options = filteredGroups.map((group, _grpIndex) => {
        if (!group || group === undefined || group.options.length === 0) return null;

        if (dateValue[0] && !dateValue[1] && group.options && group.options.some(item => (dateValue[0] && item.val.createdAt < dateValue[0]))) return null;
        if (dateValue[0] && dateValue[1] && (group.options && group.options.some(item => (dateValue[0] && item.val.createdAt < dateValue[0]) || (dateValue[1] && item.val.createdAt > dateValue[1])))) return null;

        const options = group.options.map((item, index) => {
            if (!item) return null;

            const itemDate = new Date(item.val.createdAt);

            // Single date: only show items on that date
            if (dateValue[0] && !dateValue[1]) {
                const selectedDate = new Date(dateValue[0]);
                selectedDate.setHours(0, 0, 0, 0);
                const itemDateOnly = new Date(itemDate);
                itemDateOnly.setHours(0, 0, 0, 0);
                if (itemDateOnly.getTime() !== selectedDate.getTime()) return null;
            }

            // Date range: show items between dates
            if (dateValue[0] && dateValue[1]) {
                if (itemDate < dateValue[0] || itemDate > dateValue[1]) return null;
            }

            return (
                <InSearchItemButton key={`${item.title}-${index}`} item={`${item.title}-${index}`} edit={false} checked={false} handleChecked={() => { }} handleSeeItem={item.link ? () => router.push(`/${item.link}`) : () => { }}>
                    {item.title}
                </InSearchItemButton>
            )
        });

        return (
            <Accordion.Item key={_grpIndex} value={group.label} w={'100%'} bd={0}>
                <div className="flex flex-col justify-start items-center h-content w-full rounded-md border border-white p-1 bg-mainBack" key={_grpIndex}>
                    <Accordion.Control w={'100%'}>
                        <h3 className="flex flex-row justify-center items-center font-semibold text-lg w-full text-center px-2">{group.label}</h3>
                    </Accordion.Control>
                    <Accordion.Panel w={'100%'}>
                        {options.length > 0 ? options : <p className="flex flex-row justify-center items-center w-full">- No {group.label} found -</p>}
                    </Accordion.Panel>
                </div>
            </Accordion.Item>

        );
    });

    const formatDateValue = (dateVal: DateValue | null): string => {
        if (!dateVal) return '';

        let date: Date;

        if (dateVal instanceof Date) {
            date = dateVal;
        } else {
            // Handle string dates in local timezone
            const dateStr = String(dateVal);
            if (dateStr.includes('T')) {
                // Already has time component
                date = new Date(dateStr);
            } else {
                // Date-only string like "2026-01-01" - parse as local date
                const [year, month, day] = dateStr.split('-').map(Number);
                date = new Date(year, month - 1, day);
            }
        }

        return date.toLocaleDateString('en-US');
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        setSearch(e.currentTarget.value);
        setLoading(false);
    }

    return (
        <ContentWrapper containedChild={true} paddingNeeded={true}>

            <PageSpecButtonBox leftHandButtons={<Combobox
                store={combobox}
                withinPortal={false}
                width={'auto'}
            >
                <Combobox.Target
                >
                    <InputBase
                        label="Filter by Date(s)"
                        component="button"
                        type="button"
                        pointer
                        rightSection={dateValue[0] && <IoMdClose size={16} onClick={() => setDateValue([null, null])} className="cursor-pointer" />}
                        onClick={() => combobox.toggleDropdown()}
                        className={`cursor-pointer ${dateValue[0] ? 'w-auto' : 'w-[200px]'}`}
                    >
                        {dateValue[0] && !dateValue[1] ? (
                            formatDateValue(dateValue[0])
                        ) : dateValue[0] && dateValue[1] ? (
                            `${formatDateValue(dateValue[0])} - ${formatDateValue(dateValue[1])}`
                        ) : (
                            <Input.Placeholder>-No Date Selected-</Input.Placeholder>
                        )}
                    </InputBase>
                </Combobox.Target>
                <Combobox.Dropdown w={'auto'} p={10}>
                    <DatePicker
                        type="range"
                        value={dateValue}
                        onChange={setDateValue}
                        allowSingleDateInRange={true}
                        locale="en-US"
                    />
                </Combobox.Dropdown>
            </Combobox>} rightHandButtons={<Select
                label="Filter"
                placeholder="Choose a Group"
                data={groupNames.map((group) => group.label)}
                onChange={(val) => {
                    setLoading(true);
                    setGroupFilter(val);
                    setLoading(false);
                }}
            />}
                leftLabel="Sort and Filter" rightLabel="Filter" />


            {/**Need to update left section and editbuttons */}
            <ListWrapper numberOfPages={1} isPending={loading} currentPage={1} searchBar={<SearchBar handleSearch={handleSearch} searchString={search} index={1} leftSection={null} />} editButtons={undefined}>

                <Accordion w={'100%'} multiple className="flex flex-col justify-start items-center space-y-4" bd={0}>
                    {options}
                </Accordion>
            </ListWrapper>
        </ContentWrapper>
    );
}