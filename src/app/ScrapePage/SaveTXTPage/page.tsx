"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File>();
  function saveFilenameInLocalStorage(filename: string) {
    const files = JSON.parse(localStorage.getItem("allfiles") || "[]");
    files.push(filename);
    localStorage.setItem("allfiles", JSON.stringify(files));
  }
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
        <input
          type="file"
          name="file"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <input type="submit" value="Upload" />
      </form>
    </main>
  );
}
