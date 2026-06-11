"use client";

import { sectorData } from "@/lib/mockData";

export default function SectorHeatmap() {
  const maxAbsChange = Math.max(...sectorData.map((s) => Math.abs(s.change)));

  function getColor(change: number): string {
    const intensity = Math.abs(change) / maxAbsChange;
    if (change > 0) {
      const alpha = 0.15 + intensity * 0.45;
      return `rgba(16, 185, 129, ${alpha})`;
    }
    const alpha = 0.15 + intensity * 0.45;
    return `rgba(239, 68, 68, ${alpha})`;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Sector Performance
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {sectorData.map((sector) => (
          <div
            key={sector.name}
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ backgroundColor: getColor(sector.change) }}
          >
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-100">
              {sector.name}
            </span>
            <span
              className={`text-xs font-bold ${
                sector.change >= 0 ? "text-emerald-700" : "text-red-600"
              }`}
            >
              {sector.change >= 0 ? "+" : ""}
              {sector.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
