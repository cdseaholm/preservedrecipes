'use client';

import { useEffect, useState } from 'react';
import { ICommunity } from '@/models/types/community';
import { IPost } from '@/models/types/post';
import { IRecipe } from '@/models/types/recipe';
import SpecificCommunityPage from '@/components/pageSpecifics/communities/communitySpecific/specificPage';
import { useParams } from 'next/navigation';
import { IPermissions } from '@/models/types/permission';

const fakeData = {
    communities: Array.from({ length: 10 }, (_, index) => ({
        name: `Community ${index + 1}`,
        _id: `${index + 1}`,
        creatorIDs: [{ id: '1', name: 'Cael', secret: 'hush', permissionStatus: 'Admin' } as IPermissions] as IPermissions[],
        recipes: [] as IRecipe[],
        communityMemberIDs: [`member-${index + 1}`],
        public: true,
        posts: [] as IPost[],
    })) as ICommunity[],
    numberOfPages: 10,
};

export default function CommunityPage() {
    const { id } = useParams();
    const [community, setCommunity] = useState<ICommunity | null>(null);

    useEffect(() => {
        if (id) {
            const foundCommunity = fakeData.communities.find((community) => community._id === id);
            setCommunity(foundCommunity || null);
        }
    }, [id]);

    if (!community) {
        return <div>Loading...</div>;
    }

    return <SpecificCommunityPage community={community} />;
}