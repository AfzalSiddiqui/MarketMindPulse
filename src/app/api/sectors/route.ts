import { getSectorData } from "@/lib/services/marketDataService";
import { isMarketOpen } from "@/lib/services/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sectors = await getSectorData();
    return Response.json({
      data: sectors,
      source: "mixed",
      timestamp: Date.now(),
      isMarketOpen: isMarketOpen(),
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch sector data" },
      { status: 500 }
    );
  }
}
