import { getQuotesForSymbols } from "@/lib/services/marketDataService";
import {
  isMarketOpen,
  SSE_INTERVAL_MARKET_OPEN,
  SSE_INTERVAL_MARKET_CLOSED,
} from "@/lib/services/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get("symbols") || "";
  const exchange = (searchParams.get("exchange") || "NSE") as "NSE" | "BSE";
  const symbols = symbolsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30); // Max 30 symbols

  if (symbols.length === 0) {
    return Response.json({ error: "No symbols provided" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial data immediately
      try {
        const stocks = await getQuotesForSymbols(symbols, exchange);
        const event = `data: ${JSON.stringify({ type: "update", stocks, timestamp: Date.now(), isMarketOpen: isMarketOpen() })}\n\n`;
        controller.enqueue(encoder.encode(event));
      } catch {
        // Initial fetch failed, send empty
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "update", stocks: [], timestamp: Date.now(), isMarketOpen: isMarketOpen() })}\n\n`
          )
        );
      }

      // Set up periodic updates
      const pollInterval = isMarketOpen()
        ? SSE_INTERVAL_MARKET_OPEN
        : SSE_INTERVAL_MARKET_CLOSED;

      intervalId = setInterval(async () => {
        try {
          const stocks = await getQuotesForSymbols(symbols, exchange);
          const event = `data: ${JSON.stringify({ type: "update", stocks, timestamp: Date.now(), isMarketOpen: isMarketOpen() })}\n\n`;
          controller.enqueue(encoder.encode(event));
        } catch {
          // Send heartbeat on error
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`
            )
          );
        }
      }, pollInterval);
    },
    cancel() {
      if (intervalId) clearInterval(intervalId);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
