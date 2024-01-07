// api/auth/[...nextauth]/route.ts
import { NextRequest, NextResponse } from "next/server";
import NextAuth from "@/app/lib/auth";

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === "GET") {
    // Handle GET request
    return await NextAuth(req, res);
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    // Handle POST request
    return await NextAuth(req, res);
  }
}
