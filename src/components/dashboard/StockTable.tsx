"use client";

import { useState, useRef, useEffect } from "react";
import { useStockPage } from "@/lib/hooks/useStockPage";
import { Stock } from "@/lib/types";
import StockDetailModal from "@/components/shared/StockDetailModal";
import { getStockChartData } from "@/lib/mockData";

interface StockTableProps {
  exchange: "NSE" | "BSE";
}

export default function StockTable({ exchange }: StockTableProps) {
  const [page, setPage] = useState(1);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const { stocks, totalPages, total, isLoading, isSSEConnected } =
    useStockPage(exchange, page);

  // Track previous prices for flash animation
  const prevPricesRef = useRef<Map<string, number>>(new Map());
  const [flashMap, setFlashMap] = useState<Map<string, "up" | "down">>(
    new Map()
  );

  useEffect(() => {
    const newFlash = new Map<string, "up" | "down">();
    for (const stock of stocks) {
      const prev = prevPricesRef.current.get(stock.symbol);
      if (prev !== undefined && prev !== stock.price) {
        newFlash.set(stock.symbol, stock.price > prev ? "up" : "down");
      }
    }
    if (newFlash.size > 0) {
      setFlashMap(newFlash);
      const timeout = setTimeout(() => setFlashMap(new Map()), 1000);
      // Update prev prices
      for (const stock of stocks) {
        prevPricesRef.current.set(stock.symbol, stock.price);
      }
      return () => clearTimeout(timeout);
    }
    // Update prev prices
    for (const stock of stocks) {
      prevPricesRef.current.set(stock.symbol, stock.price);
    }
  }, [stocks]);

  // Skeleton rows
  if (isLoading && stocks.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {exchange} Stocks
          </h3>
        </div>
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-2.5 w-32 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
              <div className="space-y-1.5 text-right">
                <div className="ml-auto h-3.5 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="ml-auto h-2.5 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const pageNumbers: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {exchange} Stocks
            </h3>
            <span className="text-[10px] text-zinc-400">
              {total.toLocaleString()} listed
            </span>
          </div>
          {isSSEConnected && (
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                Live
              </span>
            </div>
          )}
        </div>

        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
          {stocks.map((stock) => {
            const isPositive = stock.change >= 0;
            const flash = flashMap.get(stock.symbol);
            return (
              <div
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
                  flash === "up"
                    ? "bg-emerald-50/50 dark:bg-emerald-950/30"
                    : flash === "down"
                      ? "bg-red-50/50 dark:bg-red-950/30"
                      : ""
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  {stock.symbol.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {stock.symbol}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {stock.name}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      flash === "up"
                        ? "text-emerald-600"
                        : flash === "down"
                          ? "text-red-500"
                          : "text-zinc-900 dark:text-zinc-50"
                    }`}
                  >
                    {stock.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p
                    className={`text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Prev
            </button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-7 w-7 rounded-lg text-xs font-medium transition-colors ${
                    p === page
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          chartData={getStockChartData(selectedStock.symbol)}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </>
  );
}
