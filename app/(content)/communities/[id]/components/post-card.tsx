'use client'


import { IPost } from "@/models/types/misc/post";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export default function PostCard({ index, post, communityId }: { index: number, post: IPost, communityId: string }) {

    return (
        <Link key={index} className="mb-4 p-2 border border-mainText/40 bg-cardBack text-mainText text-center rounded-md flex flex-row w-full h-full justify-between items-center hover:bg-slate-200" style={{ height: '8vh' }} href={`/communities/${communityId}/posts/${post._id}`}>
            <div className="flex flex-col justify-between items-start w-full h-full text-sm md:text-base">
                <p>{post.name}</p>
                <p>{post.category.length > 0 ? post.category[0] : 'Uncategorized'}</p>
            </div>
            <FiChevronRight size={20} />
        </Link>
    )
}