// Market configuration and constants

export const YAHOO_BASE_URL = "https://query1.finance.yahoo.com";

// Yahoo Finance symbol suffixes
export function getYahooSymbol(symbol: string, exchange: "NSE" | "BSE"): string {
  return exchange === "NSE" ? `${symbol}.NS` : `${symbol}.BO`;
}

// Yahoo Finance index tickers
export const INDEX_TICKERS: Record<string, string> = {
  "NIFTY 50": "^NSEI",
  SENSEX: "^BSESN",
  "BANK NIFTY": "^NSEBANK",
  "NIFTY IT": "^CNXIT",
};

// Market hours (IST = UTC+5:30)
const MARKET_OPEN_HOUR = 9;
const MARKET_OPEN_MINUTE = 15;
const MARKET_CLOSE_HOUR = 15;
const MARKET_CLOSE_MINUTE = 30;

// NSE/BSE holidays for 2026 — date → holiday name
const MARKET_HOLIDAYS_2026: Record<string, string> = {
  "2026-01-26": "Republic Day",
  "2026-02-17": "Mahashivratri",
  "2026-03-10": "Holi",
  "2026-03-30": "Id-ul-Fitr (Eid)",
  "2026-03-31": "Id-ul-Fitr (Eid)",
  "2026-04-02": "Mahavir Jayanti",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Dr. Ambedkar Jayanti",
  "2026-05-01": "Maharashtra Day",
  "2026-05-25": "Buddha Purnima",
  "2026-06-07": "Eid-ul-Adha (Bakrid)",
  "2026-07-06": "Muharram",
  "2026-08-15": "Independence Day",
  "2026-08-16": "Parsi New Year",
  "2026-09-04": "Milad-un-Nabi",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-20": "Dussehra",
  "2026-10-21": "Dussehra",
  "2026-11-09": "Diwali (Laxmi Puja)",
  "2026-11-10": "Diwali (Balipratipada)",
  "2026-11-19": "Guru Nanak Jayanti",
  "2026-12-25": "Christmas",
};

export type MarketStatus = "open" | "closed" | "holiday";

function getISTDate(): { istDay: number; istHour: number; istMinute: number; dateStr: string } {
  const now = new Date();
  const istOffset = 5.5 * 60;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = utcMinutes + istOffset;
  const istHour = Math.floor(istMinutes / 60) % 24;
  const istMinute = istMinutes % 60;

  const day = now.getUTCDay();
  const istDay = istMinutes >= 24 * 60 ? (day + 1) % 7 : day;

  // Build IST date string (YYYY-MM-DD)
  const istDate = new Date(now.getTime() + istOffset * 60 * 1000);
  const dateStr = istDate.toISOString().slice(0, 10);

  return { istDay, istHour, istMinute, dateStr };
}

export function getMarketStatus(): MarketStatus {
  const { istDay, istHour, istMinute, dateStr } = getISTDate();

  // Holiday check
  if (dateStr in MARKET_HOLIDAYS_2026) return "holiday";

  // Weekend check
  if (istDay === 0 || istDay === 6) return "closed";

  const currentMinutes = istHour * 60 + istMinute;
  const openMinutes = MARKET_OPEN_HOUR * 60 + MARKET_OPEN_MINUTE;
  const closeMinutes = MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MINUTE;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
    ? "open"
    : "closed";
}

export function getHolidayName(): string | null {
  const { dateStr } = getISTDate();
  return MARKET_HOLIDAYS_2026[dateStr] || null;
}

export function isMarketOpen(): boolean {
  return getMarketStatus() === "open";
}

// SSE intervals (ms)
export const SSE_INTERVAL_MARKET_OPEN = 5000;
export const SSE_INTERVAL_MARKET_CLOSED = 30000;

// Polling intervals for client hooks (ms)
export const INDICES_POLL_INTERVAL = 10000;
export const SECTORS_POLL_INTERVAL = 15000;
export const CHART_POLL_INTERVAL = 30000;

// API concurrency
export const YAHOO_CONCURRENCY_LIMIT = 5;
export const STOCKS_PER_PAGE = 15;

// Chart timeframe configs
export const CHART_CONFIGS = {
  "1D": { interval: "5m", range: "1d" },
  "1W": { interval: "15m", range: "5d" },
  "1M": { interval: "1d", range: "1mo" },
  "3M": { interval: "1d", range: "3mo" },
  "6M": { interval: "1wk", range: "6mo" },
  "1Y": { interval: "1wk", range: "1y" },
} as const;

export type ChartTimeframeKey = keyof typeof CHART_CONFIGS;
