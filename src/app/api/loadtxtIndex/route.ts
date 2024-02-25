import { storageContextFromDefaults, VectorStoreIndex } from "llamaindex";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const query = body.query;
      const selectedFolder = body.selectedFolder;
      const indexFolderName = selectedFolder.replace(".txt", "") + "-index";
      console.log("indexFolderName: ", indexFolderName);

      const storageContext = await storageContextFromDefaults({
        persistDir: `./TXTstorage/${indexFolderName}`,
      });

      const loadedIndex = await VectorStoreIndex.init({
        storageContext: storageContext,
      });
      const loadedQueryEngine = loadedIndex.asQueryEngine();
      const loadedResponse = await loadedQueryEngine.query(query);
      // console.log(loadedResponse.response);
      const queryResponse = loadedResponse.response;

      return new Response(JSON.stringify({ queryResponse }), {
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
