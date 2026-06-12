'use client'

import { UploadButton } from '@/utils/uploadthing/uploadthing';
import { toast } from 'sonner';

type RecipePhotoUploaderProps = {
    onUploadComplete?: (file: UploadedRecipeImage) => void;
    onUploadStart?: () => void;
    onUploadProgress?: (progress: number) => void;
    onUploadSettled?: () => void;
};

export type UploadedRecipeImage = {
    key: string;
    url: string;
    name?: string;
};

type UploadThingImageResponse = {
    key?: string;
    url?: string;
    ufsUrl?: string;
    appUrl?: string;
    name?: string;
};

export function RecipePhotoUploader({ onUploadComplete, onUploadStart, onUploadProgress, onUploadSettled }: RecipePhotoUploaderProps) {
    return (
        <UploadButton
            endpoint="imageUploader"
            appearance={{
                button: 'bg-accent text-lightText px-3 py-2 rounded-md text-sm font-semibold hover:bg-accentMuted transition',
                allowedContent: 'text-xs text-mainText/60',
            }}
            content={{
                button({ ready, isUploading }) {
                    if (!ready) return 'Preparing...';
                    if (isUploading) return 'Uploading...';
                    return 'Upload photo';
                },
                allowedContent() {
                    return 'Images up to 4MB';
                },
            }}
            onUploadBegin={() => {
                onUploadStart?.();
                onUploadProgress?.(0);
            }}
            onUploadProgress={(progress) => {
                onUploadProgress?.(progress);
            }}
            onClientUploadComplete={(res) => {
                const uploadedFile = res?.[0] as UploadThingImageResponse | undefined;
                const imageUrl = uploadedFile?.ufsUrl || uploadedFile?.url || uploadedFile?.appUrl;
                const imageKey = uploadedFile?.key;

                if (!imageUrl || !imageKey) {
                    toast.error('Upload finished, but image metadata was incomplete');
                    onUploadSettled?.();
                    return;
                }

                onUploadComplete?.({ key: imageKey, url: imageUrl, name: uploadedFile?.name });
                onUploadProgress?.(100);
                onUploadSettled?.();
                toast.success('Recipe photo uploaded');
            }}
            onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
                onUploadSettled?.();
            }}
        />
    );
}
