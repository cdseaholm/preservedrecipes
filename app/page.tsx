import { Metadata } from 'next';
import Homepage from './(content)/homepage/components/mainHome';
import NavWrapper from '@/components/wrappers/navWrapper';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {

  return createPageMetadata({
    title: "Home",
    description: "Discover RecipeSafe, a private-first place to keep family recipes, food memories, and cooking notes safe.",
  });
}

export default async function Page() {

  const userInfo = await getSessionUser();

  return (
    <NavWrapper userInfo={userInfo}>
        <Homepage />
    </NavWrapper>
  );
}
