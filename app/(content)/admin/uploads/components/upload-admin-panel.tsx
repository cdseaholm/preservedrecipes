'use client'

import {
    BackfillRecipeImageKeys,
    DeleteOrphanUploadThingRecipeImages,
    ScanUploadThingRecipeImages,
    UploadAdminFile,
    UploadAdminScanResult,
} from '@/utils/server-actions/uploadthing/admin';
import { Badge, Button, Checkbox, Group, Table, Text } from '@mantine/core';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { BiRefresh, BiTrash } from 'react-icons/bi';
import { MdImageSearch, MdOutlineAutoFixHigh } from 'react-icons/md';

function formatFileSize(size: number) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatUploadDate(uploadedAt: number) {
    const date = new Date(uploadedAt);

    if (Number.isNaN(date.getTime())) {
        return 'Unknown';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export default function UploadAdminPanel({ initialScan }: { initialScan: UploadAdminScanResult }) {
    const [scan, setScan] = useState(initialScan);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    const selectedKeySet = new Set(selectedKeys);
    const allVisibleSelected = scan.orphanFiles.length > 0 && scan.orphanFiles.every(file => selectedKeySet.has(file.key));

    const setSelected = (file: UploadAdminFile, selected: boolean) => {
        setSelectedKeys(current => selected
            ? Array.from(new Set([...current, file.key]))
            : current.filter(key => key !== file.key)
        );
    };

    const refreshScan = () => {
        startTransition(async () => {
            const result = await ScanUploadThingRecipeImages();
            setScan(result);
            setSelectedKeys([]);
            result.success ? toast.success('Upload scan refreshed') : toast.error(result.message);
        });
    };

    const backfillKeys = () => {
        startTransition(async () => {
            const result = await BackfillRecipeImageKeys();

            result.success ? toast.success(result.message) : toast.error(result.message);

            const updatedScan = await ScanUploadThingRecipeImages();
            setScan(updatedScan);
            setSelectedKeys([]);
        });
    };

    const deleteSelected = () => {
        if (selectedKeys.length === 0) {
            toast.info('Select at least one orphaned upload');
            return;
        }

        const confirmed = window.confirm(`Delete ${selectedKeys.length} orphaned upload${selectedKeys.length === 1 ? '' : 's'}? This cannot be undone.`);

        if (!confirmed) {
            return;
        }

        startTransition(async () => {
            const result = await DeleteOrphanUploadThingRecipeImages(selectedKeys);
            result.success ? toast.success(result.message) : toast.error(result.message);

            const updatedScan = await ScanUploadThingRecipeImages();
            setScan(updatedScan);
            setSelectedKeys([]);
        });
    };

    const toggleAllVisible = (selected: boolean) => {
        setSelectedKeys(selected ? scan.orphanFiles.map(file => file.key) : []);
    };

    return (
        <div className="flex w-full flex-col gap-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-md border border-accent/20 bg-secondary/60 p-4">
                    <p className="text-sm font-medium text-mainText/70">Scanned uploads</p>
                    <p className="text-3xl font-bold text-accent">{scan.scannedFileCount}</p>
                </div>
                <div className="rounded-md border border-accent/20 bg-secondary/60 p-4">
                    <p className="text-sm font-medium text-mainText/70">Recipe image keys</p>
                    <p className="text-3xl font-bold text-accent">{scan.recipeImageKeys.length}</p>
                </div>
                <div className="rounded-md border border-accent/20 bg-secondary/60 p-4">
                    <p className="text-sm font-medium text-mainText/70">Missing keys</p>
                    <p className="text-3xl font-bold text-accent">{scan.missingImageKeyCount}</p>
                </div>
                <div className="rounded-md border border-accent/20 bg-secondary/60 p-4">
                    <p className="text-sm font-medium text-mainText/70">Orphaned uploads</p>
                    <p className="text-3xl font-bold text-accent">{scan.orphanFiles.length}</p>
                </div>
            </div>

            <Group justify="space-between" align="center" gap="sm">
                <Group gap="sm">
                    <Button type="button" leftSection={<BiRefresh />} variant="light" loading={isPending} onClick={refreshScan}>
                        Rescan
                    </Button>
                    <Button type="button" leftSection={<MdOutlineAutoFixHigh />} variant="light" loading={isPending} onClick={backfillKeys} disabled={scan.missingImageKeyCount === 0}>
                        Backfill Keys
                    </Button>
                </Group>
                <Button type="button" leftSection={<BiTrash />} color="red" variant="light" loading={isPending} onClick={deleteSelected} disabled={selectedKeys.length === 0}>
                    Delete Selected
                </Button>
            </Group>

            {scan.hasMoreFiles && (
                <div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
                    The scan stopped at the file limit. Rescan after deleting older orphans if more files need review.
                </div>
            )}

            {!scan.success && (
                <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
                    {scan.message}
                </div>
            )}

            <div className="overflow-hidden rounded-md border border-accent/20 bg-cardBack">
                <div className="flex flex-row items-center justify-between gap-3 border-b border-accent/20 px-4 py-3">
                    <div className="flex min-w-0 flex-row items-center gap-2">
                        <MdImageSearch className="shrink-0 text-accent" size={22} />
                        <div className="min-w-0">
                            <p className="font-semibold text-mainText">Orphaned UploadThing files</p>
                            <p className="text-sm text-mainText/60">Files listed here are not referenced by recipe image keys.</p>
                        </div>
                    </div>
                    <Badge variant="light" color={scan.orphanFiles.length > 0 ? 'red' : 'green'}>
                        {scan.orphanFiles.length}
                    </Badge>
                </div>

                {scan.orphanFiles.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table striped highlightOnHover verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th w={48}>
                                        <Checkbox
                                            aria-label="Select all orphaned uploads"
                                            checked={allVisibleSelected}
                                            onChange={(event) => toggleAllVisible(event.currentTarget.checked)}
                                        />
                                    </Table.Th>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Key</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th>Size</Table.Th>
                                    <Table.Th>Uploaded</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {scan.orphanFiles.map(file => (
                                    <Table.Tr key={file.key}>
                                        <Table.Td>
                                            <Checkbox
                                                aria-label={`Select ${file.name}`}
                                                checked={selectedKeySet.has(file.key)}
                                                onChange={(event) => setSelected(file, event.currentTarget.checked)}
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={600}>{file.name || 'Unnamed file'}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="xs" className="max-w-[18rem] truncate font-mono" title={file.key}>{file.key}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color={file.status === 'Uploaded' ? 'green' : 'gray'}>{file.status}</Badge>
                                        </Table.Td>
                                        <Table.Td>{formatFileSize(file.size)}</Table.Td>
                                        <Table.Td>{formatUploadDate(file.uploadedAt)}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </div>
                ) : (
                    <p className="px-4 py-8 text-center text-mainText/60">No orphaned recipe uploads found.</p>
                )}
            </div>
        </div>
    );
}
