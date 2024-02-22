import {
  ContextChatEngine,
  Document,
  serviceContextFromDefaults,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "llamaindex";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const content = body.content;

      // // Initialize your chat engine here
      const document = new Document({ text: content });
      const storageContext = await storageContextFromDefaults({
        persistDir: "./storage",
      });
      const index = await VectorStoreIndex.fromDocuments([document], {
        storageContext,
      });
      return new Response(JSON.stringify({ success: "success" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
      return new NextResponse(JSON.stringify({ error: "error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } else {
    // res.setHeader("Allow", ["POST"]);
    return new NextResponse(JSON.stringify({ error: "error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
