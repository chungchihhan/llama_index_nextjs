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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const document = new Document({ text: buffer.toString() });

    // 創建存儲索引的文件夾名稱，基於文件名
    const indexFolderName = filename.replace(".pdf", "") + "index";
    console.log(indexFolderName);

    const storageContext = await storageContextFromDefaults({
      persistDir: `./PDFstorage/${indexFolderName}`, // 使用文件名作為子文件夾名稱
    });

    const index = await VectorStoreIndex.fromDocuments([document], {
      storageContext,
    });

    console.log("Index created and saved to disk");
    return NextResponse.json({
      success: true,
      folder: indexFolderName,
      message: `Index for ${filename} created and saved to disk.`,
    });
  } catch (e) {
    console.error("Error creating or saving index:", e);
    return NextResponse.json({
      success: false,
      message: "Error creating or saving index",
    });
  }
}
