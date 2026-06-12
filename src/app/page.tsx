"use client";

import { useState } from "react";
import IndicesBar from "@/components/dashboard/IndicesBar";
import NiftyChart from "@/components/dashboard/NiftyChart";
import TopGainers from "@/components/dashboard/TopGainers";
import TopLosers from "@/components/dashboard/TopLosers";
import SectorHeatmap from "@/components/dashboard/SectorHeatmap";
import TrendingStocks from "@/components/dashboard/TrendingStocks";
import NewsPanel from "@/components/dashboard/NewsPanel";
import StockTable from "@/components/dashboard/StockTable";
import StockDetailModal from "@/components/shared/StockDetailModal";
import { useIndices } from "@/lib/hooks/useIndices";
import { useTopMovers } from "@/lib/hooks/useTopMovers";
import { Stock } from "@/lib/types";
import { getStockChartData } from "@/lib/mockData";

export default function Home() {
  const { isMarketOpen, marketStatus, holidayName } = useIndices();
  const {
    gainers,
    losers,
    trending,
    isLoading: moversLoading,
  } = useTopMovers();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [activeChart, setActiveChart] = useState<"NIFTY" | "SENSEX">("NIFTY");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Holiday / Closed banner */}
      {marketStatus === "holiday" && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/60">
          <span className="text-xl">&#128197;</span>
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
              Market Closed Today — {holidayName}
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              NSE &amp; BSE are closed for the holiday. Trading resumes on the next working day.
            </p>
          </div>
        </div>
      )}
      {marketStatus === "closed" && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60">
          <span className="text-xl">&#128340;</span>
          <div>
            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
              Market Closed
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              NSE &amp; BSE trading hours: 9:15 AM – 3:30 PM IST, Mon–Fri.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Indian Market Overview
          </p>
        </div>
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
            isMarketOpen
              ? "bg-emerald-50 dark:bg-emerald-950"
              : "bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isMarketOpen
                ? "animate-pulse bg-emerald-500"
                : "bg-zinc-400"
            }`}
          />
          <span
            className={`text-sm font-bold ${
              isMarketOpen
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {isMarketOpen ? "Market Open" : "Market Closed"}
          </span>
        </div>
      </div>

      <IndicesBar />

      {/* Chart section with NIFTY/SENSEX toggle */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-2 flex gap-2">
            <button
              onClick={() => setActiveChart("NIFTY")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeChart === "NIFTY"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              NIFTY 50
            </button>
            <button
              onClick={() => setActiveChart("SENSEX")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeChart === "SENSEX"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              SENSEX
            </button>
          </div>
          {activeChart === "NIFTY" ? (
            <NiftyChart indexSymbol="NIFTY" indexName="NIFTY 50" />
          ) : (
            <NiftyChart indexSymbol="SENSEX" indexName="SENSEX" />
          )}
        </div>
        <div>
          <SectorHeatmap />
        </div>
      </div>

      {/* NSE & BSE Stock Tables side-by-side */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StockTable exchange="NSE" />
        <StockTable exchange="BSE" />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TopGainers
          gainers={gainers}
          isLoading={moversLoading}
          onStockClick={setSelectedStock}
        />
        <TopLosers
          losers={losers}
          isLoading={moversLoading}
          onStockClick={setSelectedStock}
        />
        <TrendingStocks
          trending={trending}
          isLoading={moversLoading}
          onStockClick={setSelectedStock}
        />
      </div>

      <div className="mt-6">
        <NewsPanel />
      </div>

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
