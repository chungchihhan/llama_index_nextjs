// api/auth/[...nextauth]/route.ts
import { Request, Response } from "express";
import NextAuth from "@/app/lib/auth";

export async function GET(req: Request, res: Response) {
  if (req.method === "GET") {
    // Handle GET request
    return await NextAuth(req, res);
  }
}

export async function POST(req: Request, res: Response) {
  if (req.method === "POST") {
    // Handle POST request
    return await NextAuth(req, res);
  }
}
