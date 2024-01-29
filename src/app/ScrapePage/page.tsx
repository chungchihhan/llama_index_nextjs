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

export default function Home() {
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState<string>("");
  const [chatanswer, setChatanswer] = useState<string>("");

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
      const res = await response.json();
      console.log("Response data:", res);
      setChatanswer(res.chatResponse);
    } catch (error) {
      console.error("Error during sending scraped data:", error);
      setError("無法發送數據，請重試");
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient">
      {/* <Header /> */}
      {/* <ChatSection /> */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="請輸入一個有效的 URL"
        className="p-2 border border-gray-300 rounded"
      />
      <button onClick={handleScrape}>Scrape Data</button>
      <input
        type="text"
        value={chatQuery}
        onChange={(e) => setChatQuery(e.target.value)}
        placeholder="請輸入一個問題"
        className="p-2 border border-gray-300 rounded"
      />
      <button onClick={handleScrapeChat}>get Chat result</button>
      <div>{chatanswer}</div>
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
