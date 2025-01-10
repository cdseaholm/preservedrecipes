'use client'

import { ICommunity } from "@/models/types/community";
import { IUser } from "@/models/types/user";
import { useState, useEffect } from "react";
import HeaderRow from "./headerRow";
import MainPosts from "./mainPosts";

export default function SpecificCommunityPage({ community }: { community: ICommunity }) {

    const [creators, setCreators] = useState<IUser[]>([]);

    useEffect(() => {
        // Fetch creator's information based on IDs
        const fetchCreators = async () => {
            const creatorData = await Promise.all(
                community.creatorIDs.map(async (id) => {
                    const response = await fetch(`/api/users/${id}`);
                    return response.json();
                })
            );
            setCreators(creatorData);
        };

        fetchCreators();
    }, [community.creatorIDs]);

    return (
        <div className="flex flex-col justify-start items-center w-full h-full p-2 space-y-2">
            <HeaderRow community={community} creators={creators} />
            <MainPosts posts={community.posts} />
        </div>
    )
}