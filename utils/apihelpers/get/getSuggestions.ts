import { getServerSession } from "next-auth";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL as string : '';

export async function fetchData({ endpoint }: { endpoint: string }, headers: HeadersInit) {
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        next: {
            revalidate: 6000
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }

    const data = await response.json();

    if (data.status !== 200) {
        console.log('Issue with fetching data from: ', endpoint, data.message);
        return;
    }

    return data;
}

export async function GetSuggs() {

    const session = await getServerSession();
    if (!session) {
        console.log('No sesh in suggs')
        return;
    }
    const headers = { 'Authorization': `Bearer ${session.user}` };

    try {
        const [suggestionData] = await Promise.all([
            fetchData({ endpoint: '/api/suggestion/get' }, headers)
        ]);

        console.log('suggestion data: ', suggestionData)

        return { status: true, message: 'Success' };
    } catch (error: any) {
        return { status: false, message: 'Error initializing data' };
    }
}