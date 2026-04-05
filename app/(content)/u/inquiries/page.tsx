
import { authOptions } from "@/lib/auth/auth-options";
import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import User from "@/models/user";
import { serializeDoc } from "@/utils/data/seralize";
import { getServerSession } from "next-auth";
import Inquiries from "@/models/inquiry";
import { redirect } from "next/navigation";
import { IInquiry } from "@/models/types/misc/inquiry";
import InquiryTab from "../components/inquiry-tab";

export default async function Page() {

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email || !session.user.email || session.user.email === '' || session.user.email !== 'cdseaholm@gmail.com') {
        redirect("/")
    }

    try {

        await connectDB();

        // Query database directly - no API route needed!
        const userDoc = await User.findOne({ email: session.user.email }).lean() as IUser;

        if (!userDoc) {
            return redirect("/");
        }

        const user = serializeDoc<IUser>(userDoc);

        const inqs = await Inquiries.find({ inquirerEmail: user.email.toString() }).lean();
        const inquiries = inqs.map(s => serializeDoc(s)) as IInquiry[];

        return (
            <InquiryTab inquiries={inquiries} userInfo={user} />
        )

    } catch (error) {
        console.error('Error loading data:', error);
        redirect("/")
    }


}