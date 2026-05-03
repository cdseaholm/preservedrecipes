'use server'

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { IUser } from '@/models/types/personal/user';
import User from '@/models/user';
import { SaltAndHashPassword } from '../../userHelpers/saltAndHash';

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
