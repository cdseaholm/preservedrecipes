'use client'

import { Group, Pagination } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PaginationComp({ totalPages, currentPage }: { totalPages: number, currentPage: number }) {
    const router = useRouter();
    const [activePage, setPage] = useState<number>(currentPage);

    const handlePageChange = (page: number) => {
        setPage(page);
        router.push(`/community?page=${page}`);
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