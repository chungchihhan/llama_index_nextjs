// api/auth/[...nextauth]/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "@/app/lib/auth";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Handle GET request
    return await NextAuth(req, res);
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Handle POST request
    return await NextAuth(req, res);
  }
}
