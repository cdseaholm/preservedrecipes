export function getUploadThingKeyFromUrl(fileUrl: string | undefined | null) {
    if (!fileUrl) {
        return '';
    }

    try {
        const url = new URL(fileUrl);
        const filePathIndex = url.pathname.split('/').findIndex(pathPart => pathPart === 'f');

        if (filePathIndex === -1) {
            return '';
        }

        return decodeURIComponent(url.pathname.split('/')[filePathIndex + 1] || '');
    } catch {
        return '';
    }
}
