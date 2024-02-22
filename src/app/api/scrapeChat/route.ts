import {
  ContextChatEngine,
  Document,
  serviceContextFromDefaults,
  VectorStoreIndex,
} from "llamaindex";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

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

      // 創建一個可讀流
      const readableStream = new ReadableStream({
        start(controller) {
          // 這裡處理您的串流邏輯
          (async () => {
            for await (const chunk of stream) {
              controller.enqueue(chunk);
            }
            controller.close();
          })();
        },
      });

      // 使用可讀流作為回應
      return new Response(readableStream, {
        headers: { "Content-Type": "text/plain" },
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
