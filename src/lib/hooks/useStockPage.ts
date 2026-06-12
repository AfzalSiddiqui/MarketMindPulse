"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Stock, PaginatedResponse } from "../types";
import { useSSE } from "./useSSE";

interface SSEUpdate {
  type: string;
  stocks: Stock[];
  timestamp: number;
  isMarketOpen: boolean;
}

interface UseStockPageResult {
  stocks: Stock[];
  totalPages: number;
  total: number;
  isLoading: boolean;
  error: string | null;
  isMarketOpen: boolean;
  isSSEConnected: boolean;
}

export function useStockPage(
  exchange: "NSE" | "BSE",
  page: number,
  pageSize: number = 15
): UseStockPageResult {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketOpen, setMarketOpen] = useState(false);
  const symbolsRef = useRef<string>("");

  // Fetch paginated stocks via REST
  const fetchStocks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/stocks?exchange=${exchange}&page=${page}&pageSize=${pageSize}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json: PaginatedResponse<Stock> & {
        isMarketOpen: boolean;
      } = await res.json();
      setStocks(json.data);
      setTotalPages(json.totalPages);
      setTotal(json.total);
      setMarketOpen(json.isMarketOpen);
      symbolsRef.current = json.data.map((s) => s.symbol).join(",");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [exchange, page, pageSize]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // SSE for live updates
  const sseUrl =
    symbolsRef.current && !isLoading
      ? `/api/sse/stocks?symbols=${symbolsRef.current}&exchange=${exchange}`
      : "";

  const { data: sseData, isConnected } = useSSE<SSEUpdate>(sseUrl, {
    enabled: !!sseUrl,
  });

  // Merge SSE updates into stocks
  useEffect(() => {
    if (!sseData || sseData.type !== "update" || !sseData.stocks) return;

    setStocks((prev) => {
      const updateMap = new Map(sseData.stocks.map((s) => [s.symbol, s]));
      return prev.map((stock) => {
        const update = updateMap.get(stock.symbol);
        if (update) {
          return {
            ...stock,
            price: update.price,
            change: update.change,
            changePercent: update.changePercent,
            volume: update.volume || stock.volume,
            dayHigh: update.dayHigh || stock.dayHigh,
            dayLow: update.dayLow || stock.dayLow,
          };
        }
        return stock;
      });
    });
    setMarketOpen(sseData.isMarketOpen);
  }, [sseData]);

  return {
    stocks,
    totalPages,
    total,
    isLoading,
    error,
    isMarketOpen: marketOpen,
    isSSEConnected: isConnected,
  };
}
