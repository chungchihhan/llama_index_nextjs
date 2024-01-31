"use client";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
// import Header from "@/app/components/header";
// import ChatSection from "../components/chat-section";
import { Button } from "@/app/components/ui/button";
import { useCopyToClipboard } from "@/app/components/ui/chat/use-copy-to-clipboard";
import ChatAnswer from "../components/ui/chat/chat-answer";
import ChatAvatar from "@/app/components/ui/chat/chat-avatar";
import { Copy, Check } from "lucide-react";

export default function Home() {
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState<string>("");
  const [chatanswer, setChatanswer] = useState<string>("");
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const handleScrape = async () => {
    if (!url) {
      alert("請輸入一個有效的 URL");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Scraping...");
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
      console.log("Scraping complete!");
      const data = await response.json();
      setScrapedData(data);
      console.log("Scraped data:", data);
    } catch (error) {
      console.error("Error during scraping:", error);
      setError("無法抓取數據，請重試");
    }
    setIsLoading(false);
  };

  const handleScrapeChat = async () => {
    if (!scrapedData) {
      alert("請先抓取數據");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending scraped data to /api/scrapeChat...");
      const response = await fetch("/api/scrapeChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: scrapedData.pagesData,
          query: chatQuery,
        }),
      });
      console.log("Request to /api/scrapeChat completed!");
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
            setChatanswer(chatResponse);
            setIsLoading(false);
            return;
          }

          // 將每個串流塊添加到 chatResponse
          const chunk = new TextDecoder("utf-8").decode(value);
          chatResponse += chunk;
          setChatanswer(chatResponse);

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
      {/* <Header /> */}
      {/* <ChatSection /> */}
      <div className="flex gap-2">
        <div className="flex items-center p-2">
          <ChatAvatar role="user" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="請輸入一個有效的 URL"
          className="p-2 border border-gray-300 rounded-xl flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleScrape();
            }
          }}
        />
        <Button
          onClick={() => copyToClipboard(url)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 group-hover:opacity-100 self-center"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <button className="min-w-32" onClick={handleScrape}>
          Scrape Data
        </button>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center p-2">
          <ChatAvatar role="user" />
        </div>
        <input
          type="text"
          value={chatQuery}
          onChange={(e) => setChatQuery(e.target.value)}
          placeholder="請輸入一個問題"
          className="p-2 border border-gray-300 rounded-xl flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleScrapeChat();
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
        <button className="min-w-32" onClick={handleScrapeChat}>
          Chat Result
        </button>
      </div>
      <div className="pl-2">
        {chatanswer && <ChatAnswer chatAnswer={chatanswer} role="chatbot" />}
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {scrapedData && (
        <div>
          <h2>Scraped Data:</h2>
          <div className="overflow-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    頁面鏈接
                  </th>
                  <th scope="col" className="px-6 py-3">
                    頁面內容
                  </th>
                </tr>
              </thead>
              <tbody>
                {scrapedData.pagesData.map(
                  (
                    page: {
                      link:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | PromiseLikeOfReactNode
                        | null
                        | undefined;
                      pageText:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | PromiseLikeOfReactNode
                        | null
                        | undefined;
                    },
                    index: Key | null | undefined
                  ) => (
                    <tr className="bg-white border-b" key={index}>
                      <td className="px-6 py-4">{page.link}</td>
                      <td className="px-6 py-4 ">
                        <p className="overflow-hidden h-20">{page.pageText}</p>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
