import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import Suggestion from '@/models/suggestion';
import { ISuggestion } from '@/models/types/suggestion';
import { IUser } from '@/models/types/user';
import MongoUser from '@/models/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!session) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from session.', suggestions: [] as ISuggestion[] });
        }

        const userSesh = session.user as IUser;

        const token = await getToken({ req });
        if (!token) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from token', suggestions: [] as ISuggestion[] });
        }

        const headers = req.headers;
        if (!headers) {
            return NextResponse.json({ status: 401, message: 'Unauthorized from headers', suggestions: [] as ISuggestion[] });
        }

        await connectDB();
        const email = userSesh.email || '';
        if (!email) {
            return NextResponse.json({ status: 401, message: 'Unauthorized via email', suggestions: [] as ISuggestion[] });
        }

        const user = await MongoUser.findOne({ email: email }) as IUser;

        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found', suggestions: [] as ISuggestion[] });
        }

        if (user._id.toString() !== token.sub) {
            return NextResponse.json({ status: 401, message: 'Unauthorized via token mismatch', suggestions: [] as ISuggestion[] });
        }

        const returnSuggestions = await Suggestion.find({}) as ISuggestion[];

        if (!returnSuggestions || returnSuggestions.length === 0) {
            return NextResponse.json({ status: 403, message: 'No Suggestions found', suggestions: [] as ISuggestion[] });
        }

        return NextResponse.json({ status: 200, message: 'Success!', suggestions: returnSuggestions });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: `Try catch err ${error}`, suggestions: [] as ISuggestion[] });
    }
}