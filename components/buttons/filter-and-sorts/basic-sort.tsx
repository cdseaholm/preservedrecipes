'use client'

import { Select } from "@mantine/core";

export default function BasicSort({ widthQuery, handleSort, data, defaultValue, value }: { widthQuery: number, handleSort: (newSort: string | null) => void, data: {label: string, value: string}[], defaultValue: string, value: string | null }) {

    const generalTextSize = widthQuery < 500 ? '14px' : '16px';

    return (
        <Select
            data={data}
            defaultValue={defaultValue}
            value={value}
            placeholder="Select sort option"
            onChange={(value) => {
                if (value) {
                    handleSort(value);
                } else {
                    handleSort(null);
                }
            }}
            w={{ width: widthQuery < 500 ? 100 : (widthQuery > 500 && widthQuery < 768) ? 150 : 300 }}
            unselectable="off"
            styles={{ label: { fontSize: generalTextSize }, input: { fontSize: '14px' } }}
        />
    );
}
