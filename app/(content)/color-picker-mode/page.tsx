import NavWrapper from "@/components/wrappers/navWrapper";
import ColorPickerMode from "./components/colorPickerMode";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";

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
            <ColorPickerMode />
        </NavWrapper>
    )
}