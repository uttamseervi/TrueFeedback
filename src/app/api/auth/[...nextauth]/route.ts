import NextAuth from "next-auth/next";
import { authOptions } from "./options"

/*
the method has to be named handler only for more info refer documentation section: configuration/initialization
*/
const handler = NextAuth(authOptions)


export { handler as GET, handler as POST }