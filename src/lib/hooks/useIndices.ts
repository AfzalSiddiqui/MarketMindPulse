"use client";

import { useState, useEffect, useCallback } from "react";
import { Index } from "../types";
import { indices as mockIndices } from "../mockData";

export type MarketStatus = "open" | "closed" | "holiday";

interface UseIndicesResult {
  indices: Index[];
  isLoading: boolean;
  isMarketOpen: boolean;
  marketStatus: MarketStatus;
}

export function useIndices(): UseIndicesResult {
  const [indices, setIndices] = useState<Index[]>(mockIndices);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [marketStatus, setMarketStatus] = useState<MarketStatus>("closed");

  const fetchIndices = useCallback(async () => {
    try {
      const res = await fetch("/api/indices");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setIndices(json.data);
      }
      setIsMarketOpen(json.isMarketOpen || false);
      setMarketStatus(json.marketStatus || (json.isMarketOpen ? "open" : "closed"));
    } catch {
      // Keep current data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndices();
    const interval = setInterval(fetchIndices, 10000);
    return () => clearInterval(interval);
  }, [fetchIndices]);

  return { indices, isLoading, isMarketOpen, marketStatus };
}
