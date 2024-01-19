import { NextResponse, NextRequest } from "next/server";
import cheerio from "cheerio";
import fetch from "node-fetch"; // Make sure node-fetch is installed

export async function GET(req: NextRequest) {
  try {
    // Fetch the HTML content of the main web page
    const mainResponse = await fetch("https://www.fanuc.com/");
    const mainHtml = await mainResponse.text();
    const $main = cheerio.load(mainHtml);

    // Extract links
    const links = $main("a")
      .map((i, el) => $main(el).attr("href"))
      .get()
      .filter((link) => link && link.startsWith("http")); // Filter out invalid links

    // Iterate over links and fetch each page
    const pagesData = await Promise.all(
      links.map(async (link) => {
        try {
          const pageResponse = await fetch(link);
          const pageHtml = await pageResponse.text();
          const $page = cheerio.load(pageHtml);

          // Extract data from page, for example, all paragraph texts
          const pageText = $page("p").text();
          return { link, pageText };
        } catch (error) {
          console.error(`Error fetching ${link}:`, error);
          return { link, error: "Failed to fetch" };
        }
      })
    );

    // Return the scraped data as a JSON response
    return new NextResponse(JSON.stringify({ pagesData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to scrape" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
