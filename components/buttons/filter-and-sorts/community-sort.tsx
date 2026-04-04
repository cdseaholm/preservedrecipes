'use client'

import { Select } from "@mantine/core"
import { ReadonlyURLSearchParams } from "next/navigation";

export const sortValueKey = [
    { label: 'Name (A-Z)', value: 'name_asc' },
    { label: 'Name (Z-A)', value: 'name_desc' },
    { label: 'Members (Most)', value: 'members_desc' },
    { label: 'Members (Least)', value: 'members_asc' },
    { label: 'Created At (Newest)', value: 'createdAt_desc' },
    { label: 'Created At (Oldest)', value: 'createdAt_asc' },
    { label: 'Activity (Most)', value: 'activity_desc' },
    { label: 'Activity (Least)', value: 'activity_asc' }
];

export default function SortCommunities({ searchParams, widthQuery, handleTransiton }: { searchParams: ReadonlyURLSearchParams, widthQuery: number, handleTransiton: (url: string) => void }) {

    const generalTextSize = widthQuery < 500 ? '14px' : '16px';

    const handleSort = (value: string) => {
        const search = searchParams.get('search') || '';
        const filters = searchParams.getAll('filter');
        const status = searchParams.get('status') || '';

        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('size', searchParams.get('size') || '10');
        if (search.trim()) {
            params.set('search', search.trim());
        }

        // Preserve all filter tags
        filters.forEach(filter => {
            if (filter.trim()) {
                params.append('filter', filter.trim());
            }
        });

        if (status.trim()) {
            params.set('status', status.trim());
        }
        params.set('sort', value);

        handleTransiton(`/communities?${params.toString()}`);
    }

    return (
        <Select
            data={sortValueKey}
            defaultValue="name_asc"
            label="Sort"
            placeholder="Select sort option"
            onChange={(value) => {
                if (value) {
                    handleSort(value);
                } else {
                    handleSort('name_asc');
                }
            }}
            w={{ width: widthQuery < 500 ? 100 : (widthQuery > 500 && widthQuery < 768) ? 150 : 300 }}
            unselectable="off"
            styles={{ label: { fontSize: generalTextSize }, input: { fontSize: '14px' } }}
        />
    )
}

{/* <Select
                data={['All Communities', 'My Communities', 'Popular Communities']}
                defaultValue="All Communities"
                label="Filter Communities"
                placeholder="Select filter"
                onChange={(value) => {
                    if (value) {
                        handleFilterChange(value);
                    }
                }}
                w={{ width: 200 }}
            /> */}