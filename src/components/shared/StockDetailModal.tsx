"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Stock, ChartDataPoint } from "@/lib/types";

interface StockDetailModalProps {
  stock: Stock;
  chartData: ChartDataPoint[];
  onClose: () => void;
}

export default function StockDetailModal({
  stock,
  chartData,
  onClose,
}: StockDetailModalProps) {
  const isPositive = stock.change >= 0;
  const color = isPositive ? "#10b981" : "#ef4444";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                {stock.symbol.slice(0, 2)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stock.symbol}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stock.name}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {stock.price.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </span>
          <span
            className={`text-lg font-semibold ${isPositive ? "text-emerald-600" : "text-red-500"}`}
          >
            {isPositive ? "+" : ""}
            {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
            {stock.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="mb-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e4e4e7"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                domain={["dataMin - 5", "dataMax + 5"]}
                tick={{ fontSize: 10, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#fafafa",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                strokeWidth={2}
                fill="url(#stockGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <p className="text-[10px] font-medium uppercase text-zinc-400">
              Day High
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {stock.dayHigh.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <p className="text-[10px] font-medium uppercase text-zinc-400">
              Day Low
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {stock.dayLow.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <p className="text-[10px] font-medium uppercase text-zinc-400">
              Volume
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {stock.volume}
            </p>
          </div>
          <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
            <p className="text-[10px] font-medium uppercase text-zinc-400">
              Market Cap
            </p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {stock.marketCap}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {stock.sector}
          </span>
        </div>
      </div>
    </div>
  );
}
