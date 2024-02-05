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
      const query = body.query;

      const storageContext = await storageContextFromDefaults({
        persistDir: "./storage",
      });
      const loadedIndex = await VectorStoreIndex.init({
        storageContext: storageContext,
      });
      const loadedQueryEngine = loadedIndex.asQueryEngine();
      const loadedResponse = await loadedQueryEngine.query(query);
      console.log(loadedResponse.toString());

      return new Response(JSON.stringify({ loadedResponse }), {
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
