import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/userModel";
import { VerifyPassword } from "@/utils/userHelpers/verifyPassword";

const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials as Record<string, string>;

          if (!email || !password) {
            return null;
          }

          await connectDB();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }

          const validPassword = await VerifyPassword(password, user.password);
          if (!validPassword) {
            return null;
          }

          const plainUser = user.toObject();
          return {
            id: plainUser._id.toString(),
            email: plainUser.email,
            name: plainUser.name,
          };
        } catch (error) {
          console.error('error: ', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };