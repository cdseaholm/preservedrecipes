'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { authOptions } from "@/lib/auth/auth-options";
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { getServerSession } from 'next-auth';
import { SaltAndHashPassword } from '../userHelpers/saltAndHash';

//need to work in accept invite with Create User since the two could use eachother
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

export async function CreateUser({ name, email, password, route }: { name: string, email: string, password: string, route: string }) {

    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
        return { status: false, message: 'User data is required', newUser: null };
    }

    if (!route) {
        return { status: false, message: 'Route is required for revalidation', newUser: null };
    }

    if (!password) {
        return {
            status: false, message: 'Password is required', newUser: null
        }
    }

    const saltedPW = await SaltAndHashPassword(password);
    if (!saltedPW) {

        return {
            status: false, message: 'Failed to hash password', newUser: null
        }
    }

    try {
        await connectDB();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return { status: false, message: 'User already exists', newUser: null };
        }

        const newUser = await User.create({
            name: name,
            email: normalizedEmail,
            password: saltedPW,
            userFamilyID: '',
            recipeIDs: [] as string[],
            savedRecipeIDs: [] as string[],
            favoriteRecipeIDs: [] as string[],
            communityIDs: [] as string[],
            bio: '',
            profileImage: '',
            resetPasswordExpires: '',
            resetPasswordToken: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        }) as IUser;

        revalidatePath(route);

        return {
            status: true,
            message: 'User created successfully',
            newUser: JSON.parse(JSON.stringify(newUser))
        };
    } catch (error) {
        console.error(error);
        const mongoError = error as { code?: number };
        if (mongoError.code === 11000) {
            return { status: false, message: 'User already exists', newUser: null };
        }
        return { status: false, message: 'Failed to create user', newUser: null };
    }
}

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

        // ✅ Refresh the data
        revalidatePath(route);

        return { success: true, message: 'User updated successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to update user' };
    }
}

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
        //make sure to send user home after deletion
        revalidatePath(route);

        return { success: true, message: 'User deleted successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to delete users' };
    }
}
