import { cache } from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { IUser } from "@/models/types/personal/user";
import { serializeDoc } from "@/utils/data/seralize";

export const getSessionUser = cache(async (): Promise<IUser | null> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return null;
    }

    await connectDB();
    const userDoc = await User.findOne({ email: session.user.email }).lean();

    return userDoc ? { ...serializeDoc<IUser>(userDoc), password: '' } : null;
});
