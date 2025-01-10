import ProfilePage from "@/components/pageSpecifics/profile/profilePage";
import { IUser } from "@/models/types/user";
import { IUserFamily } from "@/models/types/userFamily";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

const fakeUser = {
    name: 'Cael',
    email: 'cael@gmail.com',
    _id: '33',
    userFamily: {
        _id: '1',
        familyID: '5',
        siblingIDs: ['1', '2'],
        parentIDs: ['1', '2'],
        childrenIDs: [] as string[],
        partnerIDs: [] as string[]
    } as IUserFamily,
    recipeIDs: ['1', '2'],
    communityIDs: ['2', '4'],
    ratings: [1, 1, 2],
} as IUser;

export async function generateMetadata(): Promise<Metadata> {
    const session = await getServerSession();
    const user = session ? session.user : null;
    const userName = user ? user.name : ''

    return {
        title: `Profile Page for ${userName}`,
        description: `A Profile Page for ${userName} to manage their personal information, and connected recipes`,
    };
}

export default async function Page() {
    const session = await getServerSession();

    return (
        <ProfilePage session={session} userInfo={fakeUser} />
    );
}