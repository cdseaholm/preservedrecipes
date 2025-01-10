'use client'

import PostTemplate from "@/components/templates/postTemplate"
import { IPost } from "@/models/types/post"
import { toast } from "sonner"

export default function MainPosts({ posts }: { posts: IPost[] }) {
    return (
        <section className="border border-accent/50 rounded-md flex flex-col justify-start items-center w-full h-full p-2 bg-mainContent">
            <div className="flex flex-row justify-start items-center w-full h-fit border-b p-1 space-x-2">
                <button onClick={() => toast.info('Creating Post')} className="text-blue-400 hover:text-black hover:bg-gray-400 rounded-md p-1">
                    + Create Post
                </button>
                <button onClick={() => toast.info('Your posts')} className="text-blue-400 hover:text-black hover:bg-gray-400 rounded-md p-1">
                    Your Posts
                </button>
            </div>
            {posts.length > 0 ? (
                posts.map((post: IPost, index: number) => {
                    return (<PostTemplate post={post} key={index} />)
                })
            ) : (
                <p className="flex flex-row justify-center items-center w-full h-full">No Posts</p>
            )}
        </section>
    )
}