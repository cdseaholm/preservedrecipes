export default async function GetItemHandler(itemApi: string) {

    const urlToUse = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

    if (!itemApi || itemApi.length === 0) {
        return { status: false, message: `Failed to get, Invalid parameters`, dataFetched: null };
    }

    if (urlToUse.length === 0 || urlToUse === '') {
        return { status: false, message: `Failed to get, Invalid URL`, dataFetched: null };
    }

    try {
        const res = await fetch(`${urlToUse}/api/${itemApi}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            return { status: false, message: `Failed to get, ${res.statusText}`, dataFetched: null };
        }
        const data = await res.json().catch(() => null);

        if (!data) {
            return { status: false, message: `Failed to get, Invalid JSON response`, dataFetched: null };
        }
        return { status: true, message: `Fetched`, dataFetched: data };

    } catch (error: any) {
        return { status: false, message: `Failed to get`, dataFetched: null };
    }
}