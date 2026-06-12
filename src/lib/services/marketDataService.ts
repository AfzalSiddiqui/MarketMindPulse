import {
  Stock,
  Index,
  SectorData,
  ChartDataPoint,
  PaginatedResponse,
  StockListEntry,
} from "../types";
import { isMarketOpen, STOCKS_PER_PAGE, ChartTimeframeKey } from "./config";
import {
  fetchMultipleStocks,
  fetchIndexQuote,
  fetchStockChart,
  fetchIndexChart,
} from "./yahoo";
import { fetchNseIndices, fetchNseSectorData } from "./nse";
import { fetchAlphaVantageQuote } from "./alphaVantage";
import {
  stocks as mockStocks,
  indices as mockIndices,
  sectorData as mockSectorData,
  niftyChartData as mockNiftyChart,
  getStockChartData as getMockChartData,
} from "../mockData";
import stockListData from "../data/stock-list.json";

// Stock list helpers
export function getStockList(exchange: "NSE" | "BSE"): StockListEntry[] {
  const list = exchange === "NSE" ? stockListData.nse : stockListData.bse;
  return list as StockListEntry[];
}

export function getStockListPage(
  exchange: "NSE" | "BSE",
  page: number,
  pageSize: number = STOCKS_PER_PAGE
): { entries: StockListEntry[]; total: number; totalPages: number } {
  const list = getStockList(exchange);
  const total = list.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const entries = list.slice(start, start + pageSize);
  return { entries, total, totalPages };
}

// Mock stock generator for fallback
function generateMockStock(
  entry: StockListEntry,
  exchange: "NSE" | "BSE"
): Stock {
  // Use the symbol as seed for deterministic mock data
  let seed = 0;
  const sym = entry.symbol;
  for (let i = 0; i < sym.length; i++) {
    seed = (seed * 31 + sym.charCodeAt(i)) & 0x7fffffff;
  }

  const basePrice = 100 + (seed % 5000);
  const changePct = ((seed % 600) - 300) / 100; // -3% to +3%
  const change = Math.round(basePrice * changePct) / 100;

  return {
    symbol: sym,
    name: entry.name,
    price: Math.round(basePrice * 100) / 100,
    change,
    changePercent: Math.round(changePct * 100) / 100,
    volume: `${((seed % 20) + 1).toFixed(1)}M`,
    marketCap: "N/A",
    sector: entry.sector || "",
    dayHigh: Math.round((basePrice + Math.abs(change) * 2) * 100) / 100,
    dayLow: Math.round((basePrice - Math.abs(change) * 2) * 100) / 100,
    exchange,
  };
}

/**
 * Get paginated stock data with fallback chain:
 * Yahoo Finance → Alpha Vantage → Mock data
 */
export async function getStocksPage(
  exchange: "NSE" | "BSE",
  page: number,
  pageSize: number = STOCKS_PER_PAGE
): Promise<PaginatedResponse<Stock>> {
  const { entries, total, totalPages } = getStockListPage(
    exchange,
    page,
    pageSize
  );

  const symbols = entries.map((e) =>
    exchange === "NSE" ? e.symbol : e.nseCode || e.symbol
  );

  // Try Yahoo Finance first
  let stocks = await fetchMultipleStocks(symbols, exchange);

  // For any missing symbols, try Alpha Vantage
  const fetchedSymbols = new Set(stocks.map((s) => s.symbol));
  const missing = entries.filter(
    (e) => !fetchedSymbols.has(exchange === "NSE" ? e.symbol : e.nseCode || e.symbol)
  );

  if (missing.length > 0) {
    const avResults = await Promise.allSettled(
      missing.slice(0, 5).map((e) => {
        const sym = exchange === "NSE" ? e.symbol : e.nseCode || e.symbol;
        return fetchAlphaVantageQuote(sym, exchange);
      })
    );
    for (const r of avResults) {
      if (r.status === "fulfilled" && r.value) {
        stocks.push(r.value);
      }
    }
  }

  // Fill remaining gaps with mock data
  const finalFetchedSymbols = new Set(stocks.map((s) => s.symbol));
  for (const entry of entries) {
    const sym = exchange === "NSE" ? entry.symbol : entry.nseCode || entry.symbol;
    if (!finalFetchedSymbols.has(sym)) {
      stocks.push(generateMockStock(entry, exchange));
    }
  }

  // Enrich with metadata from stock list
  const entryMap = new Map(
    entries.map((e) => [
      exchange === "NSE" ? e.symbol : e.nseCode || e.symbol,
      e,
    ])
  );
  stocks = stocks.map((s) => {
    const entry = entryMap.get(s.symbol);
    if (entry) {
      return {
        ...s,
        name: s.name === s.symbol ? entry.name : s.name,
        exchange,
      };
    }
    return { ...s, exchange };
  });

  return {
    data: stocks,
    page,
    pageSize,
    totalPages,
    total,
  };
}

/**
 * Get all 4 market indices with fallback:
 * Yahoo → NSE → Mock
 */
export async function getAllIndices(): Promise<Index[]> {
  const indexNames = ["NIFTY 50", "SENSEX", "BANK NIFTY", "NIFTY IT"];

  // Try Yahoo first
  const yahooResults = await Promise.allSettled(
    indexNames.map((name) => fetchIndexQuote(name))
  );

  const indices: Index[] = [];
  const missingIndices: string[] = [];

  for (let i = 0; i < indexNames.length; i++) {
    const r = yahooResults[i];
    if (r.status === "fulfilled" && r.value) {
      indices.push(r.value);
    } else {
      missingIndices.push(indexNames[i]);
    }
  }

  // Try NSE for missing
  if (missingIndices.length > 0) {
    const nseIndices = await fetchNseIndices();
    for (const name of missingIndices) {
      const nseIdx = nseIndices.find((idx) => idx.name === name);
      if (nseIdx) {
        indices.push(nseIdx);
      }
    }
  }

  // Fill remaining from mock
  const fetched = new Set(indices.map((idx) => idx.name));
  for (const mock of mockIndices) {
    if (!fetched.has(mock.name)) {
      indices.push(mock);
    }
  }

  // Sort to maintain consistent order
  return indices.sort(
    (a, b) => indexNames.indexOf(a.name) - indexNames.indexOf(b.name)
  );
}

/**
 * Get sector performance with fallback:
 * NSE → Mock
 */
export async function getSectorData(): Promise<SectorData[]> {
  const nseSectors = await fetchNseSectorData();
  if (nseSectors.length >= 5) return nseSectors;

  // Fall back to mock
  return mockSectorData;
}

/**
 * Get chart data for a stock with fallback:
 * Yahoo → Mock (for 1D only)
 */
export async function getStockChartData(
  symbol: string,
  exchange: "NSE" | "BSE" = "NSE",
  timeframe: ChartTimeframeKey = "1D"
): Promise<ChartDataPoint[]> {
  const data = await fetchStockChart(symbol, exchange, timeframe);
  if (data.length > 0) return data;

  // Only mock fallback for 1D
  if (timeframe === "1D") {
    return getMockChartData(symbol);
  }
  return [];
}

/**
 * Get index chart data (NIFTY/SENSEX) with timeframe
 */
export async function getIndexChartData(
  indexName: string,
  timeframe: ChartTimeframeKey = "1D"
): Promise<ChartDataPoint[]> {
  const data = await fetchIndexChart(indexName, timeframe);
  if (data.length > 0) return data;

  // Mock fallback for NIFTY 1D only
  if (indexName === "NIFTY 50" && timeframe === "1D") {
    return mockNiftyChart;
  }
  return [];
}

/**
 * Get quick stock quotes for SSE streaming
 */
export async function getQuotesForSymbols(
  symbols: string[],
  exchange: "NSE" | "BSE"
): Promise<Stock[]> {
  return fetchMultipleStocks(symbols, exchange);
}

/**
 * Get market open status
 */
export function getMarketStatus(): {
  isOpen: boolean;
  timestamp: number;
} {
  return {
    isOpen: isMarketOpen(),
    timestamp: Date.now(),
  };
}
