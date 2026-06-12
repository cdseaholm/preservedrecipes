import ContentWrapper from '@/components/wrappers/contentWrapper';
import NavWrapper from '@/components/wrappers/navWrapper';
import { DashboardCard, DashboardHeader } from '@/components/layout/page-shells';
import { getSessionUser } from '@/lib/data/user';
import { createPageMetadata } from '@/lib/metadata';
import { isAppAdminEmail } from '@/lib/admin';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { MdImageSearch } from 'react-icons/md';
import { Badge } from '@mantine/core';
import UploadAdminPanel from './components/upload-admin-panel';
import { ScanUploadThingRecipeImages } from '@/utils/server-actions/uploadthing/admin';

export async function generateMetadata(): Promise<Metadata> {
    return createPageMetadata({
        title: 'Upload Admin',
        description: 'Review recipe image uploads and clean up orphaned UploadThing files.',
        robots: { index: false, follow: false },
    });
}

export default async function Page() {
    const user = await getSessionUser();

    if (!user) {
        redirect('/');
    }

    if (!isAppAdminEmail(user.email)) {
        redirect('/u/profile');
    }

    const initialScan = await ScanUploadThingRecipeImages();

    return (
        <NavWrapper userInfo={user}>
            <ContentWrapper containedChild paddingNeeded>
                <DashboardCard className="gap-6">
                    <DashboardHeader
                        icon={<MdImageSearch size={22} />}
                        eyebrow={<Badge variant="light" color="accent">Admin</Badge>}
                        title="Recipe Upload Maintenance"
                        description="Backfill missing recipe image keys, compare recipe image references against UploadThing, and delete orphaned files from old tests."
                    />
                    <UploadAdminPanel initialScan={initialScan} />
                </DashboardCard>
            </ContentWrapper>
        </NavWrapper>
    );
}
