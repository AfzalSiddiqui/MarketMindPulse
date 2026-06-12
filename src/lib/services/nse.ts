import { Index, SectorData } from "../types";
import cache, { CACHE_TTL } from "./cache";

const NSE_BASE = "https://www.nseindia.com";

let sessionCookies: string | null = null;
let sessionExpiry = 0;

async function getNseSession(): Promise<string> {
  if (sessionCookies && Date.now() < sessionExpiry) return sessionCookies;

  try {
    const res = await fetch(NSE_BASE, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
    });
    const cookies = res.headers.getSetCookie?.() || [];
    sessionCookies = cookies.map((c) => c.split(";")[0]).join("; ");
    sessionExpiry = Date.now() + 300_000; // 5 min
    return sessionCookies || "";
  } catch {
    return "";
  }
}

async function nseFetch(path: string): Promise<Response | null> {
  try {
    const cookies = await getNseSession();
    const res = await fetch(`${NSE_BASE}${path}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        Cookie: cookies,
        Referer: NSE_BASE,
      },
    });
    if (!res.ok) return null;
    return res;
  } catch {
    return null;
  }
}

interface NseIndexData {
  name: string;
  last: number;
  open: number;
  previousClose: number;
  change: number;
  pChange: number;
}

export async function fetchNseIndices(): Promise<Index[]> {
  const cacheKey = "nse:indices";
  const cached = cache.get<Index[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await nseFetch("/api/allIndices");
    if (!res) return [];

    const json = await res.json();
    const data: NseIndexData[] = json.data || [];

    const targetIndices = ["NIFTY 50", "NIFTY BANK", "NIFTY IT"];
    const nameMap: Record<string, string> = {
      "NIFTY 50": "NIFTY 50",
      "NIFTY BANK": "BANK NIFTY",
      "NIFTY IT": "NIFTY IT",
    };

    const indices: Index[] = [];
    for (const item of data) {
      if (targetIndices.includes(item.name)) {
        indices.push({
          name: nameMap[item.name] || item.name,
          value: item.last,
          change: Math.round(item.change * 100) / 100,
          changePercent: Math.round(item.pChange * 100) / 100,
        });
      }
    }

    if (indices.length > 0) {
      cache.set(cacheKey, indices, CACHE_TTL.INDICES);
    }
    return indices;
  } catch {
    return [];
  }
}

const NSE_SECTOR_INDICES = [
  "NIFTY IT",
  "NIFTY BANK",
  "NIFTY PHARMA",
  "NIFTY AUTO",
  "NIFTY FMCG",
  "NIFTY ENERGY",
  "NIFTY METAL",
  "NIFTY REALTY",
  "NIFTY INFRASTRUCTURE",
  "NIFTY MEDIA",
];

const SECTOR_NAME_MAP: Record<string, string> = {
  "NIFTY IT": "IT",
  "NIFTY BANK": "Banking",
  "NIFTY PHARMA": "Pharma",
  "NIFTY AUTO": "Auto",
  "NIFTY FMCG": "FMCG",
  "NIFTY ENERGY": "Energy",
  "NIFTY METAL": "Metal",
  "NIFTY REALTY": "Realty",
  "NIFTY INFRASTRUCTURE": "Infrastructure",
  "NIFTY MEDIA": "Telecom",
};

export async function fetchNseSectorData(): Promise<SectorData[]> {
  const cacheKey = "nse:sectors";
  const cached = cache.get<SectorData[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await nseFetch("/api/allIndices");
    if (!res) return [];

    const json = await res.json();
    const data: NseIndexData[] = json.data || [];

    const sectors: SectorData[] = [];
    for (const item of data) {
      if (NSE_SECTOR_INDICES.includes(item.name)) {
        sectors.push({
          name: SECTOR_NAME_MAP[item.name] || item.name,
          change: Math.round(item.pChange * 100) / 100,
        });
      }
    }

    if (sectors.length > 0) {
      cache.set(cacheKey, sectors, CACHE_TTL.SECTORS);
    }
    return sectors;
  } catch {
    return [];
  }
}
