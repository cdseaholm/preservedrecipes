
import { redirect } from 'next/navigation';
import { ICommunity } from '@/models/types/community/community';
import CommunityMain from './components/communityMain';
import connectDB from '@/lib/mongodb';
import Community from '@/models/community';
import { serializeDoc } from '@/utils/data/seralize';
import { Metadata } from 'next';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';
import { canDiscoverCommunity } from '@/lib/community-utils';

export const metadata: Metadata = createPageMetadata({
  title: "Communities",
  description: "Browse RecipeSafe communities for shared cooking interests, recipe collections, posts, and group activity.",
});

export default async function Page(props: { searchParams: Promise<{ page?: string, size?: string, search?: string, sort?: string, filter?: string[], status?: string }> }) {

  const searchParams = await props.searchParams;

  if (!searchParams.page || !searchParams.size) {
    redirect('/communities?page=1&size=10');
  }

  const itemsPerPage = parseInt(searchParams.size || '10', 10);
  const currentPage = parseInt(searchParams.page || '1', 10);
  const searchQuery = searchParams.search || null;
  const sortQuery = searchParams.sort || null;
  const filterQuery = searchParams.filter || null;
  const statusQuery = searchParams.status || null;
  //might need to be changed if I add like a "active, inactive" status filter

  try {
    await connectDB();

    const [user, allCommunitiesDocs] = await Promise.all([
      getSessionUser(),
      Community.find({}).lean(),
    ]);
    const allCommunities = allCommunitiesDocs.map(doc => serializeDoc<ICommunity>(doc));

    let userCommunities = [] as ICommunity[];
    if (user) {
      userCommunities = allCommunities.filter(community =>
        community.communityMemberIDs.includes(user._id) ||
        community.adminIDs.includes(user._id) ||
        community.creatorID === user._id
      );
    }

    const discoverableCommunities = allCommunities.filter(community =>
      canDiscoverCommunity(community, user?._id, searchQuery)
    );

    return (
      <CommunityMain
        userInfo={user}
        allCommunities={discoverableCommunities}
        userCommunities={userCommunities}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        searchQuery={searchQuery}
        sortQuery={sortQuery}
        filterQuery={filterQuery}
        statusQuery={statusQuery}
      />
    );
  } catch (error) {
    console.error('Error loading data:', error);
    redirect("/")
  }


}
