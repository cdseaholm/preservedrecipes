'use server'

import { UTApi } from 'uploadthing/server';
import { getAuthenticatedUser } from '../recipe/utils';
import { getUploadThingKeyFromUrl } from '@/utils/uploadthing/file-key';

const utapi = new UTApi();

type UploadThingFileReference = string | {
    key?: unknown;
    fileKey?: unknown;
    url?: unknown;
    ufsUrl?: unknown;
    appUrl?: unknown;
} | null | undefined;

function normalizeUploadThingKey(fileReference: UploadThingFileReference) {
    if (!fileReference) {
        return '';
    }

    if (typeof fileReference === 'string') {
        return getUploadThingKeyFromUrl(fileReference) || fileReference.trim();
    }

    const directKey = typeof fileReference.key === 'string'
        ? fileReference.key
        : typeof fileReference.fileKey === 'string'
            ? fileReference.fileKey
            : '';

    if (directKey) {
        return directKey.trim();
    }

    const fileUrl = typeof fileReference.ufsUrl === 'string'
        ? fileReference.ufsUrl
        : typeof fileReference.url === 'string'
            ? fileReference.url
            : typeof fileReference.appUrl === 'string'
                ? fileReference.appUrl
                : '';

    return getUploadThingKeyFromUrl(fileUrl);
}

export async function DeleteUploadThingFiles(fileKeys: UploadThingFileReference[]) {
    const keysToDelete = Array.from(new Set(fileKeys.map(normalizeUploadThingKey).filter(Boolean)));

    if (keysToDelete.length === 0) {
        return { success: true, message: 'No files to delete' };
    }

    try {
        const { user, message } = await getAuthenticatedUser();
        if (!user) {
            return { success: false, message };
        }

        await utapi.deleteFiles(keysToDelete);
        return { success: true, message: 'Files deleted' };
    } catch (error) {
        console.error('Failed to delete UploadThing files:', error);
        return { success: false, message: 'Failed to delete uploaded files' };
    }
}
