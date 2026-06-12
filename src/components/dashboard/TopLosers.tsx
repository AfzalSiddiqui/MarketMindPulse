"use client";

import { Stock } from "@/lib/types";

interface TopLosersProps {
  losers: Stock[];
  isLoading: boolean;
  onStockClick?: (stock: Stock) => void;
}

export default function TopLosers({
  losers,
  isLoading,
  onStockClick,
}: TopLosersProps) {
  if (isLoading && losers.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Top Losers
        </h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-1.5"
            >
              <div className="space-y-1.5">
                <div className="h-3.5 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-2.5 w-28 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
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
        Top Losers
      </h3>
      <div className="space-y-2">
        {losers.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onStockClick?.(stock)}
            className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {stock.symbol}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {stock.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {stock.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs font-medium text-red-500">
                {stock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
