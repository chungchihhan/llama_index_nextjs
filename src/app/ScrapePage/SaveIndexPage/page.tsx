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

import { Button } from "@/app/components/ui/button";
import { useCopyToClipboard } from "@/app/components/ui/chat/use-copy-to-clipboard";

import ChatAvatar from "@/app/components/ui/chat/chat-avatar";
import { Copy, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PageData {
  link: string | undefined;
  pageText: string | undefined;
}

export default function Home() {
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState<string>("");
  const [chatanswer, setChatanswer] = useState<string>("");
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const convertDataToCSV = (data: PageData[]) => {
    const headers = "links,contents\n";
    const rows = data
      .map(
        (page: PageData) =>
          `"${page.link?.replace(/"/g, '""') || ""}","${
            page.pageText?.replace(/"/g, '""') || ""
          }"`
      )
      .join("\n");
    return headers + rows;
  };

  const downloadCSV = (
    csvString: string,
    filename: string = "scraped-data.csv"
  ) => {
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("CSV downloaded");
  };

  const handleDownloadCSV = (): void => {
    if (!scrapedData) {
      alert("請先抓取數據");
      return;
    }
    const csvString = convertDataToCSV(scrapedData.pagesData);
    downloadCSV(csvString);
  };

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
      if (!response.ok) {
        alert("無法抓取數據，請重試");
      } else {
        console.log("Scraping complete!");
        const data = await response.json();
        setScrapedData(data);
        console.log("Scraped data:", data.pagesData);
      }
    } catch (error) {
      console.error("Error during scraping:", error);
      setError("無法抓取數據，請重試");
    }
    setIsLoading(false);
  };

  const convertDataToText = (data: any[]) => {
    return data
      .map((page: { link: any; pageText: any }, index: number) => {
        return `Page ${index + 1} URL: ${page.link}\nPage Text: ${
          page.pageText
        }\n\n`;
      })
      .join("");
  };

  const handleSaveIndex = async () => {
    if (!scrapedData) {
      alert("請先抓取數據");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Sending scraped data to /api/saveIndex...");
      const response = await fetch("/api/saveIndex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: convertDataToText(scrapedData.pagesData),
        }),
      });
      console.log("Request to /api/saveIndex completed!");
      if (!response.ok) {
        console.error("No response body");
        setError("無回應體");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error during saving index:", error);
      setError("無法發送數據，請重試");
    }
    setIsLoading(false);
    alert("Index is saved!");
  };

  return (
    <main className="flex min-h-screen flex-col gap-3 p-24 background-gradient ">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex items-center justify-center font-nunito text-lg font-bold gap-4 ">
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
            <span>Save the scraped data here</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/ScrapePage">
            <p className="flex justify-center hover:bg-slate-100 p-2 rounded-lg ">
              {"<"} Back to realtime-mode
            </p>
          </Link>
          <Link href="/ScrapePage/LoadIndexPage">
            <p className="flex justify-center hover:bg-slate-100 p-2 rounded-lg ">
              Talk to saved data {">"}
            </p>
          </Link>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center p-2">
          <ChatAvatar role="user" />
        </div>
        <div className="border border-gray-300 rounded-xl flex flex-grow bg-white gap-1 pr-5">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="請輸入一個有效的 URL"
            className="flex-grow pl-3 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
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
          <button
            className="hover:bg-slate-100 rounded-lg my-2"
            onClick={handleScrape}
          >
            Start Scraping
          </button>
        </div>
      </div>
      {isLoading && <p className="self-center py-3">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {scrapedData && (
        <div className="flex flex-col gap-3 bg-slate-400 bg-opacity-25 p-3 rounded-xl">
          <div className="flex bg-white p-4 rounded-lg gap-3">
            <p className="flex-grow self-center">Scraped Data:</p>
            <button
              className="min-w-24 bg-slate-200 h-8 rounded-lg hover:bg-slate-300"
              onClick={handleDownloadCSV}
            >
              Save CSV
            </button>
            <button
              className="min-w-24 bg-slate-200 h-8 rounded-lg hover:bg-slate-300"
              onClick={handleSaveIndex}
            >
              Save Index
            </button>
          </div>
          <div className="overflow-auto rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-slate-100">
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
                  (page: { link: string; pageText: string }, index: Key) => (
                    <tr className="bg-white" key={index}>
                      <div className="px-6 py-4">
                        <a
                          href={page.link}
                          className="hover:text-blue-400 underline"
                        >
                          {page.link}
                        </a>
                      </div>
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
