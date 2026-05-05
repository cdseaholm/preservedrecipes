'use client'

import { ICommunity } from "@/models/types/community/community";
import { IUser } from "@/models/types/personal/user";
import { BiLogOut, BiUserPlus } from "react-icons/bi";
import { toast } from "sonner";

export default function UserSettingsTab({ isAdmin, community, userInfo }: { isAdmin: boolean, community: ICommunity, userInfo: IUser | null }) {
    const userId = userInfo?._id || '';
    const isMember = !!userId && (community.communityMemberIDs.includes(userId) || community.adminIDs.includes(userId) || community.creatorID === userId);

    const joinPublic = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const response = await fetch(`${baseUrl}/api/community/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ communityID: community._id }),
            });
            const data = await response.json();
            if (!response.ok || data.status !== 200) {
                toast.error(data.message || 'Unable to join community');
                return;
            }
            toast.success('Joined community');
            window.location.reload();
        } catch {
            toast.error('Unable to join community');
        }
    };

    return (
        <div className="flex min-h-[50dvh] w-full justify-center p-4">
            <section className="w-full max-w-2xl rounded-md border border-mainText/15 bg-cardBack p-4">
                <h2 className="text-lg font-semibold text-mainText">Membership</h2>
                <p className="mt-1 text-sm text-mainText/70">
                    {isMember ? 'You can post recipe discussions and share non-private recipes here.' : 'Join this public community before posting or sharing recipes.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                    {!isMember && community.privacyLevel === 'public' && (
                        <button onClick={joinPublic} type="button" className="inline-flex items-center gap-1 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            <BiUserPlus /> Join Community
                        </button>
                    )}
                    {isMember && !isAdmin && (
                        <button onClick={() => toast.info('Leave community coming soon')} type="button" className="inline-flex items-center gap-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                            <BiLogOut /> Leave Community
                        </button>
                    )}
                    {isAdmin && <p className="text-sm text-mainText/70">Admins keep the community focused and review incoming requests.</p>}
                </div>
            </section>
        </div>
    )
}
