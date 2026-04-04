'use client'


import { useModalStore } from "@/context/modalStore";
import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CommunityCard({ community, index, userInfo }: { community: ICommunity, index: number, userInfo: IUser | null }) {

    const router = useRouter();
    const setRequestToJoinCommunity = useModalStore(state => state.setRequestToJoinCommunity);
    const privacyClick = () => {
        community.adminIDs.includes(userInfo?._id as string) || community.communityMemberIDs.includes(userInfo?._id as string) || userInfo?._id === community.creatorID ? (
            router.push(`/communities/${community._id}`)
        ) : community.privacyLevel === 'private' ? (
            toast.info('This is a private community. You must know someone in the community to join.')
        ) : community.privacyLevel === 'restricted' ? (
            setRequestToJoinCommunity({ community: community, type: 'restricted' })
        ) : (
            setRequestToJoinCommunity({ community: community, type: 'passwordProtected' })
        );
    }

    return (
        userInfo && community.privacyLevel === 'public' ? (
            <Link key={index} className="mb-4 w-full p-2 border border-mainText/40 bg-cardBack text-mainText text-center rounded-md flex flex-col h-full justify-between items-center hover:bg-slate-200 cursor-pointer" style={{ height: '8vh' }} href={`/communities/${community._id}`}>
                <div className="flex flex-row justify-between items-center w-full h-fit text-sm md:text-base">
                    <p>{community.name}</p>
                    <p className={`text-green-400`}>{'Public'}</p>
                </div>
                <div className="flex flex-row justify-start items-center w-full h-fit space-x-5 text-xs md:text-sm">
                    <p className="pl-4">{`Member Size: ${community.communityMemberIDs.length}`}</p>
                </div>
            </Link>
        ) : (!userInfo || !userInfo._id || userInfo._id === '') ? (
            <div key={index} className="mb-4 w-full p-2 border border-mainText/40 bg-cardBack text-mainText text-center rounded-md flex flex-col h-full justify-between items-center opacity-50" style={{ height: '8vh' }} aria-label="Private Community">
                <div className="flex flex-row justify-between items-center w-full h-fit text-sm md:text-base">
                    <p>{community.name}</p>
                    <p className={`text-red-400`}>{'Private'}</p>
                </div>
                <div className="flex flex-row justify-start items-center w-full h-fit space-x-5 text-xs md:text-sm">
                    <p className="pl-4">{`Member Size: ${community.communityMemberIDs.length}`}</p>
                </div>
            </div>
        ) : (
            <button key={index} className="mb-4 w-full p-2 border border-mainText/40 bg-cardBack text-mainText text-center rounded-md flex flex-col h-full justify-between items-center cursor-pointer" style={{ height: '8vh' }} aria-label="Private Community" onClick={() => privacyClick()}>
                <div className="flex flex-row justify-between items-center w-full h-fit text-sm md:text-base">
                    <p>{community.name}</p>
                    {community.privacyLevel === 'passwordProtected' ? (
                        <p className={`text-red-400`}>{'Private'}</p>
                    ) : community.privacyLevel === 'restricted' ? (
                        <p className={`text-yellow-400`}>{'Request'}</p>
                    ) : (
                        <p className={`text-red-400`}>{'Private'}</p>
                    )}
                </div>
                <div className="flex flex-row justify-start items-center w-full h-fit space-x-5 text-xs md:text-sm">
                    <p className="pl-4">{`Member Size: ${community.communityMemberIDs.length}`}</p>
                </div>
            </button>
        )
    )
}