import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import NavWrapper from "@/components/wrappers/navWrapper";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";
import TosPage from "./components/tos-page";

export default async function Page() {

    const session = await getServerSession(authOptions);
    let userInfo: IUser | null = null;

    if (session && session.user && session.user.email) {

        await connectDB();
        const userDoc = await User.findOne({ email: session.user.email }).lean();
        userInfo = serializeDoc<IUser>(userDoc);

    }

    return (
        <NavWrapper loadingChild={null} userInfo={userInfo}>
            <TosPage />
        </NavWrapper>
    );
}

