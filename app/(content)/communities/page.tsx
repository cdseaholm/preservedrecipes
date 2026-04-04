
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { IUser } from '@/models/types/personal/user';
import { ICommunity } from '@/models/types/community/community';
import CommunityMain from './components/communityMain';
import connectDB from '@/lib/mongodb';
import Community from '@/models/community';
import User from '@/models/user';
import { serializeDoc } from '@/utils/data/seralize';

export default async function Page(props: { searchParams: Promise<{ page?: string, size?: string, search?: string, sort?: string, filter?: string[], status?: string }> }) {

  const searchParams = await props.searchParams;
  const session = await getServerSession();

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

    let user = null as IUser | null;
    if (session && session.user && session.user.email) {
      const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;
      user = serializeDoc<IUser>(userDoc);
    }

    // Fetch recipes if user has any
    const allCommunitiesDocs = await Community.find({}).lean();
    const allCommunities = allCommunitiesDocs.map(doc => serializeDoc<ICommunity>(doc));
    const nonHiddenCommunities = allCommunities.filter(community => community.privacyLevel !== 'hidden');

    let userCommunities = [] as ICommunity[];
    if (user) {
      userCommunities = allCommunities.filter(community =>
        community.communityMemberIDs.includes(user._id)
      );
    }

    return (
      <CommunityMain
        userInfo={user}
        allCommunities={nonHiddenCommunities}
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