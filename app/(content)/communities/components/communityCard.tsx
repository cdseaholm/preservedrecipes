'use client'

import { useModalStore } from "@/context/modalStore";
import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import { useStateStore } from "@/context/stateStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiLockAlt, BiMessageRounded, BiRightArrowAlt, BiShield, BiUserPlus } from "react-icons/bi";
import { toast } from "sonner";

function privacyLabel(level: ICommunity['privacyLevel']) {
    switch (level) {
        case 'public':
            return { text: 'Public', className: 'text-green-700 bg-green-50 border-green-200' };
        case 'restricted':
            return { text: 'Request', className: 'text-amber-700 bg-amber-50 border-amber-200' };
        case 'passwordProtected':
            return { text: 'Password', className: 'text-blue-700 bg-blue-50 border-blue-200' };
        case 'hidden':
            return { text: 'Hidden', className: 'text-gray-700 bg-gray-50 border-gray-200' };
        default:
            return { text: 'Invite only', className: 'text-red-700 bg-red-50 border-red-200' };
    }
}

export default function CommunityCard({ community, index, userInfo }: { community: ICommunity, index: number, userInfo: IUser | null }) {
    const router = useRouter();
    const setRequestToJoinCommunity = useModalStore(state => state.setRequestToJoinCommunity);
    const setIsNavigating = useStateStore(state => state.setIsNavigating);
    const userId = userInfo?._id || '';
    const isMember = !!userId && (community.communityMemberIDs.includes(userId) || community.adminIDs.includes(userId) || community.creatorID === userId);
    const label = privacyLabel(community.privacyLevel);

    const handleProtectedAction = () => {
        if (!userInfo) {
            toast.info('Sign in to join communities');
            return;
        }

        if (isMember || community.privacyLevel === 'public' || community.privacyLevel === 'hidden') {
            setIsNavigating(true);
            router.push(`/communities/${community._id}`);
            return;
        }

        if (community.privacyLevel === 'restricted') {
            setRequestToJoinCommunity({ community, type: 'restricted' });
            return;
        }

        if (community.privacyLevel === 'passwordProtected') {
            setRequestToJoinCommunity({ community, type: 'passwordProtected' });
            return;
        }

        toast.info('This community is invite only');
    };

    const body = (
        <article className="w-full rounded-md border border-accent/15 bg-cardBack/90 p-3 text-mainText shadow-sm transition hover:-translate-y-0.5 hover:border-accent/35 hover:bg-cardBack hover:shadow-[var(--tightShadow)] sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 break-words text-base font-semibold leading-snug sm:text-lg">{community.name}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${label.className}`}>
                            {community.privacyLevel === 'passwordProtected' ? <BiLockAlt /> : community.privacyLevel === 'restricted' ? <BiMessageRounded /> : <BiShield />}
                            {label.text}
                        </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-mainText/70">{community.description || 'A recipe-focused community.'}</p>
                    <div className="flex flex-wrap gap-2">
                        {community.tags.slice(0, 4).map(tag => (
                            <span key={`${community._id}-${tag}`} className="rounded-md bg-mainBack/70 px-2 py-1 text-xs text-mainText/70">{tag}</span>
                        ))}
                    </div>
                </div>
                <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-accent/10 pt-2 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                    <p className="text-xs sm:text-sm text-mainText/65">{community.communityMemberIDs.length} members</p>
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                        {isMember || community.privacyLevel === 'public' || community.privacyLevel === 'hidden' ? 'Open' : 'Join'}
                        {isMember || community.privacyLevel === 'public' || community.privacyLevel === 'hidden' ? <BiRightArrowAlt size={18} /> : <BiUserPlus size={18} />}
                    </span>
                </div>
            </div>
        </article>
    );

    return community.privacyLevel === 'public' || community.privacyLevel === 'hidden' || isMember ? (
        <Link key={index} href={`/communities/${community._id}`} onClick={() => setIsNavigating(true)} className="mb-3 block w-full">
            {body}
        </Link>
    ) : (
        <button key={index} type="button" onClick={handleProtectedAction} className="block w-full cursor-pointer text-left" aria-label={`Join ${community.name}`}>
            {body}
        </button>
    );
}
