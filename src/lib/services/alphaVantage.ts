import { Stock } from "../types";
import cache, { CACHE_TTL } from "./cache";

const AV_BASE = "https://www.alphavantage.co/query";

function getApiKey(): string {
  return process.env.ALPHA_VANTAGE_API_KEY || "";
}

interface AVGlobalQuote {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

export async function fetchAlphaVantageQuote(
  symbol: string,
  exchange: "NSE" | "BSE"
): Promise<Stock | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const cacheKey = `av:quote:${symbol}:${exchange}`;
  const cached = cache.get<Stock>(cacheKey);
  if (cached) return cached;

  try {
    // Alpha Vantage uses BSE: or NSE: prefix for Indian stocks
    const avSymbol =
      exchange === "BSE" ? `BSE:${symbol}` : `NSE:${symbol}`;
    const url = `${AV_BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(avSymbol)}&apikey=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const json: AVGlobalQuote = await res.json();
    const q = json["Global Quote"];
    if (!q || !q["05. price"]) return null;

    const price = parseFloat(q["05. price"]);
    const change = parseFloat(q["09. change"]);
    const changeStr = q["10. change percent"] || "0%";
    const changePercent = parseFloat(changeStr.replace("%", ""));

    const stock: Stock = {
      symbol,
      name: symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: parseInt(q["06. volume"]).toLocaleString("en-IN"),
      marketCap: "N/A",
      sector: "",
      dayHigh: parseFloat(q["03. high"]) || price,
      dayLow: parseFloat(q["04. low"]) || price,
      exchange,
    };

    cache.set(cacheKey, stock, CACHE_TTL.STOCKS);
    return stock;
  } catch {
    return null;
  }
}
