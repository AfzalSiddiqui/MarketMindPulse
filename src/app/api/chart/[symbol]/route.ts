import {
  getStockChartData,
  getIndexChartData,
} from "@/lib/services/marketDataService";
import { ChartTimeframeKey } from "@/lib/services/config";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const exchange = (searchParams.get("exchange") || "NSE") as "NSE" | "BSE";
  const timeframe = (searchParams.get("timeframe") || "1D") as ChartTimeframeKey;

  try {
    let data;
    // Index charts
    if (symbol === "NIFTY" || symbol === "NIFTY50") {
      data = await getIndexChartData("NIFTY 50", timeframe);
    } else if (symbol === "SENSEX") {
      data = await getIndexChartData("SENSEX", timeframe);
    } else if (symbol === "BANKNIFTY") {
      data = await getIndexChartData("BANK NIFTY", timeframe);
    } else if (symbol === "NIFTYIT") {
      data = await getIndexChartData("NIFTY IT", timeframe);
    } else {
      data = await getStockChartData(symbol, exchange, timeframe);
    }

    return Response.json({
      data,
      symbol,
      timeframe,
      timestamp: Date.now(),
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
