// pages/api/chatbot.ts

import fs from "fs";
import path from "path";
import {
  ContextChatEngine,
  Document,
  serviceContextFromDefaults,
  VectorStoreIndex,
} from "llamaindex";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const content = body.content;
      const query = body.query;

      // // Initialize your chat engine here
      const document = new Document({ text: content });
      const serviceContext = serviceContextFromDefaults({ chunkSize: 512 });
      const index = await VectorStoreIndex.fromDocuments([document], {
        serviceContext,
      });
      const retriever = index.asRetriever();
      retriever.similarityTopK = 5;
      const chatEngine = new ContextChatEngine({ retriever });
      const stream = await chatEngine.chat(query, undefined, true);

      // Process the query
      // const stream = await chatEngine.chat({ message: query, stream: true });
      let chatResponse = "";
      for await (const chunk of stream) {
        chatResponse += chunk;
      }

      // Send the response
      return new NextResponse(JSON.stringify({ chatResponse }), {
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
