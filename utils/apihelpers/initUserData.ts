import { useFamilyStore } from "@/context/familyStore";
import { useUserStore } from "@/context/userStore";
import { IFamily } from "@/models/types/family";
import { IRecipe } from "@/models/types/recipe";
import { IUser } from "@/models/types/user";

const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL as string : '';

async function fetchData({ endpoint }: { endpoint: string }, headers: HeadersInit) {
    const url = `${BASE_URL}${endpoint}`;

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
    return data;
}

export async function InitializeUserData(headers: HeadersInit) {

    try {
        const [userData, recipeData, familyData] = await Promise.all([
            fetchData({ endpoint: '/api/user/get' }, headers),
            fetchData({ endpoint: '/api/recipe/get' }, headers),
            fetchData({ endpoint: '/api/family/get' }, headers),
            // fetchData('/api/community/get'),
            // fetchData('/api/family/members/get'),
            // fetchData('/api/family/recipes/get')
        ]);

        //const communities = [] as ICommunity[];

        const userStore = useUserStore.getState();
        const familyStore = useFamilyStore.getState();

        userStore.setUserInfo(userData.userInfo as IUser);
        userStore.setUserRecipes(recipeData.recipes as IRecipe[]);
        familyStore.setFamily(familyData.family as IFamily);
        
        return { status: true, message: 'Success' };


    } catch (error: any) {
        return { status: false, message: 'Error initializing data' };
    }
}