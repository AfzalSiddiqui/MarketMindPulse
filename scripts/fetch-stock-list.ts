/**
 * One-time script to fetch all NSE/BSE stock symbols from indianapi.in
 * Run: npx tsx scripts/fetch-stock-list.ts
 */

import * as fs from "fs";
import * as path from "path";

interface RawStock {
  "bse-code": string;
  "nse-code": string;
  name: string;
  id: string;
}

interface StockEntry {
  symbol: string;
  name: string;
  nseCode: string | null;
  bseCode: string | null;
  sector: string;
}

async function main() {
  console.log("Fetching stock list from indianapi.in...");

  const res = await fetch(
    "https://analyst.indianapi.in/static/all_stocks.json"
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const raw: RawStock[] = await res.json();
  console.log(`Fetched ${raw.length} entries`);

  const nseStocks: StockEntry[] = [];
  const bseStocks: StockEntry[] = [];

  for (const item of raw) {
    const nc = item["nse-code"];
    const bc = item["bse-code"];
    const nseCode = nc && nc !== "null" && nc !== "" ? nc : null;
    const bseCode = bc && bc !== "null" && bc !== "" ? bc : null;
    const name = item.name || "";

    if (nseCode) {
      nseStocks.push({ symbol: nseCode, name, nseCode, bseCode, sector: "" });
    }
    if (bseCode) {
      bseStocks.push({ symbol: bseCode, name, nseCode, bseCode, sector: "" });
    }
  }

  nseStocks.sort((a, b) => a.symbol.localeCompare(b.symbol));
  bseStocks.sort((a, b) => a.name.localeCompare(b.name));

  const outPath = path.join(__dirname, "../src/lib/data/stock-list.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify({ nse: nseStocks, bse: bseStocks }, null, 2)
  );

  console.log(`Written to ${outPath}`);
  console.log(`NSE: ${nseStocks.length}, BSE: ${bseStocks.length}`);
}

main().catch(console.error);
