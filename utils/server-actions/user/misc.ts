'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { authOptions } from "@/lib/auth/auth-options";
import User from '@/models/user';
import { getServerSession } from 'next-auth';

export async function AcceptInvite(userId: string, familyId: string, route: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!userId || !familyId) {
        return { success: false, message: 'User ID and Family ID are required' };
    }

    try {
        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        user.userFamilyID = familyId;
        await user.save();

        revalidatePath(route);

        return { success: true, message: 'Invite accepted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to accept invite' };
    }
}
