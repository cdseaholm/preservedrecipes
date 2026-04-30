'use client'

import { useState, ChangeEvent } from "react";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IInquiry } from "@/models/types/misc/inquiry";
import { IReview } from "@/models/types/misc/review";
import { Accordion } from '@mantine/core';
import SearchBar from "@/components/misc/searchBox/searchBar";
import { ICommunity } from "@/models/types/community/community";

interface HistoryTabContentProps {
    recipesCreated: IRecipe[];
    communitiesCreated: ICommunity[];
    communitiesJoined: ICommunity[];
    inquiriesMade: IInquiry[];
    reviews: IReview[];
}

export default function HistoryTabContent({
    recipesCreated,
    communitiesCreated,
    communitiesJoined,
    inquiriesMade,
    reviews
}: HistoryTabContentProps) {
    
    const [search, setSearch] = useState('');

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    const groupNames = [
        { 
            label: 'Recipes Created', 
            items: recipesCreated.map(r => ({ title: r.name, link: `/u/recipes/${r._id}`, date: r.createdAt })) 
        },
        { 
            label: 'Communities Created', 
            items: communitiesCreated.map(c => ({ title: c.name, link: `/u/communities/${c._id}`, date: c.createdAt })) 
        },
        { 
            label: 'Communities Joined', 
            items: communitiesJoined.map(c => ({ title: c.name, link: `/u/communities/${c._id}`, date: c.createdAt })) 
        },
        { 
            label: 'Inquiries Made', 
            items: inquiriesMade.map(i => ({ title: i.inquiryTitle, link: '', date: i.createdAt })) 
        },
        { 
            label: 'Reviews Made', 
            items: reviews.map((r, i) => ({ title: `Review ${i + 1}`, link: '', date: r.createdAt })) 
        },
    ];

    const filteredGroups = groupNames.map(group => ({
        ...group,
        items: group.items.filter(item => 
            item.title.toLowerCase().includes(search.toLowerCase().trim())
        )
    })).filter(group => group.items.length > 0);

    return (
        <div className="space-y-4">
            <SearchBar 
                handleSearch={handleSearch}
                searchString={search}
                index={1}
                leftSection={null}
            />

            <Accordion multiple className="space-y-3">
                {filteredGroups.map((group, index) => (
                    <Accordion.Item key={index} value={group.label} className="bg-secondaryBack rounded-lg border-0">
                        <Accordion.Control className="hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-lg">
                            <h3 className="font-semibold text-lg">{group.label} ({group.items.length})</h3>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <div className="space-y-2">
                                {group.items.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(item.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {item.link && (
                                            <a 
                                                href={item.link}
                                                className="text-accent hover:underline text-sm"
                                            >
                                                View →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>

            {filteredGroups.length === 0 && (
                <div className="bg-secondaryBack p-8 rounded-lg text-center">
                    <p className="text-gray-600 dark:text-gray-400">No history items found</p>
                </div>
            )}
        </div>
    );
}