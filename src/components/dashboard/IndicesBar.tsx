"use client";

import { useIndices } from "@/lib/hooks/useIndices";

export default function IndicesBar() {
  const { indices, isLoading } = useIndices();

  if (isLoading && indices.length === 0) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex min-w-[180px] flex-1 items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-5 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="space-y-2 text-right">
              <div className="ml-auto h-3.5 w-14 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="ml-auto h-3 w-10 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {indices.map((index) => (
        <div
          key={index.name}
          className="flex min-w-[180px] flex-1 items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {index.name}
            </p>
            <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {index.value.toLocaleString("en-IN")}
            </p>
          </div>
          <div
            className={`text-right ${
              index.change >= 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <p className="text-sm font-semibold">
              {index.change >= 0 ? "+" : ""}
              {index.change.toFixed(2)}
            </p>
            <p className="text-xs font-medium">
              {index.changePercent >= 0 ? "+" : ""}
              {index.changePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
