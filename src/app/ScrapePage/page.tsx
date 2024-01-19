"use client";
import { useState } from "react";
import Header from "@/app/components/header";
import ChatSection from "../components/chat-section";

export default function Home() {
  const [scrapedData, setScrapedData] = useState(null);

  const handleScrape = async () => {
    try {
      console.log("Scraping...");
      const response = await fetch("/api/scrape"); // Replace '/api/scrape' with your actual API route
      console.log("Scraping complete!");
      const data = await response.json();
      setScrapedData(data);
    } catch (error) {
      console.error("Error during scraping:", error);
    }
  };

  const handleSave = () => {
    if (scrapedData) {
      localStorage.setItem("scrapedData", JSON.stringify(scrapedData));
    }
  };

  const handlePreview = () => {
    const data = localStorage.getItem("scrapedData");
    if (data) {
      // Logic to display the data
      console.log("Preview Data:", JSON.parse(data));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 background-gradient">
      {/* <Header /> */}
      {/* <ChatSection /> */}
      <h1>123</h1>
      <button onClick={handleScrape}>Scrape Data</button>
      <button onClick={handleSave}>Save Data</button>
      <button onClick={handlePreview}>Preview Data</button>
      {/* Display scraped data if available */}
      {scrapedData && (
        <div>
          <h2>Scraped Data:</h2>
          <pre>{JSON.stringify(scrapedData, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
