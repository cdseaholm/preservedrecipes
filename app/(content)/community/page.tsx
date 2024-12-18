import { redirect } from 'next/navigation';
import CommunityMain from '@/components/pageSpecifics/communities/communityMain';
import { getServerSession, Session } from 'next-auth';
import { ICommunity } from '@/models/types/community';
import { IRecipe } from '@/models/types/recipe';
import { IPost } from '@/models/types/post';

const fakeData = {
  communities: Array.from({ length: 10 }, (_, index) => ({
    name: `Community ${index + 1}`,
    _id: `${index + 1}`,
    creatorIDs: [`creator-${index + 1}`],
    recipes: [] as IRecipe[],
    communityMemberIDs: [`member-${index + 1}`],
    public: true,
    posts: [] as IPost[],
  })) as ICommunity[],
  numberOfPages: 10,
};

export default async function CommunityPage({ searchParams }: { searchParams: { page?: string } }) {
  const session: Session | null = await getServerSession();

  // Redirect to /community?page=1 if no page query parameter is present
  if (!searchParams.page) {
    redirect('/community?page=1');
  }

  const itemsPerPage = 4;
  const pageNums = Math.ceil(fakeData.communities.length / itemsPerPage);
  const currentPage = parseInt(searchParams.page || '1', 10);

  // Calculate start and end indices for slicing the communities array
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCommunities = fakeData.communities.slice(startIndex, endIndex);

  return (
    <CommunityMain
      session={session}
      communities={paginatedCommunities}
      currentPage={currentPage}
      numberOfPages={pageNums}
    />
  );
}