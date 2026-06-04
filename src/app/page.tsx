import MarketChart from "@/components/MarketChart";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        MarketMind Pulse
      </h1>
      <MarketChart />
    </main>
  );
}
