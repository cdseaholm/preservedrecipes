import { ICommunity } from "@/models/types/community";
import { IFamily } from "@/models/types/family";
import { FamilyMember } from "@/models/types/familyMemberRelation";
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
        const [userData, recipeData] = await Promise.all([
            fetchData({ endpoint: '/api/initData' }, headers),
            fetchData({ endpoint: '/api/recipe/get' }, headers),
            // fetchData('/api/community/get'),
            // fetchData('/api/family/members/get'),
            // fetchData('/api/family/recipes/get')
        ]);

        const userInfo = userData.userInfo as IUser
        const recipes = recipeData.recipes as IRecipe[];
        const communities = [] as ICommunity[];
        const members = [] as FamilyMember[];
        const familyRecipes = [] as IRecipe[];
        const family = {} as IFamily

        return { status: true, message: 'Success', recipes, communities, members, familyRecipes, userInfo, family };


    } catch (error: any) {
        return { status: false, message: 'Error initializing data', recipes: [] as IRecipe[], communities: [] as ICommunity[], family: {} as IFamily, familyRecipes: [] as IRecipe[], userInfo: {} as IUser, familyMembers: [] as FamilyMember[] };
    }
}