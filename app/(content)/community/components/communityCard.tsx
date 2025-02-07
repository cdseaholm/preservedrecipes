'use client'

import { ICommunity } from "@/models/types/community";
import Link from "next/link";

export default function CommunityCard({ community, index }: { community: ICommunity, index: number }) {
    return (
        <Link key={index} className="mb-4 w-full m-1 p-2 border border-mainText/40 bg-mainContent text-mainText text-center rounded-md flex flex-col w-full h-full justify-between items-center hover:bg-slate-200" style={{ height: '8vh' }} href={`/community/${community._id}`}>
            <div className="flex flex-row justify-between items-center w-full h-fit text-sm md:text-base">
                <p>{community.name}</p>
                <p className={`${community.public ? 'text-green-400' : 'text-red-400'}`}>{community.public ? 'Public' : 'Private'}</p>
            </div>
            <div className="flex flex-row justify-start items-center w-full h-fit space-x-5 text-xs md:text-sm">
                <p className="pl-4">{`Member Size: ${community.communityMemberIDs.length}`}</p>
            </div>
        </Link>
    )
}