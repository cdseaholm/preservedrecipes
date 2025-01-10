'use client'

import { IPost } from "@/models/types/post"

export default function PostTemplate({ post }: { post: IPost }) {
    return (
        <div className="flex flex-row justify-center items-center border-highlight border rounded-md">
            {post.content}
        </div>
    )
}