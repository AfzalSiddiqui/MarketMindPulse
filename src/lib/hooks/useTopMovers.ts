"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Stock } from "../types";
import {
  topGainers as mockGainers,
  topLosers as mockLosers,
  trendingStocks as mockTrending,
} from "../mockData";

interface UseTopMoversResult {
  gainers: Stock[];
  losers: Stock[];
  trending: Stock[];
  isLoading: boolean;
}

export function useTopMovers(): UseTopMoversResult {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStocks = useCallback(async () => {
    try {
      // Fetch a single page of 50 stocks to derive top movers
      const res = await fetch("/api/stocks?exchange=NSE&page=1&pageSize=50");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setStocks(json.data);
      }
    } catch {
      // Keep mock data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    // Refresh every 30s — no SSE needed for these summary panels
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  const gainers = useMemo(() => {
    if (stocks.length === 0) return mockGainers;
    return [...stocks]
      .filter((s) => s.change > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
  }, [stocks]);

  const losers = useMemo(() => {
    if (stocks.length === 0) return mockLosers;
    return [...stocks]
      .filter((s) => s.change < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);
  }, [stocks]);

  const trending = useMemo(() => {
    if (stocks.length === 0) return mockTrending;
    return [...stocks]
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 5);
  }, [stocks]);

  return { gainers, losers, trending, isLoading };
}
