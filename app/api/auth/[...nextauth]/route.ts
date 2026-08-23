import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { NextRequest } from "next/server";

type NextAuthContext = {
    params: Promise<{
        nextauth: string[];
    }>;
};

function syncNextAuthUrlForRequest(req: NextRequest) {
    const host = req.headers.get("host");
    if (!host) return;

    const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    if (!isLocalHost) return;

    process.env.NEXTAUTH_URL = `${req.nextUrl.protocol}//${host}`;
}

function handler(req: NextRequest, context: NextAuthContext) {
    syncNextAuthUrlForRequest(req);
    return NextAuth(req, context, authOptions);
}

export { handler as GET, handler as POST };
