import { Metadata } from 'next';
import FeaturesPage from './components/features';
import NavWrapper from '@/components/wrappers/navWrapper';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';

export function generateMetadata(): Metadata {
    return createPageMetadata({
        title: "Upcoming Features",
        description: "Explore planned Preserved Recipes features, product improvements, and future ideas for recipe and community tools.",
    });
}

export default async function Page() {

    const userInfo = await getSessionUser();

    return (
        <NavWrapper userInfo={userInfo}>
            <FeaturesPage />
        </NavWrapper>
    );
}
