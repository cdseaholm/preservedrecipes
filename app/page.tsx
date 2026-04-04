import React from 'react';
import { Metadata } from 'next';
import Homepage from './(content)/homepage/components/mainHome';
import NavWrapper from '@/components/wrappers/navWrapper';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { serializeDoc } from '@/utils/data/seralize';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

export function generateMetadata(): Metadata {

  return {
    title: `Home Page for Preserved Recipes`,
    description: `Home Page for information about preserved recipes and more`,
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
    <NavWrapper userInfo={userInfo} loadingChild={null}>
        <Homepage />
    </NavWrapper>
  );
}