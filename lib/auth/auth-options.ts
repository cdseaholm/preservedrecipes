// lib/auth/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { randomUUID } from "crypto";
import MongoUser from "@/models/user";
import { VerifyPassword } from "@/utils/userHelpers/verifyPassword";
import connectDB from "@/lib/mongodb";
import { SaltAndHashPassword } from "@/utils/userHelpers/saltAndHash";

async function findOrCreateGoogleUser({ email, name, image }: { email: string; name?: string | null; image?: string | null }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return null;

    await connectDB();

    const existingUser = await MongoUser.findOne({ email: normalizedEmail });
    if (existingUser) return existingUser;

    const placeholderPassword = await SaltAndHashPassword(`google-oauth:${randomUUID()}`);
    if (!placeholderPassword) return null;

    return await MongoUser.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        password: placeholderPassword,
        userFamilyID: '',
        recipeIDs: [],
        savedRecipeIDs: [],
        favoriteRecipeIDs: [],
        communityIDs: [],
        bio: '',
        profileImage: image || '',
        resetPasswordExpires: '',
        resetPasswordToken: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = credentials as Record<string, string>;
                    const normalizedEmail = email?.trim().toLowerCase();
                    if (!normalizedEmail || !password) return null;

                    await connectDB();
                    const user = await MongoUser.findOne({ email: normalizedEmail });
                    if (!user) return null;

                    const validPassword = await VerifyPassword(password, user.password);
                    if (!validPassword) return null;

                    const plainUser = user.toObject();
                    return {
                        id: plainUser._id.toString(),
                        email: plainUser.email,
                        name: plainUser.name,
                    };
                } catch (error) {
                    console.error('Error during authorization:', error);
                    return null;
                }
            },
        })
    ],
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}recipesafe.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    pages: { signIn: '/login' },
    callbacks: {
        async signIn({ account, profile, user }) {
            if (account?.provider !== 'google') return true;

            const email = user.email || profile?.email;
            const emailVerified = 'email_verified' in (profile || {})
                ? Boolean((profile as { email_verified?: boolean }).email_verified)
                : true;

            if (!email || !emailVerified) return false;

            const appUser = await findOrCreateGoogleUser({
                email,
                name: user.name || profile?.name,
                image: user.image,
            });

            return !!appUser;
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
            }

            if (token.email) {
                await connectDB();
                const appUser = await MongoUser.findOne({ email: String(token.email).trim().toLowerCase() });
                if (appUser) {
                    token.id = appUser._id.toString();
                    token.name = appUser.name;
                    token.email = appUser.email;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session;
        },
    },
};
