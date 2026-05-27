import NavWrapper from "@/components/wrappers/navWrapper";
import connectDB from "@/lib/mongodb";
import { createPageMetadata } from "@/lib/metadata";
import Recipe from "@/models/recipe";
import { IRecipe } from "@/models/types/recipes/recipe";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { ObjectId } from "mongodb";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Community from "@/models/community";
import { ICommunity } from "@/models/types/community/community";
import { IUserView } from "@/models/types/family/member-view";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family/family";
import { getSessionUser } from "@/lib/data/user";
import ViewPage from "@/app/(content)/u/components/view-page";

type MemberViewPageParams = { params: Promise<{ memberid: string }> };

export async function generateMetadata({ params }: MemberViewPageParams): Promise<Metadata> {
    const { memberid } = await params;

    try {
        await connectDB();
        const userDoc = ObjectId.isValid(memberid)
            ? await User.findById(memberid).select("name").lean()
            : null;
        const user = userDoc ? serializeDoc<IUser>(userDoc) : null;
        const userName = user?.name || "";

        return createPageMetadata({
            title: userName ? `${userName}'s Public Profile` : "Public Profile",
            description: userName
                ? `View ${userName}'s public recipes, public communities, and shared Preserved Recipes profile details.`
                : "View a Preserved Recipes member's public recipes, public communities, and shared profile details.",
        });
    } catch {
        return createPageMetadata({
            title: "Public Profile",
            description: "View a Preserved Recipes member's public recipes, public communities, and shared profile details.",
        });
    }
}

export default async function Page({ params }: MemberViewPageParams) {
    const viewer = await getSessionUser();

    if (!viewer) {
        redirect("/");
    }

    const { memberid } = await params;

    if (!memberid || !ObjectId.isValid(memberid)) {
        redirect("/");
    }

    try {
        await connectDB();

        const userDoc = await User.findOne({ _id: new ObjectId(memberid) }).lean() as IUser | null;

        if (!userDoc) {
            redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);

        if (user._id !== memberid) {
            redirect("/");
        }

        if (viewer.email === user.email) {
            redirect("/u/profile");
        }

        const [publicCommunityDocs, publicRecipeDocs, fetchedFamilyDoc] = await Promise.all([
            user.communityIDs.length > 0
                ? Community.find({ _id: { $in: user.communityIDs }, privacyLevel: "public" }).lean()
                : [],
            user.recipeIDs.length > 0
                ? Recipe.find({ _id: { $in: user.recipeIDs }, secret: false }).lean()
                : [],
            user.userFamilyID
                ? Family.findById(user.userFamilyID).lean()
                : null,
        ]);

        const publicCommunities = publicCommunityDocs.map(doc => serializeDoc<ICommunity>(doc));
        const publicRecipes = publicRecipeDocs.map(doc => serializeDoc<IRecipe>(doc));
        let familyInfo: IFamily | null = fetchedFamilyDoc ? serializeDoc<IFamily>(fetchedFamilyDoc) : null;
        const viewCommunityIDs = viewer.communityIDs || [];
        const overlappingCommunities = publicCommunities.filter(comm => viewCommunityIDs.includes(comm._id));

        if (!viewer.userFamilyID || !user.userFamilyID || viewer.userFamilyID !== user.userFamilyID) {
            familyInfo = null;
        }

        const memberToView: IUserView = {
            familyMemberID: user._id.toString(),
            familyMemberName: user.name,
            familyMemberEmail: user.email,
            publicCommunities,
            publicReviews: [],
            publicRecipes,
            overlappingCommunities,
            sameFamily: familyInfo,
        };

        return (
            <NavWrapper userInfo={viewer}>
                <ViewPage memberToView={memberToView} />
            </NavWrapper>
        );
    } catch (error) {
        console.error("Error loading data:", error);
        redirect("/");
    }
}
