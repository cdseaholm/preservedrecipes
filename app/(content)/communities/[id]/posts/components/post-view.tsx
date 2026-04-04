'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper"
import ListWrapper from "@/components/wrappers/list-wrapper"
import NavWrapper from "@/components/wrappers/navWrapper"
import { IPost } from "@/models/types/misc/post"
import { IUser } from "@/models/types/personal/user"

export default function PostView({ userInfo, post }: { post: IPost, userInfo: IUser | null }) {

    //will need to update the menu for the post specific options later

    return (
        <NavWrapper loadingChild={null} userInfo={userInfo}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <div className="flex flex-row justify-between items-center w-full mb-4 px-6">
                    <button onClick={() => window.history.back()} className="text-sm text-blue-500 hover:underline cursor-pointer">Go Back</button>
                    <h2 className="text-2xl font-bold underline">{post.name}</h2>
                </div>
                <ListWrapper
                    numberOfPages={1}
                    isPending={false}
                    currentPage={1}
                    searchBar={null} editButtons={undefined}>
                    <div className="flex flex-col justify-start items-center w-full p-4 bg-cardBack border border-accent/30 rounded-md">
                        {post.type && <h3 className="text-xl font-semibold mb-2">{post.type.slice(0, 1).toUpperCase() + post.type.slice(1)}</h3>}
                        <p className="mb-1"><span className="font-semibold">Content:</span></p>
                        <div className="w-full p-2 border border-accent/30 bg-mainBack rounded-md">
                            <p>{post.content}</p>
                        </div>
                    </div>
                </ListWrapper>
            </ContentWrapper>
        </NavWrapper>
    )
}