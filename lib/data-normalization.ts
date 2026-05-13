export function normalizeEmail(email: string | null | undefined) {
    return email?.trim().toLowerCase() || '';
}

export function normalizeId(id: unknown) {
    return id?.toString() || '';
}

export function formatShortDate(date: Date | string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }).format(parsedDate);
}
