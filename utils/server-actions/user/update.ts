'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { authOptions } from "@/lib/auth/auth-options";
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { getServerSession } from 'next-auth';

export async function UpdateUser(userId: string, userData: IUser, route: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!userData || !userId) {
        return { success: false, message: 'User data is required' };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation' };
    }

    try {
        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.email !== session.user.email || user._id.toString() !== userId) {
            return { success: false, message: 'Unauthorized' };
        }

        await User.findByIdAndUpdate(userId, {
            name: userData.name,
            password: userData.password,
            userFamilyID: userData.userFamilyID,
            recipeIDs: userData.recipeIDs,
            savedRecipeIDs: userData.savedRecipeIDs,
            favoriteRecipeIDs: userData.favoriteRecipeIDs,
            communityIDs: userData.communityIDs,
            bio: userData.bio,
            profileImage: userData.profileImage,
            updatedAt: new Date(),
            createdAt: userData.createdAt,
        }) as IUser;

        revalidatePath(route);

        return { success: true, message: 'User updated successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update user' };
    }
}
