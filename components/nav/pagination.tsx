'use client'

import { Group, Pagination } from '@mantine/core';
import { useStateStore } from '@/context/stateStore';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PaginationComp({ totalPages, currentPage, onChange }: { totalPages: number, currentPage: number, onChange?: (page: number) => void }) {
    
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [activePage, setPage] = useState<number>(currentPage);
    const setIsNavigating = useStateStore(state => state.setIsNavigating);

    const handlePageChange = (page: number) => {
        setPage(page);
        if (onChange) {
            onChange(page);
            return;
        }

        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        if (!params.get('size')) params.set('size', '10');
        setIsNavigating(true);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Pagination.Root total={totalPages} value={activePage} onChange={handlePageChange}>
            <Group gap={5} justify='center'>
                <Pagination.First />
                <Pagination.Previous />
                <Pagination.Items />
                <Pagination.Next />
                <Pagination.Last />
            </Group>
        </Pagination.Root>
    );
}
