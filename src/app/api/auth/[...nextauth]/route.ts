import NextAuth from "next-auth";
import { options } from "./option"; // Fixed the file path

const handler = NextAuth(options);

export { handler as GET, handler as POST };
