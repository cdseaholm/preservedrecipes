import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/personal/user";
import MongoUser from "@/models/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/auth-options";
import { IFamily } from "@/models/types/family/family";
import Family from "@/models/family";
import { ObjectId } from "mongodb";
import { compareSync } from "bcrypt-ts";

// Helper function to update family member info
async function updateFamilyMember(
    familyID: string,
    userID: string,
    field: 'familyMemberName' | 'familyMemberEmail',
    value: string
) {
    if (!familyID) return;

    const family = await Family.findOne({ _id: new ObjectId(familyID) }) as IFamily | null;
    if (!family?.familyMembers?.length) return;

    const memberIndex = family.familyMembers.findIndex(mem => mem.familyMemberID === userID);
    if (memberIndex === -1) return;

    // Update the specific field
    family.familyMembers[memberIndex][field] = value;

    await Family.updateOne(
        { _id: family._id },
        { $set: { familyMembers: family.familyMembers } }
    );
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }

    try {
        const body = await req.json();
        const { which, itemToEdit, passwordEntered } = body as { which: 'name' | 'email', itemToEdit: string, passwordEntered: string };

        await connectDB();

        const user = await MongoUser.findOne({ email: session.user.email }) as IUser | null;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' });
        }

        const passwordMatch = compareSync(passwordEntered, user.password);

        if (!passwordMatch) {
            console.log('Incorrect password entered for user edit:', session.user.email);
            return NextResponse.json({ status: 403, message: 'Incorrect password' });
        }

        console.log(`Editing user ${session.user.email}: field ${which} to ${itemToEdit}`);

        // Handle name update
        if (which === 'name') {
            console.log('Updating name to ', itemToEdit);
            await MongoUser.updateOne({ _id: user._id }, { $set: { name: itemToEdit } });
            await updateFamilyMember(user.userFamilyID, user._id.toString(), 'familyMemberName', itemToEdit);
            return NextResponse.json({ status: 200, message: 'Success!' });
        }

        // Handle email update
        if (which === 'email') {
            console.log('Updating email to ', itemToEdit);
            const existingUser = await MongoUser.findOne({ email: itemToEdit }) as IUser | null;

            if (existingUser) {
                return NextResponse.json({ status: 402, message: 'User already exists with that email' });
            }

            await MongoUser.updateOne({ _id: user._id }, { $set: { email: itemToEdit } });
            await updateFamilyMember(user.userFamilyID, user._id.toString(), 'familyMemberEmail', itemToEdit);
            return NextResponse.json({ status: 200, message: 'Success!' });
        }

        if (which === 'password') {
            console.log('Updating password');
            await MongoUser.updateOne({ _id: user._id }, { $set: { password: itemToEdit } });
            return NextResponse.json({ status: 200, message: 'Success!' });
        }

        return NextResponse.json({ status: 400, message: 'Invalid field to update' });

    } catch (error: any) {
        console.error('Error editing user:', error);
        return NextResponse.json({ status: 500, message: 'Error editing user' });
    }
}