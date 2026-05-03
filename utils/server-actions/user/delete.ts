'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { authOptions } from "@/lib/auth/auth-options";
import User from '@/models/user';
import { getServerSession } from 'next-auth';

export async function DeleteUser(userId: string, route: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!userId) {
        return { success: false, message: 'User ID is required' };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation' };
    }

    try {
        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        await User.deleteOne({ _id: userId });
        revalidatePath(route);

        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete users' };
    }
}
