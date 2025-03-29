import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import Family from "@/models/family";
import { IFamilyMember } from "@/models/types/familyMember";

export async function DELETE(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', updatedMembers: [] as IFamilyMember[] });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', updatedMembers: [] as IFamilyMember[] });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', updatedMembers: [] as IFamilyMember[] });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;
        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', updatedMembers: [] as IFamilyMember[] });
        }

        const currFamilyID = user.userFamilyID;

        const item = body.itemsToDelete as IFamilyMember[];
        const currFam = await Family.findById({ _id: currFamilyID });
        if (!currFam) {
            return NextResponse.json({ status: 404, message: 'Family not found', updatedMembers: [] as IFamilyMember[] });
        }

        const currFamilyMembers = currFam.familyMembers;
        let updatedMembers = [] as IFamilyMember[];

        const deleteMemberPromises = item.map(async (member: IFamilyMember) => {
            const memberID = new ObjectId(member.familyMemberID);
            await MongoUser.updateOne({ _id: memberID }, { $set: { userFamilyID: '' } });
            const newMembers = currFamilyMembers.filter((mem) => mem.familyMemberID !== member.familyMemberID);
            updatedMembers = newMembers;
        });

        await Promise.all(deleteMemberPromises);

        await Family.updateOne({ _id: currFamilyID }, { $set: { familyMembers: updatedMembers } })

        revalidatePath('(content)/profile');

        return NextResponse.json({ status: 200, message: 'Success!', updatedMembers: updatedMembers as IFamilyMember[] });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe', updatedMembers: [] as IFamilyMember[] });
    }
}