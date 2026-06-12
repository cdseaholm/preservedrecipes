'use server'

import { isAppAdminEmail } from '@/lib/admin';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/recipe';
import { IRecipe } from '@/models/types/recipes/recipe';
import { getUploadThingKeyFromUrl } from '@/utils/uploadthing/file-key';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { UTApi } from 'uploadthing/server';
import { authOptions } from '@/lib/auth/auth-options';

const utapi = new UTApi();
const LIST_PAGE_SIZE = 500;
const MAX_LISTED_FILES = 5000;

export type UploadAdminFile = {
    key: string;
    name: string;
    size: number;
    uploadedAt: number;
    status: string;
};

export type UploadAdminScanResult = {
    success: boolean;
    message: string;
    uploadFiles: UploadAdminFile[];
    orphanFiles: UploadAdminFile[];
    recipeImageKeys: string[];
    missingImageKeyCount: number;
    scannedFileCount: number;
    hasMoreFiles: boolean;
};

export type UploadBackfillResult = {
    success: boolean;
    message: string;
    matchedCount: number;
    modifiedCount: number;
};

async function requireAppAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !isAppAdminEmail(session.user.email)) {
        return { authorized: false, message: 'Admin privileges are required' };
    }

    return { authorized: true, message: '' };
}

async function getRecipeImageKeySnapshot() {
    await connectDB();

    const recipes = await Recipe
        .find({
            image: { $nin: [null, ''] },
        })
        .select('_id image imageKey')
        .lean<Pick<IRecipe, '_id' | 'image' | 'imageKey'>[]>();

    const recipeImageKeys = Array.from(new Set(
        recipes
            .map(recipe => recipe.imageKey || getUploadThingKeyFromUrl(recipe.image))
            .filter(Boolean)
    ));
    const missingImageKeyCount = recipes.filter(recipe => !recipe.imageKey && getUploadThingKeyFromUrl(recipe.image)).length;

    return { recipeImageKeys, missingImageKeyCount };
}

async function listUploadThingFiles() {
    const files: UploadAdminFile[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore && files.length < MAX_LISTED_FILES) {
        const result = await utapi.listFiles({ limit: LIST_PAGE_SIZE, offset });

        files.push(...result.files.map(file => ({
            key: file.key,
            name: file.name,
            size: file.size,
            uploadedAt: file.uploadedAt,
            status: file.status,
        })));

        hasMore = result.hasMore;
        offset += LIST_PAGE_SIZE;
    }

    return { files, hasMore };
}

export async function ScanUploadThingRecipeImages(): Promise<UploadAdminScanResult> {
    const admin = await requireAppAdmin();

    if (!admin.authorized) {
        return {
            success: false,
            message: admin.message,
            uploadFiles: [],
            orphanFiles: [],
            recipeImageKeys: [],
            missingImageKeyCount: 0,
            scannedFileCount: 0,
            hasMoreFiles: false,
        };
    }

    try {
        const [{ recipeImageKeys, missingImageKeyCount }, listedFiles] = await Promise.all([
            getRecipeImageKeySnapshot(),
            listUploadThingFiles(),
        ]);
        const recipeKeySet = new Set(recipeImageKeys);
        const orphanFiles = listedFiles.files.filter(file => !recipeKeySet.has(file.key));

        return {
            success: true,
            message: `Found ${orphanFiles.length} orphaned upload${orphanFiles.length === 1 ? '' : 's'}`,
            uploadFiles: listedFiles.files,
            orphanFiles,
            recipeImageKeys,
            missingImageKeyCount,
            scannedFileCount: listedFiles.files.length,
            hasMoreFiles: listedFiles.hasMore,
        };
    } catch (error) {
        console.error('Failed to scan UploadThing recipe images:', error);
        return {
            success: false,
            message: 'Failed to scan uploaded recipe images',
            uploadFiles: [],
            orphanFiles: [],
            recipeImageKeys: [],
            missingImageKeyCount: 0,
            scannedFileCount: 0,
            hasMoreFiles: false,
        };
    }
}

export async function BackfillRecipeImageKeys(): Promise<UploadBackfillResult> {
    const admin = await requireAppAdmin();

    if (!admin.authorized) {
        return { success: false, message: admin.message, matchedCount: 0, modifiedCount: 0 };
    }

    try {
        await connectDB();

        const recipes = await Recipe
            .find({
                image: { $nin: [null, ''] },
                $or: [
                    { imageKey: { $exists: false } },
                    { imageKey: null },
                    { imageKey: '' },
                ],
            })
            .select('_id image')
            .lean<Pick<IRecipe, '_id' | 'image'>[]>();

        const updates = recipes
            .map(recipe => ({
                recipeId: recipe._id,
                imageKey: getUploadThingKeyFromUrl(recipe.image),
            }))
            .filter(update => update.imageKey);

        if (updates.length === 0) {
            revalidatePath('/admin/uploads');
            return { success: true, message: 'No recipe image keys needed backfilling', matchedCount: 0, modifiedCount: 0 };
        }

        const result = await Recipe.bulkWrite(
            updates.map(update => ({
                updateOne: {
                    filter: { _id: update.recipeId },
                    update: { $set: { imageKey: update.imageKey } },
                },
            }))
        );

        revalidatePath('/admin/uploads');

        return {
            success: true,
            message: `Backfilled ${result.modifiedCount} recipe image key${result.modifiedCount === 1 ? '' : 's'}`,
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        };
    } catch (error) {
        console.error('Failed to backfill recipe image keys:', error);
        return { success: false, message: 'Failed to backfill recipe image keys', matchedCount: 0, modifiedCount: 0 };
    }
}

export async function DeleteOrphanUploadThingRecipeImages(fileKeys: string[]) {
    const admin = await requireAppAdmin();

    if (!admin.authorized) {
        return { success: false, message: admin.message, deletedCount: 0 };
    }

    const keysToDelete = Array.from(new Set(fileKeys.map(key => key.trim()).filter(Boolean)));

    if (keysToDelete.length === 0) {
        return { success: true, message: 'No files selected', deletedCount: 0 };
    }

    try {
        const { recipeImageKeys } = await getRecipeImageKeySnapshot();
        const recipeKeySet = new Set(recipeImageKeys);
        const orphanKeys = keysToDelete.filter(key => !recipeKeySet.has(key));

        if (orphanKeys.length === 0) {
            return { success: false, message: 'Selected files are now attached to recipes', deletedCount: 0 };
        }

        const result = await utapi.deleteFiles(orphanKeys);
        revalidatePath('/admin/uploads');

        return {
            success: result.success,
            message: result.success
                ? `Deleted ${result.deletedCount} orphaned upload${result.deletedCount === 1 ? '' : 's'}`
                : 'UploadThing did not delete the selected files',
            deletedCount: result.deletedCount,
        };
    } catch (error) {
        console.error('Failed to delete orphaned UploadThing files:', error);
        return { success: false, message: 'Failed to delete orphaned uploads', deletedCount: 0 };
    }
}
