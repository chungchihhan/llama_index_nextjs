import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { useCopyToClipboard } from "@/app/components/ui/chat/use-copy-to-clipboard";
import ChatAnswer from "@/app/components/ui/chat/chat-answer";
import ChatAvatar from "@/app/components/ui/chat/chat-avatar";
import { Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function TXTChatComponent(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState<string>("");
  const [chooseFolder, setChooseFolder] = useState<string>("");
  const [chatanswer, setChatanswer] = useState<string>("");
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Initial fetch of 'allfiles' from localStorage
    const fetchFolders = () => {
      const allFiles = localStorage.getItem("allfiles");
      if (allFiles) {
        setFolders(JSON.parse(allFiles));
      }
    };

    fetchFolders(); // Call this function on component mount to load initial folders

    // Event listener for 'allfiles-updated' to refresh folders
    const handleAllFilesUpdated = () => {
      console.log("allfiles updated, refreshing folders");
      fetchFolders();
    };

    window.addEventListener("allfiles-updated", handleAllFilesUpdated);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("allfiles-updated", handleAllFilesUpdated);
    };
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
    <main className="flex flex-col gap-3 py-24">
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
      <div className="flex items-center p-2 gap-2">
        <select
          value={chooseFolder}
          onChange={(e) => setChooseFolder(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full"
        >
          <option value="">Select a folder</option>
          {folders.map((folder) => (
            <option key={folder} value={`${folder}`}>
              {folder}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 pr-2">
        <div className="p-2">
          <ChatAvatar role="user" />
        </div>
        <div className="border border-gray-300 rounded-xl flex flex-grow bg-white gap-1 pr-2">
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
            className="hover:bg-slate-100 rounded-lg h-8 w-8 self-center"
            onClick={handleChat}
          >
            -&gt;
          </button>
        </div>
      </div>
      <div className="pl-2">
        {chatanswer && (
          <div>
            <ChatAnswer chatAnswer={chatanswer} role="chatbot" />
          </div>
        )}
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}
