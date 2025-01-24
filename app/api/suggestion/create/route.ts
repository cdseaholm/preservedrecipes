import { connectDB } from "@/lib/mongodb";
import Suggestion from "@/models/suggestion";
import { ISuggestion } from "@/models/types/suggestion";
import { IUser } from "@/models/types/user";
import MongoUser from "@/models/user";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { SuggestionFormType } from "@/components/forms/suggestionForm";

export async function POST(req: NextRequest) {

    const secret = process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET : '';

    if (secret === '') {
        return NextResponse.json({ status: 401, message: 'Unauthorized', suggestionsReturned: [] as ISuggestion[] });
    }

    const session = await getServerSession({ req, secret })
    const token = await getToken({ req, secret });

    if (!session || !token) {
        return NextResponse.json({ status: 401, message: 'Unauthorized', suggestionsReturned: [] as ISuggestion[] });
    }

    try {
        const body = await req.json();
        await connectDB();
        const userSesh = session?.user as User;
        const email = userSesh ? userSesh.email : '';
        if (email === '') {
            return NextResponse.json({ status: 401, message: 'Unauthorized', suggestionsReturned: [] as ISuggestion[] });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ status: 404, message: 'User not found', suggestionsReturned: [] as ISuggestion[] });
        }

        if (user._id.toString() !== token.sub) {
            console.log('token mismatch')
            return NextResponse.json({ status: 401, message: 'Unauthorized', suggestionsReturned: [] as ISuggestion[] });
        }

        const suggestion = body.suggestionPassed as SuggestionFormType;

        const suggestions = await Suggestion.find({}) as ISuggestion[]

        const newSuggestion = await Suggestion.create({
            name: suggestion.title,
            suggestion: suggestion.suggestion,
            suggestorEmail: user.email,
            suggestorName: user.name,
        }) as ISuggestion;

        if (!newSuggestion) {
            console.log("Error creating suggestion");
            return NextResponse.json({ status: 500, message: 'Error creating', suggestionsReturned: [] as ISuggestion[] });
        }

        const returnSuggestions = [
            ...suggestions,
            newSuggestion
        ] as ISuggestion[]

        return NextResponse.json({ status: 200, message: 'Success!', suggestionsReturned: returnSuggestions as ISuggestion[] });

    } catch (error: any) {
        console.error('Error creating suggestion:', error);
        return NextResponse.json({ status: 500, message: 'Error creating suggestion', suggestionsReturned: [] as ISuggestion[] });
    }
}