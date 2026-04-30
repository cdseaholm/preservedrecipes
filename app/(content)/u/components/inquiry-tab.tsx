'use client'

import { useState, ChangeEvent } from "react";
import { useInquiryActions } from "@/components/hooks/inquiry/inquiry-hooks";
import SearchBar from "@/components/misc/searchBox/searchBar";
import { toast } from "sonner";

export default function InquiryTabContent() {
    
    const [search, setSearch] = useState('');
    const { storedInquiries } = useInquiryActions();

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
    };

    const searchedInquiries = storedInquiries.filter((item) =>
        item.inquiryTitle.toLowerCase().includes(search.toLowerCase().trim())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <SearchBar 
                    handleSearch={handleSearch}
                    searchString={search}
                    index={1}
                    leftSection={null}
                />
                <button
                    onClick={() => toast.info("Create inquiry modal coming soon")}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors text-sm"
                >
                    New Inquiry
                </button>
            </div>

            <div className="space-y-2">
                {searchedInquiries.length > 0 ? (
                    searchedInquiries.map((inquiry, index) => (
                        <div 
                            key={inquiry._id}
                            className="bg-secondaryBack p-4 rounded-lg shadow-md flex justify-between items-center"
                        >
                            <div className="flex-1">
                                <p className="font-medium">{index + 1}. {inquiry.inquiryTitle}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {inquiry.inquiryType}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-sm font-semibold ${inquiry.handled ? 'text-green-500' : 'text-red-500'}`}>
                                    {inquiry.handled ? '✓ Completed' : '⏳ Pending'}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-secondaryBack p-8 rounded-lg text-center">
                        <p className="text-gray-600 dark:text-gray-400">No inquiries found</p>
                    </div>
                )}
            </div>
        </div>
    );
}