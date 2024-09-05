import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect();
                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { username: credentials.identifier.username }

                        ]
                    })
                    if (!user) throw new Error("NO User found with this email");
                    if (user.isVerified) throw new Error("Please verify your account first before login");
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (isValidPassword) return user;
                    else {
                        throw new Error("Incorrect Password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        /*
        We have modified the user in the jwt callback and session callback inOrder to hold more user info for more details visit next-auth.d.ts file in types
        */
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.username = token.username;
                session.user.isAcceptingMessages = token.isAcceptingMessages;

            }
            return session
        },
    }
}