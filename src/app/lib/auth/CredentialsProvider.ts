import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/src/app/db";
import { usersTable } from "@/src/app/db/schema";
import { authSchema } from "@/validators/auth";

// import router from "next/navigation";

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    isSignUp: { label: "isSignUp" },
    email: { label: "Email", type: "text" },
    username: { label: "Username", type: "text", optional: true },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      isSignUp: string;
      email: string;
      username?: string;
      password: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      // console.log("Wrong credentials. Try again.");
      return null;
    }
    const { isSignUp, email, username, password } = validatedCredentials;

    const [existedUser] = await db
      .select({
        id: usersTable.displayId,
        username: usersTable.username,
        email: usersTable.email,
        provider: usersTable.provider,
        hashedPassword: usersTable.hashedPassword,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validatedCredentials.email.toLowerCase()))
      .execute();

    if (isSignUp === "true") {
      if (!existedUser) {
        // Sign up
        if (!username) {
          // console.log("Name is required.");
          return null;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [createdUser] = await db
          .insert(usersTable)
          .values({
            username,
            email: email.toLowerCase(),
            hashedPassword,
            provider: "credentials",
          })
          .returning();
        return {
          email: createdUser.email,
          name: createdUser.username,
          id: createdUser.displayId,
        };
      } else {
        // console.log("User already exists!");
        return null;
      }
    } else {
      // Sign in
      if (existedUser.provider !== "credentials") {
        // console.log(`The email has registered with ${existedUser.provider}.`);
        return null;
      }

      if (!existedUser.hashedPassword) {
        // console.log("The email has registered with social account.");
        return null;
      }

      const isValid = await bcrypt.compare(
        password,
        existedUser.hashedPassword
      );
      if (!isValid) {
        console.log("Wrong password. Try again.");
        return null;
      }
      return {
        email: existedUser.email,
        name: existedUser.username,
        id: existedUser.id,
      };
    }
  },
});
