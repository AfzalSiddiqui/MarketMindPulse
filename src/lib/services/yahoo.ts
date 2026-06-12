import { Stock, ChartDataPoint, Index } from "../types";
import {
  YAHOO_BASE_URL,
  getYahooSymbol,
  INDEX_TICKERS,
  YAHOO_CONCURRENCY_LIMIT,
  CHART_CONFIGS,
  ChartTimeframeKey,
} from "./config";
import cache, { CACHE_TTL } from "./cache";

interface YahooQuoteResult {
  meta: {
    regularMarketPrice: number;
    previousClose: number;
    symbol: string;
    shortName?: string;
    currency?: string;
  };
  indicators: {
    quote: Array<{
      open: number[];
      high: number[];
      low: number[];
      close: number[];
      volume: number[];
    }>;
  };
  timestamp?: number[];
}

interface YahooChartResponse {
  chart: {
    result: YahooQuoteResult[] | null;
    error: { code: string; description: string } | null;
  };
}

async function yahooFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    next: { revalidate: 0 },
  });
}

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return vol.toString();
}

function formatMarketCap(cap: number | undefined): string {
  if (!cap) return "N/A";
  if (cap >= 1e12) return `${(cap / 1e12).toFixed(1)}L Cr`;
  if (cap >= 1e9) return `${(cap / 1e9).toFixed(1)}K Cr`;
  if (cap >= 1e7) return `${(cap / 1e7).toFixed(1)} Cr`;
  return cap.toLocaleString("en-IN");
}

export async function fetchStockQuote(
  symbol: string,
  exchange: "NSE" | "BSE"
): Promise<Stock | null> {
  const cacheKey = `yahoo:stock:${symbol}:${exchange}`;
  const cached = cache.get<Stock>(cacheKey);
  if (cached) return cached;

  try {
    const yahooSymbol = getYahooSymbol(symbol, exchange);
    // Use range=5d to get previous trading day's close (range=1d returns 0 change after hours)
    const url = `${YAHOO_BASE_URL}/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=5d`;
    const res = await yahooFetch(url);
    if (!res.ok) return null;

    const json: YahooChartResponse = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const quotes = result.indicators?.quote?.[0];
    const closes = quotes?.close?.filter((c) => c != null) || [];
    const price = meta.regularMarketPrice;

    // Get previous close from the second-to-last trading day's close
    let prevClose = meta.previousClose || price;
    if (closes.length >= 2) {
      prevClose = closes[closes.length - 2];
    }
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;

    // Use only the last day's data for high/low/volume
    const lastDayHighs = quotes?.high ? [quotes.high[quotes.high.length - 1]].filter(Boolean) : [];
    const lastDayLows = quotes?.low ? [quotes.low[quotes.low.length - 1]].filter(Boolean) : [];
    const lastDayVols = quotes?.volume ? [quotes.volume[quotes.volume.length - 1]].filter(Boolean) : [];

    const highs = lastDayHighs.length > 0 ? lastDayHighs : (quotes?.high?.filter(Boolean) || []);
    const lows = lastDayLows.length > 0 ? lastDayLows : (quotes?.low?.filter(Boolean) || []);
    const volumes = lastDayVols.length > 0 ? lastDayVols : (quotes?.volume?.filter(Boolean) || []);

    const dayHigh = highs.length > 0 ? Math.max(...highs) : price;
    const dayLow = lows.length > 0 ? Math.min(...lows) : price;
    const totalVolume = volumes.reduce((a, b) => a + b, 0);

    const stock: Stock = {
      symbol,
      name: meta.shortName || symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume: formatVolume(totalVolume),
      marketCap: "N/A",
      sector: "",
      dayHigh: Math.round(dayHigh * 100) / 100,
      dayLow: Math.round(dayLow * 100) / 100,
      exchange,
    };

    cache.set(cacheKey, stock, CACHE_TTL.STOCKS);
    return stock;
  } catch {
    return null;
  }
}

export async function fetchMultipleStocks(
  symbols: string[],
  exchange: "NSE" | "BSE"
): Promise<Stock[]> {
  const results: Stock[] = [];
  // Process in batches with concurrency limit
  for (let i = 0; i < symbols.length; i += YAHOO_CONCURRENCY_LIMIT) {
    const batch = symbols.slice(i, i + YAHOO_CONCURRENCY_LIMIT);
    const batchResults = await Promise.allSettled(
      batch.map((s) => fetchStockQuote(s, exchange))
    );
    for (const r of batchResults) {
      if (r.status === "fulfilled" && r.value) {
        results.push(r.value);
      }
    }
  }
  return results;
}

export async function fetchIndexQuote(
  indexName: string
): Promise<Index | null> {
  const cacheKey = `yahoo:index:${indexName}`;
  const cached = cache.get<Index>(cacheKey);
  if (cached) return cached;

  const ticker = INDEX_TICKERS[indexName];
  if (!ticker) return null;

  try {
    // Use range=5d to get previous trading day's close (range=1d returns 0 change after hours)
    const url = `${YAHOO_BASE_URL}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=5d`;
    const res = await yahooFetch(url);
    if (!res.ok) return null;

    const json: YahooChartResponse = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const quotes = result.indicators?.quote?.[0];
    const closes = quotes?.close?.filter((c) => c != null) || [];
    const price = meta.regularMarketPrice;

    // Get previous close from the second-to-last trading day
    let prevClose = meta.previousClose || price;
    if (closes.length >= 2) {
      prevClose = closes[closes.length - 2];
    }
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;

    const index: Index = {
      name: indexName,
      value: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
    };

    cache.set(cacheKey, index, CACHE_TTL.INDICES);
    return index;
  } catch {
    return null;
  }
}

export async function fetchStockChart(
  symbol: string,
  exchange: "NSE" | "BSE",
  timeframe: ChartTimeframeKey = "1D"
): Promise<ChartDataPoint[]> {
  const cacheKey = `yahoo:chart:${symbol}:${exchange}:${timeframe}`;
  const cached = cache.get<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const yahooSymbol = getYahooSymbol(symbol, exchange);
    const config = CHART_CONFIGS[timeframe];
    const url = `${YAHOO_BASE_URL}/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=${config.interval}&range=${config.range}`;
    const res = await yahooFetch(url);
    if (!res.ok) return [];

    const json: YahooChartResponse = await res.json();
    const result = json.chart?.result?.[0];
    if (!result || !result.timestamp) return [];

    const quotes = result.indicators?.quote?.[0];
    const closes = quotes?.close || [];
    const timestamps = result.timestamp;

    const points: ChartDataPoint[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (closes[i] == null) continue;
      const d = new Date(timestamps[i] * 1000);
      let label: string;
      if (timeframe === "1D") {
        label = d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        });
      } else if (timeframe === "1W") {
        label = d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          timeZone: "Asia/Kolkata",
        });
      } else {
        label = d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          timeZone: "Asia/Kolkata",
        });
      }
      points.push({
        date: label,
        price: Math.round(closes[i] * 100) / 100,
      });
    }

    cache.set(cacheKey, points, CACHE_TTL.CHART);
    return points;
  } catch {
    return [];
  }
}

export async function fetchIndexChart(
  indexName: string,
  timeframe: ChartTimeframeKey = "1D"
): Promise<ChartDataPoint[]> {
  const cacheKey = `yahoo:indexchart:${indexName}:${timeframe}`;
  const cached = cache.get<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  const ticker = INDEX_TICKERS[indexName];
  if (!ticker) return [];

  try {
    const config = CHART_CONFIGS[timeframe];
    const url = `${YAHOO_BASE_URL}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${config.interval}&range=${config.range}`;
    const res = await yahooFetch(url);
    if (!res.ok) return [];

    const json: YahooChartResponse = await res.json();
    const result = json.chart?.result?.[0];
    if (!result || !result.timestamp) return [];

    const quotes = result.indicators?.quote?.[0];
    const closes = quotes?.close || [];
    const timestamps = result.timestamp;

    const points: ChartDataPoint[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (closes[i] == null) continue;
      const d = new Date(timestamps[i] * 1000);
      let label: string;
      if (timeframe === "1D") {
        label = d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        });
      } else {
        label = d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          timeZone: "Asia/Kolkata",
        });
      }
      points.push({
        date: label,
        price: Math.round(closes[i] * 100) / 100,
      });
    }

    cache.set(cacheKey, points, CACHE_TTL.CHART);
    return points;
  } catch {
    return [];
  }
}
