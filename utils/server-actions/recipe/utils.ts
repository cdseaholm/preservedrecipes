import connectDB from '@/lib/mongodb';
import { authOptions } from "@/lib/auth/auth-options";
import { IRecipe } from '@/models/types/recipes/recipe';
import User from '@/models/user';
import { getServerSession } from 'next-auth';
import { Types } from 'mongoose';

const favoriteToggleAttempts = new Map<string, number[]>();
const FAVORITE_TOGGLE_LIMIT = 20;
const FAVORITE_TOGGLE_WINDOW_MS = 60_000;

export function isValidId(id: string) {
    return Types.ObjectId.isValid(id);
}

export function getRevalidationPath(route: string) {
    return route?.startsWith('/') ? route : '/u/recipes';
}

export function cleanStringArray(values: string[] | undefined) {
    if (!Array.isArray(values)) return [];
    return values.map(value => value.trim()).filter(Boolean);
}

export function canAttemptFavoriteToggle(userId: string) {
    const now = Date.now();
    const recentAttempts = (favoriteToggleAttempts.get(userId) || [])
        .filter(timestamp => now - timestamp < FAVORITE_TOGGLE_WINDOW_MS);

    if (recentAttempts.length >= FAVORITE_TOGGLE_LIMIT) {
        favoriteToggleAttempts.set(userId, recentAttempts);
        return false;
    }

    favoriteToggleAttempts.set(userId, [...recentAttempts, now]);
    return true;
}

export function canUserViewRecipe(recipe: IRecipe, userId: string, userEmail: string) {
    if (!recipe.secret) return true;
    if (recipe.creatorID === userId) return true;
    return recipe.secretViewerIDs?.includes(userId) || recipe.secretViewerIDs?.includes(userEmail);
}

export async function getAuthenticatedUser() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { user: null, message: 'Unauthorized' };
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
        return { user: null, message: 'User not found' };
    }

    return { user, message: '' };
}
