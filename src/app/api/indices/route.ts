import { getAllIndices } from "@/lib/services/marketDataService";
import { isMarketOpen, getMarketStatus } from "@/lib/services/config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const indices = await getAllIndices();
    return Response.json({
      data: indices,
      source: "mixed",
      timestamp: Date.now(),
      isMarketOpen: isMarketOpen(),
      marketStatus: getMarketStatus(),
    });
  } catch {
    return Response.json(
      { error: "Failed to fetch indices" },
      { status: 500 }
    );
  }
}
