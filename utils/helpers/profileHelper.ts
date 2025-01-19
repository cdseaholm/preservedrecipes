import { ICommunity } from "@/models/types/community";
import { IFamily } from "@/models/types/family";
import { FamilyMember } from "@/models/types/familyMemberRelation";
import { IRecipe } from "@/models/types/recipe";
import { getServerSession, Session } from "next-auth";
import { headers } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchData(endpoint: string) {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: await headers(),
        
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }

    const data = await response.json();
    return data;
}

export async function ProfileHelper() {
    const serverSesh = await getServerSession() as Session | null;

    if (!serverSesh) {
        return { fetched: false, message: 'Unauthorized', recipes: [] as IRecipe[], communities: [] as ICommunity[], family: {} as IFamily };
    }

    try {
        const [recipeData] = await Promise.all([
            fetchData('/api/recipe/get'),
            // fetchData('/api/community/get'),
            // fetchData('/api/family/members/get'),
            // fetchData('/api/family/recipes/get')
        ]);

        const recipes = recipeData.recipes as IRecipe[];
        const communities = [] as ICommunity[];
        const members = [] as FamilyMember[];
        const familyRecipes = [] as IRecipe[];

        return { fetched: true, message: 'Success', recipes, communities, members, familyRecipes };
    } catch (error: any) {
        console.error(error);
        return { fetched: false, message: error.message, recipes: [] as IRecipe[], communities: [] as ICommunity[], family: {} as IFamily };
    }
}