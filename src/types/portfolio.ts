export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  currency: "EUR";
}

export interface HoldingAllocation {
  symbol: string;
  name: string;
  /** Percentage of total portfolio (0–100). Null if price data is missing or stale. */
  allocationPercent: number | null;
  /** Daily percentage change (e.g. 1.25 for +1.25%). Null if unavailable. */
  dailyChangePercent: number | null;
  /** True when the holding could not be priced reliably. */
  hasMissingPrice: boolean;
}

export interface PortfolioAllocationSummary {
  holdings: HoldingAllocation[];
  hasIncompleteData: boolean;
  isCachedOrDelayed: boolean;
}
