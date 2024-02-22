"use client";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
  useEffect,
} from "react";

import { Button } from "@/app/components/ui/button";
import { useCopyToClipboard } from "@/app/components/ui/chat/use-copy-to-clipboard";
import ChatAnswer from "@/app/components/ui/chat/chat-answer";
import ChatAvatar from "@/app/components/ui/chat/chat-avatar";
import { Copy, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState<string>("");
  const [chooseFolder, setChooseFolder] = useState<string>("");
  const [chatanswer, setChatanswer] = useState<string>("");
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const allFiles = localStorage.getItem("allfiles");
    if (allFiles) {
      setFolders(JSON.parse(allFiles));
    }
  }, []);

  const handleChat = async () => {
    if (!chatQuery) {
      alert("請先輸入問題");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending scraped data to /api/scrapeChat...");
      const response = await fetch("/api/loadtxtIndex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: chatQuery,
          selectedFolder: chooseFolder,
        }),
      });
      console.log(response.body);
      if (response.body) {
        const reader = response.body.getReader();
        let chatResponse = "";

        // 讀取串流數據
        const processText = async ({
          done,
          value,
        }: ReadableStreamReadResult<Uint8Array>): Promise<void> => {
          if (done) {
            console.log("Stream complete");
            const jsonResponse = JSON.parse(chatResponse);
            setChatanswer(jsonResponse.queryResponse);
            setIsLoading(false);
            return;
          }

          // 將每個串流塊添加到 chatResponse
          const chunk = new TextDecoder("utf-8").decode(value);
          chatResponse += chunk;

          // 讀取下一個串流塊
          return reader.read().then(processText);
        };

        reader.read().then(processText);
      } else {
        console.error("No response body");
        setError("無回應體");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during sending scraped data:", error);
      setError("無法發送數據，請重試");
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col gap-3 p-24 background-gradient">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex items-center justify-center font-nunito text-lg font-bold gap-4">
            <Link href="/">
              <Image
                className="rounded-xl m-2"
                src="/smart-manufacturing.png"
                alt="Llama Logo"
                width={32}
                height={32}
                priority
              />
            </Link>
            <span>Ask any questions about selected .txt data!</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center p-2">
          <ChatAvatar role="user" />
        </div>
        <select
          value={chooseFolder}
          onChange={(e) => setChooseFolder(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="">Select a folder</option>
          {folders.map((folder) => (
            <option key={folder} value={`${folder}index`}>
              {folder}
            </option>
          ))}
        </select>
        <div className="border border-gray-300 rounded-xl flex flex-grow bg-white gap-1 pr-5">
          <input
            type="text"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            placeholder="請輸入一個問題"
            className="flex-grow pl-3 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
                handleChat();
              }
            }}
          />
          <Button
            onClick={() => copyToClipboard(chatQuery)}
            size="icon"
            variant="ghost"
            className="h-8 w-8 group-hover:opacity-100 self-center"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <button
            className="hover:bg-slate-100 rounded-lg my-2"
            onClick={handleChat}
          >
            Start Asking
          </button>
        </div>
      </div>
      <div className="pl-2">
        {chatanswer && <ChatAnswer chatAnswer={chatanswer} role="chatbot" />}
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}
