"use client";

import { useState, useEffect, useCallback } from "react";
import { ChartDataPoint, ChartTimeframe } from "../types";
import { niftyChartData as mockNiftyChart } from "../mockData";

interface UseChartDataResult {
  chartData: ChartDataPoint[];
  isLoading: boolean;
  timeframe: ChartTimeframe;
  setTimeframe: (tf: ChartTimeframe) => void;
}

export function useIndexChart(
  indexSymbol: string = "NIFTY"
): UseChartDataResult {
  const [chartData, setChartData] = useState<ChartDataPoint[]>(mockNiftyChart);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("1D");

  const fetchChart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/chart/${indexSymbol}?timeframe=${timeframe}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setChartData(json.data);
      }
    } catch {
      // Keep current data on error
    } finally {
      setIsLoading(false);
    }
  }, [indexSymbol, timeframe]);

  useEffect(() => {
    fetchChart();
    // Only auto-refresh for 1D
    if (timeframe === "1D") {
      const interval = setInterval(fetchChart, 30000);
      return () => clearInterval(interval);
    }
  }, [fetchChart, timeframe]);

  return { chartData, isLoading, timeframe, setTimeframe };
}

export function useStockChart(
  symbol: string | null,
  exchange: "NSE" | "BSE" = "NSE"
): UseChartDataResult {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>("1D");

  const fetchChart = useCallback(async () => {
    if (!symbol) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/chart/${symbol}?exchange=${exchange}&timeframe=${timeframe}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        setChartData(json.data);
      }
    } catch {
      // Keep current data on error
    } finally {
      setIsLoading(false);
    }
  }, [symbol, exchange, timeframe]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  return { chartData, isLoading, timeframe, setTimeframe };
}
