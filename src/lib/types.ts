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
