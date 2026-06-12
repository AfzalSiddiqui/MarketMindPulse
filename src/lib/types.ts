export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
  dayHigh: number;
  dayLow: number;
  exchange: "NSE" | "BSE";
}

export interface StockListEntry {
  symbol: string;
  name: string;
  nseCode: string | null;
  bseCode: string | null;
  sector: string;
  exchange: "NSE" | "BSE";
}

export interface Index {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: "bullish" | "bearish" | "neutral";
}

export interface SectorData {
  name: string;
  change: number;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

export interface ChartDataPoint {
  date: string;
  price: number;
}

export type ChartTimeframe = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y";

export interface ApiResponse<T> {
  data: T;
  source: "yahoo" | "nse" | "alphavantage" | "mock";
  timestamp: number;
  isMarketOpen: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface SSEStockUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  dayHigh: number;
  dayLow: number;
  timestamp: number;
}
