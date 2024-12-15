import connectDB from "@/lib/mongodb";
import { IUser } from "@/models/types/user";
import { IUserPreferences } from "@/models/types/userPreferences";
import { IVacation } from "@/models/types/vacation";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    let userEmail = req.url.split('/')[4];

    console.log(userEmail)

    try {
        await connectDB();

        const user = await User.findOne({email: userEmail}) as IUser;

        if (!user) {
            return NextResponse.json({status: 404, message: 'User not found', userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]})
        }

        let userID = user._id;
        let userPreferences = user.userPreferences as IUserPreferences;
        let vacations = user.vacations as IVacation[];

        return NextResponse.json({status: 200, message: 'Success!', userID: userID, userPreferences: userPreferences as IUserPreferences, vacations: vacations as IVacation[]})


    } catch (error: any) {
        return NextResponse.json({status: 500, message: 'Error fetching', userID: '', userPreferences: {} as IUserPreferences, vacations: [] as IVacation[]})
    }
}