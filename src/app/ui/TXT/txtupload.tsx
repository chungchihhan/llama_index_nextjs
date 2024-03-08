// FileUploader.tsx
import React, { useState } from "react";
import { revalidatePath } from "next/cache";

interface TXTUploaderProps {
  onSaveFilename?: (filename: string) => void;
}

export default function TXTUploader({ onSaveFilename }: TXTUploaderProps) {
  const [file, setFile] = useState<File>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // New loading state

  const saveFilenameInLocalStorage = (filename: string) => {
    const files = JSON.parse(localStorage.getItem("allfiles") || "[]");
    files.push(filename);
    localStorage.setItem("allfiles", JSON.stringify(files));
    window.dispatchEvent(new Event("allfiles-updated"));
    if (onSaveFilename) onSaveFilename(filename);
  };

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
    setIsLoading(true); // Start loading
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
      window.dispatchEvent(new Event("allfiles-updated"));
      setFilename("檔案上傳成功");
      alert("File uploaded successfully!");
    } catch (e: any) {
      console.error(e);
      alert("Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col justify-center">
      <span className="p-2">Upload Your TXT file here!</span>
      <form
        onSubmit={OnSubmit}
        className="flex flex-col justify-center items-center gap-5"
      >
        {isLoading ? (
          <div
            className="hover:backdrop-blur-md hover:bg-white/30 self-center flex h-52 w-60 px-12 rounded-xl flex-col justify-center cursor-pointer text-center"
            style={{
              border: isDragging ? "3px dashed #000" : "3px dashed #aaa",
              textAlign: "center",
            }}
          >
            loading...
          </div>
        ) : (
          <div
            onClick={handleDivClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            style={{
              border: isDragging ? "3px dashed #000" : "3px dashed #aaa",
              textAlign: "center",
            }}
            className="hover:backdrop-blur-md hover:bg-white/30 self-center flex h-52 w-60 px-12 rounded-xl flex-col justify-center cursor-pointer"
          >
            拖拽文件到這裡
            <br />
            或點擊上傳文件
            {filename && <p className="text-red-500">{filename}</p>}
          </div>
        )}
        <input
          type="file"
          name="file"
          style={{ display: "none" }}
          id="fileInput"
          onChange={onFileInputChange}
        />
        <input
          type="submit"
          value="Convert"
          className="hover:bg-slate-300 flex px-16 py-1 bg-slate-200 rounded-xl cursor-pointer"
        />
      </form>
    </main>
  );
}
