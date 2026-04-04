'use client'

import ContentWrapper from "@/components/wrappers/contentWrapper"
import NavWrapper from "@/components/wrappers/navWrapper"
import { IPost } from "@/models/types/misc/post"
import { IUser } from "@/models/types/personal/user"

export default function PostView({ userInfo, post }: { post: IPost, userInfo: IUser | null }) {

    //will need to update the menu for the post specific options later


    //check spec-community params in nav wrapper for the menu options, will need to pass down some of the community info to determine what options to show
    return (
        <NavWrapper loadingChild={null} userInfo={userInfo}>
            <ContentWrapper containedChild={true} paddingNeeded={true}>
                <h2 className="text-2xl font-bold underline">{post.name}</h2>
                <p className="whitespace-pre-wrap">{post.content}</p>
            </ContentWrapper>
        </NavWrapper>
    )
}