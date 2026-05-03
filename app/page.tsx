import { Metadata } from 'next';
import Homepage from './(content)/homepage/components/mainHome';
import NavWrapper from '@/components/wrappers/navWrapper';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {

  return createPageMetadata({
    title: "Home",
    description: "Discover Preserved Recipes, a place to save family recipes, share food memories, and organize cooking traditions.",
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
