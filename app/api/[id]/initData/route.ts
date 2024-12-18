import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    let userEmail = req.url.split('/')[4];

    console.log(userEmail)

    try {
        await connectDB();

        const user = await User.findOne({email: userEmail}) as IUser;

        if (!user) {
            return NextResponse.json({status: 404, message: 'User not found', userInfo: {} as IUser})
        }

        let userInfo = user as IUser

        return NextResponse.json({status: 200, message: 'Success!', userInfo: userInfo})


    } catch (error: any) {
        return NextResponse.json({status: 500, message: 'Error fetching', userInfo: {} as IUser})
    }
}