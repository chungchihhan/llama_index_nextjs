"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");

  function saveFilenameInLocalStorage(filename: string) {
    const files = JSON.parse(localStorage.getItem("allfiles") || "[]");
    files.push(filename);
    localStorage.setItem("allfiles", JSON.stringify(files));
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // 防止瀏覽器的默認處理方式（比如打開文件）
    setIsDragging(false); // 更新拖拽狀態

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]); // 取得拖拽的第一個文件並更新狀態
      setFilename(e.dataTransfer.files[0].name);
      console.log("File dragged:", e.dataTransfer.files[0].name); // 可以在控制台輸出文件名來確認
    } else {
      console.log("No files were dragged into the area."); // 如果沒有文件，輸出提示信息
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    try {
      const data = new FormData();
      data.set("file", file);
      data.set("filename", file.name);
      const res = await fetch("/api/savetxtIndex", {
        method: "POST",
        body: data,
      });
      saveFilenameInLocalStorage(file.name);
      if (!res.ok) throw new Error(await res.text());
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <main>
      <form onSubmit={OnSubmit}>
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          style={{
            border: isDragging ? "3px dashed #000" : "3px dashed #aaa",
            padding: "20px",
            textAlign: "center",
            marginBottom: "20px",
          }}
          className="hover:bg-slate-100"
        >
          拖拽文件到這裡或點擊下方選擇文件
          {filename && <p className="text-red-500">{filename}</p>}
        </div>
        <input
          type="file"
          name="file"
          style={{ display: "none" }}
          id="fileInput"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <label
          htmlFor="fileInput"
          style={{ cursor: "pointer" }}
          className="hover:bg-slate-300"
        >
          選擇文件
        </label>
        <input type="submit" value="Upload" className="hover:bg-slate-300" />
      </form>
    </main>
  );
}
