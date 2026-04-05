import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { redirect } from "next/navigation";
import Family from "@/models/family";
import { IFamily } from "@/models/types/family/family";
import ProfilePage from "../components/profile-page";
import { IReview } from "@/models/types/misc/review";
import Review from "@/models/review";

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : '';

    return {
        title: userName ? `${userName}'s Profile - Preserved Recipes` : 'Profile - Preserved Recipes',
        description: userName ? `Profile page for ${userName} on Preserved Recipes` : 'Profile page on Preserved Recipes',
    };
}

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        redirect("/")
    }

    try {
        await connectDB();

        // Query database directly - no API route needed!
        const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;

        if (!userDoc) {
            redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);


        const family = user.userFamilyID ? await Family.findById(user.userFamilyID).lean() : null;

        let familyData = serializeDoc<IFamily | null>(family);

        if (!family) {
            familyData = null;
        }

        if (familyData && familyData._id !== user.userFamilyID) {
            familyData = null;
        }

        const reviewsDoc = await Review.find({ authorId: user._id }).lean();

        const reviews = reviewsDoc.map(doc => serializeDoc<IReview>(doc));

        return (
            <ProfilePage user={user} familyData={familyData} reviews={reviews} />
        );

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }


}
