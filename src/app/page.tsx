import IndicesBar from "@/components/dashboard/IndicesBar";
import NiftyChart from "@/components/dashboard/NiftyChart";
import TopGainers from "@/components/dashboard/TopGainers";
import TopLosers from "@/components/dashboard/TopLosers";
import SectorHeatmap from "@/components/dashboard/SectorHeatmap";
import TrendingStocks from "@/components/dashboard/TrendingStocks";
import NewsPanel from "@/components/dashboard/NewsPanel";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Indian Market Overview
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5 dark:bg-emerald-950">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Market Open
          </span>
        </div>
      </div>

      <IndicesBar />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NiftyChart />
        </div>
        <div>
          <SectorHeatmap />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TopGainers />
        <TopLosers />
        <TrendingStocks />
      </div>

      <div className="mt-6">
        <NewsPanel />
      </div>
    </div>
  );
}
