"use client";

import { topLosers } from "@/lib/mockData";

export default function TopLosers() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Top Losers
      </h3>
      <div className="space-y-2">
        {topLosers.map((stock) => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
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
