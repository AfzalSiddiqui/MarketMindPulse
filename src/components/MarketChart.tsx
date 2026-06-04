"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SAMPLE_DATA = [
  { date: "Mon", price: 142 },
  { date: "Tue", price: 146 },
  { date: "Wed", price: 139 },
  { date: "Thu", price: 148 },
  { date: "Fri", price: 155 },
];

export default function MarketChart() {
  return (
    <div className="w-full h-72 bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow">
      <h2 className="text-sm font-medium text-zinc-500 mb-2">
        Sample Stock Price
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={SAMPLE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={["dataMin - 5", "dataMax + 5"]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
