import ProfilePage from "@/components/pageSpecifics/profile/profilePage";
import { ICommunity } from "@/models/types/community";
import { IRecipe } from "@/models/types/recipe";
import { ProfileHelper } from "@/utils/helpers/profileHelper";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import ErrorPage from "../error/page";
import { FamilyMemberRelation } from "@/models/types/familyMemberRelation";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : '';

    return {
        title: `Profile Page for ${userName}`,
        description: `A Profile Page for ${userName} to manage their personal information, and connected recipes`,
    };
}

export default async function Page() {
    const data = await ProfileHelper() as { fetched: boolean, message: string, recipes: IRecipe[], communities: ICommunity[], members: FamilyMemberRelation[], familyRecipes: IRecipe[] };

    if (!data) {
        return (
            <ErrorPage />
        )
    }

    const recipesToPass = data.recipes;
    const communitiesToPass = data.communities;
    const membersToPass = data.members;
    const famRecipesToPass = data.familyRecipes

    return (
        <ProfilePage recipes={recipesToPass} communities={communitiesToPass} members={membersToPass} familyRecipes={famRecipesToPass} />
    );
}