import CommunityMain from '@/components/pageSpecifics/communities/communityMain';
import { ICommunity } from '@/models/types/community';
import { IRecipe } from '@/models/types/recipe';
import { IPost } from '@/models/types/post';
import { redirect } from 'next/navigation';
import { IPermissions } from '@/models/types/permission';
import { getServerSession } from 'next-auth';
import { IUser } from '@/models/types/user';

const fakeData = {
  communities: Array.from({ length: 10 }, (_, index) => ({
    name: `Community ${index + 1}`,
    _id: `${index + 1}`,
    creatorIDs: [{ id: '1', name: 'Cael', secret: 'hush', permissionStatus: 'Admin' } as IPermissions],
    recipes: [] as IRecipe[],
    communityMemberIDs: [`member-${index + 1}`],
    public: true,
    posts: [] as IPost[],
  })) as ICommunity[],
  numberOfPages: 10,
};

export default async function CommunityPage(props: { searchParams: Promise<{ page?: string, size?: string }> }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession();
  const user = session ? session.user as IUser : {} as IUser;
  const email = user ? user.email as string : '';
  const admin = process.env.ADMIN_USERNAME ? process.env.ADMIN_USERNAME as string : 'null';

  if (!session || email !== admin) {
    redirect('/')
  }

  if (!searchParams.page || !searchParams.size) {
    redirect('/community?page=1&size=10');
  }

  const itemsPerPage = parseInt(searchParams.size || '10', 10);
  const currentPage = parseInt(searchParams.page || '1', 10);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentCommunities = fakeData.communities.slice(startIndex, endIndex);

  return (
    <CommunityMain
      communities={currentCommunities}
      currentPage={currentPage}
      numberOfPages={Math.ceil(fakeData.communities.length / itemsPerPage)}
    />
  );
}