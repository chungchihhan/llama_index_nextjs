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
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setFilename(e.dataTransfer.files[0].name);
      console.log("File dragged:", e.dataTransfer.files[0].name);
    } else {
      console.log("No files were dragged into the area.");
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

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFilename(e.target.files[0].name);
    }
  };

  const handleDivClick = () => {
    document.getElementById("fileInput")?.click();
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
    <main className="flex min-h-screen flex-col background-gradient justify-center">
      <form
        onSubmit={OnSubmit}
        className="flex flex-col justify-center items-center gap-5"
      >
        <div
          onClick={handleDivClick} // 添加點擊事件處理器
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          style={{
            border: isDragging ? "3px dashed #000" : "3px dashed #aaa",
            textAlign: "center",
          }}
          className="hover:backdrop-blur-md hover:bg-white/30 self-center flex h-80 px-12 rounded-xl flex-col justify-center cursor-pointer"
        >
          拖拽文件到這裡或點擊上傳文件
          {filename && <p className="text-red-500">{filename}</p>}
        </div>
        <input
          type="file"
          name="file"
          style={{ display: "none" }}
          id="fileInput"
          onChange={onFileInputChange}
        />
        <input
          type="submit"
          value="Upload"
          className="hover:bg-slate-300 flex px-16 py-1 bg-slate-100 rounded-xl cursor-pointer"
        />
      </form>
    </main>
  );
}
