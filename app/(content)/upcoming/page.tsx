import { Metadata } from 'next';
import React from 'react';
import FeaturesPage from './components/features';
import NavWrapper from '@/components/wrappers/navWrapper';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { serializeDoc } from '@/utils/data/seralize';
import { getServerSession } from 'next-auth';

export function generateMetadata(): Metadata {
    return {
        title: `Upcoming Features List`,
        description: `A Page for to showcase, manage, and accept new ideas regarding upcoming features`,
    };
}

export default async function Page() {

    const session = await getServerSession(authOptions);
    let userInfo: IUser | null = null;

    if (session && session.user && session.user.email) {

        await connectDB();
        const userDoc = await User.findOne({ email: session.user.email }).lean();
        userInfo = serializeDoc<IUser>(userDoc);

    }

    return (
        <NavWrapper loadingChild={null} userInfo={userInfo}>
            <FeaturesPage />
        </NavWrapper>
    );
}