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
      //   const { query } = req.body;

      // Read the essay file
      const essayPath = path.join(
        __dirname,
        "../../../../../data/fanuc_scrape.txt"
      );
      const essay = fs.readFileSync(essayPath, "utf-8");

      // // Initialize your chat engine here
      const document = new Document({ text: essay });
      const serviceContext = serviceContextFromDefaults({ chunkSize: 512 });
      const index = await VectorStoreIndex.fromDocuments([document], {
        serviceContext,
      });
      const retriever = index.asRetriever();
      retriever.similarityTopK = 5;
      const chatEngine = new ContextChatEngine({ retriever });
      const body = await req.json();
      const query = body.query;
      const stream = await chatEngine.chat(query, undefined, true);

      // Process the query
      // const stream = await chatEngine.chat({ message: query, stream: true });
      let response = "";
      for await (const chunk of stream) {
        response += chunk;
      }

      // Send the response
      return new NextResponse(JSON.stringify({ response }), {
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
