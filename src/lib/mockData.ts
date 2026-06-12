import { Stock, Index, NewsItem, SectorData, ChartDataPoint } from "./types";

export const indices: Index[] = [
  { name: "NIFTY 50", value: 24856.15, change: 187.45, changePercent: 0.76 },
  { name: "SENSEX", value: 81648.2, change: 602.75, changePercent: 0.74 },
  {
    name: "BANK NIFTY",
    value: 53412.8,
    change: -124.35,
    changePercent: -0.23,
  },
  {
    name: "NIFTY IT",
    value: 41230.55,
    change: 456.2,
    changePercent: 1.12,
  },
];

export const stocks: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 2945.6,
    change: 32.15,
    changePercent: 1.1,
    volume: "12.4M",
    marketCap: "19.9L Cr",
    sector: "Energy",
    dayHigh: 2968.0,
    dayLow: 2910.25,
    exchange: "NSE",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 4128.35,
    change: 54.8,
    changePercent: 1.35,
    volume: "3.2M",
    marketCap: "14.9L Cr",
    sector: "IT",
    dayHigh: 4152.0,
    dayLow: 4070.0,
    exchange: "NSE",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    price: 1742.9,
    change: -18.45,
    changePercent: -1.05,
    volume: "8.7M",
    marketCap: "13.2L Cr",
    sector: "Banking",
    dayHigh: 1768.0,
    dayLow: 1735.5,
    exchange: "NSE",
  },
  {
    symbol: "INFY",
    name: "Infosys",
    price: 1876.25,
    change: 28.4,
    changePercent: 1.54,
    volume: "5.1M",
    marketCap: "7.8L Cr",
    sector: "IT",
    dayHigh: 1892.0,
    dayLow: 1845.0,
    exchange: "NSE",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    price: 1285.7,
    change: 12.35,
    changePercent: 0.97,
    volume: "6.8M",
    marketCap: "8.9L Cr",
    sector: "Banking",
    dayHigh: 1298.0,
    dayLow: 1270.0,
    exchange: "NSE",
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever",
    price: 2534.15,
    change: -42.3,
    changePercent: -1.64,
    volume: "2.1M",
    marketCap: "5.9L Cr",
    sector: "FMCG",
    dayHigh: 2580.0,
    dayLow: 2520.0,
    exchange: "NSE",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    price: 1645.8,
    change: 23.9,
    changePercent: 1.47,
    volume: "4.5M",
    marketCap: "9.8L Cr",
    sector: "Telecom",
    dayHigh: 1660.0,
    dayLow: 1618.0,
    exchange: "NSE",
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 832.45,
    change: -8.6,
    changePercent: -1.02,
    volume: "15.2M",
    marketCap: "7.4L Cr",
    sector: "Banking",
    dayHigh: 845.0,
    dayLow: 828.0,
    exchange: "NSE",
  },
  {
    symbol: "ITC",
    name: "ITC Limited",
    price: 468.3,
    change: 5.75,
    changePercent: 1.24,
    volume: "9.8M",
    marketCap: "5.8L Cr",
    sector: "FMCG",
    dayHigh: 472.0,
    dayLow: 461.0,
    exchange: "NSE",
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank",
    price: 1823.55,
    change: -26.8,
    changePercent: -1.45,
    volume: "3.4M",
    marketCap: "3.6L Cr",
    sector: "Banking",
    dayHigh: 1856.0,
    dayLow: 1815.0,
    exchange: "NSE",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    price: 3562.4,
    change: 45.6,
    changePercent: 1.3,
    volume: "2.8M",
    marketCap: "4.9L Cr",
    sector: "Infrastructure",
    dayHigh: 3590.0,
    dayLow: 3510.0,
    exchange: "NSE",
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    price: 945.2,
    change: -15.35,
    changePercent: -1.6,
    volume: "11.5M",
    marketCap: "3.5L Cr",
    sector: "Auto",
    dayHigh: 965.0,
    dayLow: 938.0,
    exchange: "NSE",
  },
  {
    symbol: "AXISBANK",
    name: "Axis Bank",
    price: 1178.65,
    change: 14.2,
    changePercent: 1.22,
    volume: "7.2M",
    marketCap: "3.6L Cr",
    sector: "Banking",
    dayHigh: 1192.0,
    dayLow: 1160.0,
    exchange: "NSE",
  },
  {
    symbol: "WIPRO",
    name: "Wipro",
    price: 562.8,
    change: 8.45,
    changePercent: 1.52,
    volume: "6.1M",
    marketCap: "2.9L Cr",
    sector: "IT",
    dayHigh: 570.0,
    dayLow: 552.0,
    exchange: "NSE",
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki",
    price: 12450.3,
    change: 185.6,
    changePercent: 1.51,
    volume: "1.2M",
    marketCap: "3.9L Cr",
    sector: "Auto",
    dayHigh: 12520.0,
    dayLow: 12250.0,
    exchange: "NSE",
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharmaceutical",
    price: 1724.9,
    change: -22.15,
    changePercent: -1.27,
    volume: "3.6M",
    marketCap: "4.1L Cr",
    sector: "Pharma",
    dayHigh: 1752.0,
    dayLow: 1718.0,
    exchange: "NSE",
  },
];

export const topGainers: Stock[] = stocks
  .filter((s) => s.change > 0)
  .sort((a, b) => b.changePercent - a.changePercent)
  .slice(0, 5);

export const topLosers: Stock[] = stocks
  .filter((s) => s.change < 0)
  .sort((a, b) => a.changePercent - b.changePercent)
  .slice(0, 5);

export const sectorData: SectorData[] = [
  { name: "IT", change: 1.45 },
  { name: "Banking", change: -0.58 },
  { name: "Pharma", change: -1.27 },
  { name: "Auto", change: 0.82 },
  { name: "FMCG", change: -0.35 },
  { name: "Energy", change: 1.1 },
  { name: "Telecom", change: 1.47 },
  { name: "Infrastructure", change: 1.3 },
  { name: "Metal", change: 0.65 },
  { name: "Realty", change: -0.92 },
];

export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Nifty 50 crosses 24,800 mark driven by IT sector rally",
    source: "Economic Times",
    time: "10 min ago",
    category: "bullish",
  },
  {
    id: "2",
    title: "RBI keeps repo rate unchanged at 6.5% in latest MPC meet",
    source: "MoneyControl",
    time: "25 min ago",
    category: "neutral",
  },
  {
    id: "3",
    title: "HDFC Bank Q3 results miss street estimates, shares decline",
    source: "LiveMint",
    time: "1 hr ago",
    category: "bearish",
  },
  {
    id: "4",
    title: "Reliance Jio announces 5G expansion to 200 more cities",
    source: "NDTV Profit",
    time: "2 hr ago",
    category: "bullish",
  },
  {
    id: "5",
    title: "FII outflows continue for 5th consecutive session",
    source: "Economic Times",
    time: "3 hr ago",
    category: "bearish",
  },
  {
    id: "6",
    title: "TCS wins $2 billion deal from major European bank",
    source: "Business Standard",
    time: "4 hr ago",
    category: "bullish",
  },
  {
    id: "7",
    title: "Auto sector shows resilience with strong monthly sales data",
    source: "MoneyControl",
    time: "5 hr ago",
    category: "bullish",
  },
  {
    id: "8",
    title: "Crude oil prices drop below $72, positive for Indian markets",
    source: "Reuters",
    time: "6 hr ago",
    category: "bullish",
  },
];

export const trendingStocks: Stock[] = [
  stocks[0], // RELIANCE
  stocks[1], // TCS
  stocks[3], // INFY
  stocks[6], // BHARTIARTL
  stocks[14], // MARUTI
];

export function getStockChartData(symbol: string): ChartDataPoint[] {
  const stock = stocks.find((s) => s.symbol === symbol);
  if (!stock) return [];
  const base = stock.price - stock.change;
  const times = [
    "9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30",
    "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15",
    "14:30", "14:45", "15:00", "15:15",
  ];
  let seed = symbol.charCodeAt(0) + symbol.charCodeAt(1);
  return times.map((date, i) => {
    seed = (seed * 9301 + 49297) % 233280;
    const rand = seed / 233280;
    const progress = i / (times.length - 1);
    const noise = (rand - 0.5) * stock.price * 0.008;
    const price = base + stock.change * progress + noise;
    return { date, price: Math.round(price * 100) / 100 };
  });
}

export const niftyChartData: ChartDataPoint[] = [
  { date: "9:15", price: 24668 },
  { date: "9:45", price: 24712 },
  { date: "10:15", price: 24695 },
  { date: "10:45", price: 24748 },
  { date: "11:15", price: 24780 },
  { date: "11:45", price: 24756 },
  { date: "12:15", price: 24798 },
  { date: "12:45", price: 24810 },
  { date: "13:15", price: 24785 },
  { date: "13:45", price: 24822 },
  { date: "14:15", price: 24838 },
  { date: "14:45", price: 24812 },
  { date: "15:15", price: 24856 },
];
