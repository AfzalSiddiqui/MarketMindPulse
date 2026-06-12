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
import { useIndexChart } from "@/lib/hooks/useChartData";
import { useIndices } from "@/lib/hooks/useIndices";
import { ChartTimeframe } from "@/lib/types";

const TIMEFRAMES: ChartTimeframe[] = ["1D", "1W", "1M", "3M", "6M", "1Y"];

interface NiftyChartProps {
  indexSymbol?: string;
  indexName?: string;
}

export default function NiftyChart({
  indexSymbol = "NIFTY",
  indexName = "NIFTY 50",
}: NiftyChartProps) {
  const { chartData, isLoading, timeframe, setTimeframe } =
    useIndexChart(indexSymbol);
  const { indices } = useIndices();

  const index = indices.find((i) => i.name === indexName);

  // Determine color from chart data (first vs last price) — works even when index.change is 0
  const chartUp =
    chartData.length >= 2
      ? chartData[chartData.length - 1].price >= chartData[0].price
      : true;
  const isPositive = index && index.change !== 0 ? index.change >= 0 : chartUp;
  const color = isPositive ? "#10b981" : "#ef4444";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {indexName}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {timeframe === "1D"
              ? "Intraday Performance"
              : `${timeframe} Performance`}
          </p>
        </div>
        <div className="text-right">
          {index ? (
            <>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {index.value.toLocaleString("en-IN")}
              </p>
              <p
                className={`text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}
              >
                {isPositive ? "+" : ""}
                {index.change.toFixed(2)} ({isPositive ? "+" : ""}
                {index.changePercent.toFixed(2)}%)
              </p>
            </>
          ) : (
            <>
              <div className="h-5 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-1 ml-auto h-3 w-20 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
            </>
          )}
        </div>
      </div>

      {/* Timeframe selector */}
      <div className="mb-3 flex gap-1">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              timeframe === tf
                ? "bg-emerald-600 text-white"
                : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      <div className="h-52">
        {isLoading && chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={`grad-${indexSymbol}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["dataMin - 30", "dataMax + 30"]}
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
                width={50}
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
                fill={`url(#grad-${indexSymbol})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
