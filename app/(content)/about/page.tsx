import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";
import AboutPage from "./components/about-page";
import { redirect } from "next/navigation";

export default async function Page() {
    
    const session = await getServerSession(authOptions);

    try {
        await connectDB();

        let userInfo = null as IUser | null;

        if (session && session.user && session.user.email) {

            const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;

            if (userDoc) {
                const user = serializeDoc<IUser>(userDoc);

                if (user) {
                    userInfo = user;
                }
            }

        }


        return (
            <AboutPage userInfo={userInfo} />
        );
    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }
}