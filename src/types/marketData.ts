export type DataClassification = "live" | "delayed" | "previous-close" | "cached" | "illustrative";

export type MarketStatus = "open" | "closed" | "unavailable";

export interface StockQuote {
  symbol: string;
  /** Internal latest valid share price in EUR. Never rendered in the UI. */
  price: number | null;
  dailyChangePercent: number | null;
  currency: string;
  timestamp: string;
  classification: DataClassification;
  error?: string;
}

export interface MarketIndexOverview {
  symbol: string;
  name: string;
  level: number | null;
  dailyChangePercent: number | null;
  status: MarketStatus;
  lastUpdated: string;
  classification: DataClassification;
  note?: string;
}

export interface MarketDataResult {
  index: MarketIndexOverview;
  quotes: Record<string, StockQuote>;
  fetchedAt: string;
  classification: DataClassification;
  error?: string;
}
