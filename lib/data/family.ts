// lib/data/family.ts
import { cache } from 'react'
import connectDB from "@/lib/mongodb";
import Family from "@/models/family";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import { redirect } from 'next/navigation';

export const getSessionUser = cache(async (): Promise<IUser | null> => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;
    await connectDB();
    const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;
    return userDoc ? serializeDoc<IUser>(userDoc) : null;
})

export const getFamilyById = cache(async (famid: string): Promise<IFamily | null> => {
    await connectDB();
    const doc = await Family.findById(famid).lean();
    return doc ? serializeDoc<IFamily>(doc) : null;
})

export async function getValidatedFamilyAccess(famid: string): Promise<{ user: IUser, family: IFamily }> {
    const user = await getSessionUser();
    if (!user) redirect("/");

    const family = await getFamilyById(famid);
    if (!family || famid !== user.userFamilyID) redirect("/");

    return { user, family };
}