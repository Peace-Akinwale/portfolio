import * as cheerio from "cheerio";
import { safeFetchText } from "./safe-fetch";

export interface PageData {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  h2s: string[];
  bodyText: string;
  wordCount: number;
  statusCode: number;
  publishedAt: string | null;
}

export async function extractPage(url: string): Promise<PageData | null> {
  let html: string;
  let statusCode: number;

  try {
    const res = await safeFetchText(url, { timeoutMs: 10000, maxBytes: 5 * 1024 * 1024 });
    statusCode = res.status;
    if (!res.ok) {
      return {
        title: null,
        metaDescription: null,
        h1: null,
        h2s: [],
        bodyText: "",
        wordCount: 0,
        statusCode,
        publishedAt: null,
      };
    }
    html = res.text;
  } catch {
    return null;
  }

  const $ = cheerio.load(html);

  // Read the date first: the JSON-LD it can come from is a <script>, and scripts
  // are removed just below.
  const publishedAt = extractPublishedAt($, url);

  // Remove noise
  $("script, style, nav, footer, header, aside, [aria-hidden='true']").remove();

  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $("meta[name='description']").attr("content")?.trim() || null;
  const h1 = $("h1").first().text().trim() || null;
  const h2s = $("h2")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  return { title, metaDescription, h1, h2s, bodyText, wordCount, statusCode, publishedAt };
}

function isValidDate(str: string): boolean {
  const d = new Date(str);
  const year = d.getFullYear();
  return !isNaN(d.getTime()) && year >= 1990 && year <= new Date().getFullYear() + 1;
}

function extractPublishedAt(
  $: ReturnType<typeof import("cheerio").load>,
  url: string
): string | null {
  // 1. Open Graph / standard meta tags
  const metaSelectors = [
    "meta[property='article:published_time']",
    "meta[property='og:article:published_time']",
    "meta[name='article:published_time']",
    "meta[name='date']",
    "meta[name='publish-date']",
    "meta[name='pubdate']",
    "meta[name='DC.date.issued']",
  ];
  for (const sel of metaSelectors) {
    const val = $(sel).attr("content")?.trim();
    if (val && isValidDate(val)) return new Date(val).toISOString();
  }

  // 2. JSON-LD structured data
  for (const el of $("script[type='application/ld+json']").toArray()) {
    try {
      const json = JSON.parse($(el).html() ?? "");
      const entries = Array.isArray(json["@graph"]) ? json["@graph"] : [json];
      for (const entry of entries) {
        const date = entry.datePublished ?? entry.dateCreated;
        if (date && isValidDate(String(date))) return new Date(String(date)).toISOString();
      }
    } catch {
      // malformed JSON-LD — skip
    }
  }

  // 3. <time datetime="..."> element
  const timeAttr = $("time[datetime]").first().attr("datetime")?.trim();
  if (timeAttr && isValidDate(timeAttr)) return new Date(timeAttr).toISOString();

  // 4. Date in URL: /2024/01/15/ or /2024-01-15
  const urlMatch = url.match(/\/(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
  if (urlMatch) {
    const dateStr = `${urlMatch[1]}-${urlMatch[2]}-${urlMatch[3]}`;
    if (isValidDate(dateStr)) return new Date(dateStr).toISOString();
  }

  return null;
}
