'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { authOptions } from "@/lib/auth/auth-options";
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { getServerSession } from 'next-auth';

export async function CreateUser(values: IUser, route: string) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!values) {
        return { success: false, message: 'User data is required' };
    }

    if (!route) {
        return { success: false, message: 'Route is required for revalidation' };
    }

    try {
        await connectDB();

        const existingUser = await User.findOne({ email: session.user.email });
        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }

        const newUser = await User.create({
            name: values.name,
            email: session.user.email,
            password: values.password,
            userFamilyID: values.userFamilyID,
            recipeIDs: values.recipeIDs,
            savedRecipeIDs: values.savedRecipeIDs,
            favoriteRecipeIDs: values.favoriteRecipeIDs,
            communityIDs: values.communityIDs,
            createdAt: new Date(),
            updatedAt: new Date(),
        }) as IUser;

        revalidatePath(route);
        
        return { 
            success: true, 
            message: 'User created successfully',
            userId: newUser._id.toString()
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to create user' };
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