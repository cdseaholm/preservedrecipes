// lib/data/family.ts
import { cache } from 'react'
import connectDB from "@/lib/mongodb";
import Family from "@/models/family";
import { serializeDoc } from "@/utils/data/seralize";
import { IFamily } from "@/models/types/family/family";
import { IUser } from "@/models/types/personal/user";
import { redirect } from 'next/navigation';
import { getSessionUser } from './user';
import { hasConnectedMembership, getFamilyMember } from '@/utils/server-actions/family/utils';

export const getFamilyById = cache(async (famid: string): Promise<IFamily | null> => {
    await connectDB();
    const doc = await Family.findById(famid).lean();
    return doc ? serializeDoc<IFamily>(doc) : null;
})

export async function getValidatedFamilyAccess(famid: string): Promise<{ user: IUser, family: IFamily }> {
    const user = await getSessionUser();
    if (!user) redirect("/");

    const family = await getFamilyById(famid);
    if (!family) redirect("/");

    const member = getFamilyMember(family, user);
    if (famid !== user.userFamilyID || !hasConnectedMembership(member, user)) redirect("/");

    return { user, family };
}
