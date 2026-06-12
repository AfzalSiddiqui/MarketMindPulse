import { getStocksPage } from "@/lib/services/marketDataService";
import { isMarketOpen } from "@/lib/services/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exchange = (searchParams.get("exchange") || "NSE") as "NSE" | "BSE";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("pageSize") || "15", 10))
  );

  try {
    const result = await getStocksPage(exchange, page, pageSize);
    return Response.json({
      ...result,
      source: "mixed",
      timestamp: Date.now(),
      isMarketOpen: isMarketOpen(),
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}
