
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { serializeDoc } from '@/utils/data/seralize';
import Community from '@/models/community';
import { ICommunity } from '@/models/types/community/community';
import { CommunityMember } from '@/models/types/community/community-member';
import Request from '@/models/requests';
import { IRequest, IRequesterInfo } from '@/models/types/misc/request';
import MembersMain from './components/members-main';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/")
    }

    const { id } = await params;

    if (!id) {
        redirect("/");
    }

    let userInfo: IUser | null = null;

    try {

        await connectDB();

        if (session && session.user && session.user.email) {
            const userDoc = await User.findOne({ email: session.user.email }).lean();
            userInfo = serializeDoc<IUser>(userDoc);
        }

        const communityDoc = await Community.findById(id).lean() as ICommunity | null;

        if (!communityDoc) {
            redirect("/");
        }

        const community = serializeDoc<ICommunity>(communityDoc);

        if (!community) {
            redirect("/communities");
        }

        const requesters = [] as IRequesterInfo[];

        if (community.privacyLevel !== 'public' && community.requestIDs && community.requestIDs.length > 0) {
            const requestDoc = await Request.find({ requestFor: 'community'}).lean();
            const serializedRequests = requestDoc.map(serializeDoc<IRequest>);
            const filteredRequests = serializedRequests.filter(req => community.requestIDs.includes(req._id));
            if (filteredRequests && filteredRequests.length > 0) {
                const requesterInfoRaw = await User.find({ _id: { $in: filteredRequests.map(req => req.requesterID) } }).lean();
                const requesterInfoSerialized = requesterInfoRaw.map(serializeDoc<IUser>);
                filteredRequests.map(req => {
                    const thisUser = requesterInfoSerialized.find(user => user && user._id === req.requesterID);
                    if (thisUser) {
                        requesters.push({
                            id: req._id,
                            name: thisUser.name ? thisUser.name : 'Unknown User',
                            email: thisUser.email ? thisUser.email : '',
                            request: req,
                        } as IRequesterInfo);
                    }
                });
            }
        }

        const membersRaw = await User.find({ _id: { $in: community.communityMemberIDs } }).lean();

        if (!membersRaw) {
            redirect("/");
        }

        const membersSerialized = membersRaw.map(serializeDoc<IUser>);
        
        const members = [] as CommunityMember[];
        membersSerialized.map(thisUser =>  {
            if (thisUser) {
                const thisMember = {
                    memberEmail: thisUser.email ? thisUser.email : '',
                    name: thisUser.name ? thisUser.name : 'Unknown User',
                    id: thisUser._id,
                    permissionStatus: community.creatorID === thisUser._id ? 'creator' : community.adminIDs.includes(thisUser._id) ? 'admin' : 'member',
                } as CommunityMember;
                members.push(thisMember);
            }
        });

        return (
            <MembersMain members={members} userInfo={userInfo} community={community} requesters={requesters} />
        )

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}