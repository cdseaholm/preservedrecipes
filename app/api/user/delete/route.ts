import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { ObjectId } from "mongodb";
import Family from "@/models/family";

function normalizeEmail(email: string | null | undefined) {
    return email?.trim().toLowerCase() ?? "";
}

export async function DELETE(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized' });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const familyID = user.userFamilyID;
        if (familyID !== '' && ObjectId.isValid(familyID)) {
            const family = await Family.findById(familyID);
            const member = family?.familyMembers.find(familyMember =>
                familyMember.familyMemberID === user._id.toString() ||
                normalizeEmail(familyMember.familyMemberEmail) === normalizeEmail(user.email)
            ) || null;

            if (family && member) {
                const remainingMembers = family.familyMembers.filter(familyMember => familyMember !== member);
                if (member.permissionStatus === "Admin" && !remainingMembers.some(familyMember => familyMember.permissionStatus === "Admin")) {
                    return NextResponse.json(
                        { status: 409, message: "Assign another admin before deleting your profile" },
                        { status: 409 }
                    );
                }

                await Family.updateOne(
                    { _id: family._id },
                    { $set: { familyMembers: remainingMembers } }
                );
            }
        }

        await MongoUser.deleteOne({ _id: new ObjectId(user._id) });

        return NextResponse.json({ status: 200, message: 'Success!' });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: 'Error creating recipe' });
    }
}
