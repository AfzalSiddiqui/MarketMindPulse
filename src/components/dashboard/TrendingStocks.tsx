"use client";

import { Stock } from "@/lib/types";

interface TrendingStocksProps {
  trending: Stock[];
  isLoading: boolean;
  onStockClick?: (stock: Stock) => void;
}

export default function TrendingStocks({
  trending,
  isLoading,
  onStockClick,
}: TrendingStocksProps) {
  if (isLoading && trending.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Trending Stocks
        </h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <div className="h-8 w-8 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-2.5 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
              <div className="space-y-1.5 text-right">
                <div className="ml-auto h-3.5 w-14 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="ml-auto h-2.5 w-10 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Trending Stocks
      </h3>
      <div className="space-y-2">
        {trending.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onStockClick?.(stock)}
            className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                {stock.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {stock.symbol}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Vol: {stock.volume}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {stock.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p
                className={`text-xs font-medium ${
                  stock.change >= 0 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {stock.change >= 0 ? "+" : ""}
                {stock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
