import { NextRequest, NextResponse } from "next/server";
import {
  VectorStoreIndex,
  Document,
  storageContextFromDefaults,
} from "llamaindex";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  // 假設文件名從前端以 form-data 的形式傳遞，並且字段名為 "filename"
  const file: File | null = data.get("file") as unknown as File;
  const filename: string | null = data.get("filename") as string;

  if (!file || !filename) {
    return NextResponse.json({
      success: false,
      message: "File or filename is missing",
    });
  }
  try {
    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);
    // const document = new Document({ text: buffer.toString() });

    // Call the external API to upload the document
    const formData = new FormData();
    formData.append("api", "SYNO.FileStation.Upload");
    formData.append("version", "2");
    formData.append("method", "upload");
    formData.append("path", "/web/115-test");
    formData.append("create_parents", "true");
    formData.append("file", file);

    const response = await fetch(
      "http://140.112.16.46:5000/webapi/entry.cgi?SynoToken=5J7HxBs.tD9BU",
      {
        method: "POST",
        body: formData,
      }
    );
    const responseData = await response.json();
    console.log(responseData);

    if (!response.ok || !responseData.success) {
      throw new Error("Failed to upload document to external API");
    }

    return NextResponse.json({
      success: true,
      message: `Document ${filename} uploaded successfully.`,
    });
  } catch (e) {
    console.error("Error creating or saving index:", e);
    return NextResponse.json({
      success: false,
      message: "Error creating or saving index",
    });
  }
}
