"use client";

import { useState, useMemo } from "react";
import { stocks, getStockChartData } from "@/lib/mockData";
import { Stock } from "@/lib/types";
import StockDetailModal from "@/components/shared/StockDetailModal";

type SortKey = "symbol" | "price" | "changePercent" | "volume" | "marketCap";
type SortDir = "asc" | "desc";

function parseVolume(v: string): number {
  const num = parseFloat(v);
  if (v.includes("M")) return num * 1_000_000;
  if (v.includes("K")) return num * 1_000;
  return num;
}

export default function MarketPage() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const sectors = useMemo(() => {
    const s = new Set(stocks.map((st) => st.sector));
    return ["All", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    let list = stocks;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      );
    }

    if (sectorFilter !== "All") {
      list = list.filter((s) => s.sector === sectorFilter);
    }

    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "symbol":
          cmp = a.symbol.localeCompare(b.symbol);
          break;
        case "price":
          cmp = a.price - b.price;
          break;
        case "changePercent":
          cmp = a.changePercent - b.changePercent;
          break;
        case "volume":
          cmp = parseVolume(a.volume) - parseVolume(b.volume);
          break;
        case "marketCap":
          cmp =
            parseFloat(a.marketCap) - parseFloat(b.marketCap);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, sectorFilter, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function SortIcon({ column }: { column: SortKey }) {
    if (sortKey !== column)
      return <span className="ml-1 text-zinc-300 dark:text-zinc-600">&#8597;</span>;
    return (
      <span className="ml-1 text-emerald-600">
        {sortDir === "asc" ? "&#9650;" : "&#9660;"}
      </span>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Market
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          All listed stocks — click any row for details
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
          <svg
            className="h-4 w-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-50"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSectorFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sectorFilter === s
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800">
              {[
                { key: "symbol" as SortKey, label: "Stock" },
                { key: "price" as SortKey, label: "Price (INR)" },
                { key: "changePercent" as SortKey, label: "Change" },
                { key: "volume" as SortKey, label: "Volume" },
                { key: "marketCap" as SortKey, label: "Mkt Cap" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {col.label}
                  <SortIcon column={col.key} />
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                Sector
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <tr
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  className="cursor-pointer border-b border-zinc-50 transition-colors hover:bg-zinc-50 dark:border-zinc-800/50 dark:hover:bg-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {stock.symbol}
                        </p>
                        <p className="text-xs text-zinc-400">{stock.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {stock.price.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isPositive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {stock.volume}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {stock.marketCap}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {stock.sector}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-zinc-400"
                >
                  No stocks found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Showing {filtered.length} of {stocks.length} stocks
      </p>

      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          chartData={getStockChartData(selectedStock.symbol)}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}
