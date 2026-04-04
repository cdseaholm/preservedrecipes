'use client'

import { Select } from "@mantine/core";

export default function BasicFilter({ widthQuery, handleFilter, data, defaultFilter, value }: { widthQuery: number, handleFilter: (newFilter: string | null) => void, data: {label: string, value: string}[], defaultFilter: string, value: string | null }) {

    const generalTextSize = widthQuery < 500 ? '14px' : '16px';

    return (
        <Select
            data={data}
            defaultValue={defaultFilter}
            value={value}
            placeholder="Select filter option"
            onChange={(value) => {
                if (value) {
                    handleFilter(value);
                } else {
                    handleFilter(null);
                }
            }}
            w={{ width: widthQuery < 500 ? '80dvw' : 'auto' }}
            unselectable="off"
            styles={{ label: { fontSize: generalTextSize }, input: { fontSize: '14px' } }}
            maxDropdownHeight={'50dvh'}
        />
    );
}
