'use client'

import { useCombobox, Combobox, Group, Checkbox, Input, InputBase, Pill, PillsInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CommunityFilter({ searchParams, widthQuery, handleTransiton, tags }: { searchParams: ReadonlyURLSearchParams, widthQuery: number, handleTransiton: (url: string) => void, tags: string[] }) {

    const maxVisibleTags = widthQuery < 550 ? 2 : (widthQuery < 768 && widthQuery > 550) ? 3 : (widthQuery < 850 && widthQuery > 768) ? 4 : (widthQuery < 950 && widthQuery > 850) ? 5 : (widthQuery < 1100 && widthQuery > 950) ? 6 : (widthQuery < 1250 && widthQuery > 1100) ? 7 : (widthQuery < 1400 && widthQuery > 1250) ? 8 : 9;
    const generalTextSize = widthQuery < 500 ? '14px' : '16px';
    const statuses = ['all', 'public', 'request', 'private'];

    // Get current filters from URL
    const currentStatus = searchParams.get('status') || 'all';
    const currentFilters = searchParams.getAll('filter');

    const communityFilterForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            pubOrPriv: currentStatus === '' ? 'all' : currentStatus,
            filterTags: currentFilters,
        },
    });

    // Sync form with URL params when they change
    useEffect(() => {
        const status = searchParams.get('status') || 'all';
        const filters = searchParams.getAll('filter');

        communityFilterForm.setInitialValues({
            pubOrPriv: status === '' ? 'all' : status,
            filterTags: filters,
        });
        communityFilterForm.setValues({
            pubOrPriv: status === '' ? 'all' : status,
            filterTags: filters,
        });
    }, [searchParams]);

    const [searchTags, setSearchTags] = useState<string>('');

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
    });

    const handleValueRemove = (val: string) =>
        communityFilterForm.setFieldValue('filterTags', (current) => current.filter((v) => v !== val));

    const handleValueSelect = (val: string) =>
        communityFilterForm.setFieldValue('filterTags', (current) =>
            current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
        );

    const values = communityFilterForm.getValues().filterTags.slice(
        0,
        maxVisibleTags === communityFilterForm.getValues().filterTags.length ? maxVisibleTags : maxVisibleTags - 1
    ).map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const communityTags = tags
        .filter((item) => item.toLowerCase().includes(searchTags.toLowerCase()))
        .map((item) => (
            <Combobox.Option value={item} key={item} active={communityFilterForm.values.filterTags.includes(item)} onClick={() => handleValueSelect(item)}>
                <Group gap="sm">
                    <Checkbox
                        checked={communityFilterForm.values.filterTags.includes(item)}
                        onChange={() => { }}
                        aria-hidden
                        tabIndex={-1}
                        style={{ pointerEvents: 'none' }}
                    />
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    const handleReset = () => {
        communityFilterForm.setValues({
            pubOrPriv: 'all',
            filterTags: [],
        });

        // Apply the reset immediately
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort') || '';
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('size', searchParams.get('size') || '10');
        if (search.trim()) {
            params.set('search', search.trim());
        }
        if (sort) {
            params.set('sort', sort);
        }

        handleTransiton(`/communities?${params.toString()}`);
        combobox.closeDropdown();
    };

    const handleCancel = () => {
        // Revert to URL params (initial values)
        communityFilterForm.reset();
        combobox.closeDropdown();
    };

    const handleFilter = (filters: { public: string, filterTags: string[] }) => {
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort') || '';
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('size', searchParams.get('size') || '10');
        if (search.trim()) {
            params.set('search', search.trim());
        }
        if (sort) {
            params.set('sort', sort);
        }

        if (filters.public !== 'all') {
            params.set('status', filters.public);
        }

        if (filters.filterTags.length > 0) {
            filters.filterTags.forEach(tag => {
                params.append('filter', tag);
            });
        }

        handleTransiton(`/communities?${params.toString()}`);
        combobox.closeDropdown();
    };

    // Check if there are any active filters
    const hasActiveFilters = communityFilterForm.getValues().pubOrPriv !== 'all' || communityFilterForm.getValues().filterTags.length > 0;

    return (
        <Combobox store={combobox} withinPortal={false} width={widthQuery < 460 ? (widthQuery - 20) : (widthQuery * 0.8)} position="bottom-end">
            <Combobox.DropdownTarget>
                <InputBase
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                    label="Filters"
                    styles={{ label: { fontSize: generalTextSize }, input: { fontSize: '14px' } }}
                >
                    {communityFilterForm.getValues().filterTags.length > 0 ? `${communityFilterForm.getValues().pubOrPriv === 'all' ? communityFilterForm.getValues().filterTags.length : (communityFilterForm.getValues().filterTags.length + 1)} filter${(communityFilterForm.getValues().filterTags.length + (communityFilterForm.getValues().pubOrPriv !== 'all' ? 1 : 0)) > 1 ? 's' : ''}` : communityFilterForm.getValues().pubOrPriv !== 'all' ? '1 filter' : <Input.Placeholder>Filters</Input.Placeholder>}
                </InputBase>

            </Combobox.DropdownTarget>

            <Combobox.Dropdown ml={widthQuery < 500 ? 0 : 12}>

                <form id="filter-community-form" className="flex flex-col justify-start items-start space-y-2 p-2 max-h-[60dvh] overflow-y-auto w-full h-content" onSubmit={communityFilterForm.onSubmit(() => handleFilter({ public: communityFilterForm.getValues().pubOrPriv, filterTags: communityFilterForm.getValues().filterTags }))} onAbort={handleCancel}>
                    <Select
                        width={'100%'}
                        label="Filter by Community Status"
                        data={statuses.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))}
                        value={communityFilterForm.getValues().pubOrPriv}
                        onChange={(value) => {
                            if (value) {
                                communityFilterForm.setFieldValue('pubOrPriv', value);
                            }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        w={'100%'}
                        comboboxProps={{ withinPortal: false }}
                    />
                    <PillsInput onClick={() => combobox.openDropdown()} label="Filter by Tags" w={'100%'} rightSection={communityFilterForm.getValues().filterTags.length > 0 ? <Combobox.ClearButton onClear={() => communityFilterForm.setFieldValue('filterTags', [])} /> : null}>
                        <Pill.Group w={'100%'}>
                            {values.length > 0 ? (
                                <>
                                    {values}
                                    {communityFilterForm.getValues().filterTags.length > maxVisibleTags && (
                                        <Pill>+{communityFilterForm.getValues().filterTags.length - (maxVisibleTags - 1)} more</Pill>
                                    )}
                                </>
                            ) : (
                                <Input.Placeholder>Pick one or more values</Input.Placeholder>
                            )}
                            <Combobox.EventsTarget>
                                <PillsInput.Field
                                    value={searchTags}
                                    placeholder="Search values"
                                    onChange={(event) => {
                                        combobox.updateSelectedOptionIndex();
                                        setSearchTags(event.currentTarget.value);
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Backspace' && searchTags.length === 0 && communityFilterForm.getValues().filterTags.length > 0) {
                                            event.preventDefault();
                                            handleValueRemove(communityFilterForm.getValues().filterTags[communityFilterForm.getValues().filterTags.length - 1]);
                                        }
                                    }}
                                    w={'100%'}

                                />
                            </Combobox.EventsTarget>
                        </Pill.Group>
                    </PillsInput>
                    <Combobox.Options w={'100%'}>
                        <div className="flex flex-col justify-start items-start w-full h-content overflow-y-auto max-h-48">
                            {communityTags.length > 0 ? communityTags : <Combobox.Empty>Nothing found...</Combobox.Empty>}
                        </div>
                    </Combobox.Options>
                    <div className="flex flex-row justify-between items-center w-full h-content space-x-2">
                        <button
                            type="button"
                            className={`${!hasActiveFilters ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-400 hover:bg-red-200 cursor-pointer'} text-white px-4 py-2 rounded mt-2 w-full`}
                            disabled={!hasActiveFilters}
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className={`${!communityFilterForm.isDirty() ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-400 cursor-pointer hover:bg-blue-200'} text-white px-4 py-2 rounded mt-2 w-full`}
                            disabled={!communityFilterForm.isDirty()}
                        >
                            Apply Filters
                        </button>
                    </div>
                </form>

            </Combobox.Dropdown>
        </Combobox>
    );
}