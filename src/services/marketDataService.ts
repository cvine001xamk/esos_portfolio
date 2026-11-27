import type { MarketDataResult, StockQuote } from "@/types/marketData";
import type { PortfolioHolding } from "@/types/portfolio";

export interface MarketDataProvider {
  name: string;
  fetchMarketData(holdings: PortfolioHolding[]): Promise<MarketDataResult>;
}

/**
 * Illustrative mock provider for UI scaffolding and validation.
 * Clearly marks all data as "illustrative" so it is never mistaken for live market data.
 * Replace or extend with Twelve Data / Marketstack / Nasdaq Nordic provider in Phase 2/3.
 */
const ILLUSTRATIVE_QUOTES: Record<string, { price: number; dailyChangePercent: number }> = {
  NOKIA: { price: 4.18, dailyChangePercent: 1.46 },
  NESTE: { price: 15.82, dailyChangePercent: -1.12 },
  KNEBV: { price: 48.6, dailyChangePercent: 0.62 },
  SAMPO: { price: 41.25, dailyChangePercent: 0.34 },
  UPM: { price: 28.9, dailyChangePercent: -0.45 },
};

class MockMarketDataProvider implements MarketDataProvider {
  name = "Illustrative Placeholder Data";

  async fetchMarketData(holdings: PortfolioHolding[]): Promise<MarketDataResult> {
    const now = new Date().toISOString();
    const quotes: Record<string, StockQuote> = {};

    for (const holding of holdings) {
      const sample = ILLUSTRATIVE_QUOTES[holding.symbol];
      quotes[holding.symbol] = {
        symbol: holding.symbol,
        price: sample ? sample.price : null,
        dailyChangePercent: sample ? sample.dailyChangePercent : null,
        currency: holding.currency,
        timestamp: now,
        classification: "illustrative",
        error: sample ? undefined : `No quote available for ${holding.symbol}`,
      };
    }

    return {
      index: {
        symbol: "OMXHPI",
        name: "OMX Helsinki All-Share Index (OMXHPI)",
        level: 10248.35,
        dailyChangePercent: 0.42,
        status: "closed",
        lastUpdated: now,
        classification: "illustrative",
        note: "Illustrative placeholder data for layout preview — connect a verified provider for real Nasdaq Helsinki quotes.",
      },
      quotes,
      fetchedAt: now,
      classification: "illustrative",
    };
  }
}

export function getMarketDataProvider(): MarketDataProvider {
  // Future: switch on process.env.MARKET_DATA_PROVIDER (e.g. "twelvedata", "marketstack")
  return new MockMarketDataProvider();
}

export async function fetchPortfolioMarketData(holdings: PortfolioHolding[]): Promise<MarketDataResult> {
  const provider = getMarketDataProvider();
  return provider.fetchMarketData(holdings);
}
