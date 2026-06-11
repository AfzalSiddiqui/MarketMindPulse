"use client";

import { newsItems } from "@/lib/mockData";

const categoryStyles = {
  bullish:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  bearish: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  neutral:
    "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function NewsPanel() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Market News
      </h3>
      <div className="space-y-3">
        {newsItems.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  categoryStyles[item.category]
                }`}
              >
                {item.category}
              </span>
              <span className="text-[10px] text-zinc-400">{item.time}</span>
            </div>
            <p className="text-sm leading-snug text-zinc-800 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-50">
              {item.title}
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-400">{item.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
