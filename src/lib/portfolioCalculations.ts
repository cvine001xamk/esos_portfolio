import type { PortfolioHolding, HoldingAllocation, PortfolioAllocationSummary } from "@/types/portfolio";
import type { StockQuote } from "@/types/marketData";
import type { DividendRecord, HoldingDividendEstimate } from "@/types/dividends";

/**
 * Computes portfolio allocation percentages from configured holdings and quotes.
 *
 * IMPORTANT: Individual holding market values and total portfolio value are computed
 * internally only to derive allocation percentages and are intentionally omitted from
 * the returned data structures.
 */
export function calculatePortfolioAllocation(
  holdings: PortfolioHolding[],
  quotes: Record<string, StockQuote>
): PortfolioAllocationSummary {
  let internalTotalValue = 0;
  let hasIncompleteData = false;
  let isCachedOrDelayed = false;

  const internalItems = holdings.map((holding) => {
    const quote = quotes[holding.symbol];
    const price = quote?.price ?? null;

    if (quote && (quote.classification === "cached" || quote.classification === "delayed" || quote.classification === "previous-close")) {
      isCachedOrDelayed = true;
    }

    const isValidPrice = price !== null && Number.isFinite(price) && price > 0 && holding.quantity >= 0;
    if (!isValidPrice) {
      hasIncompleteData = true;
      return {
        holding,
        quote,
        internalValue: null as number | null,
        hasMissingPrice: true,
      };
    }

    const internalValue = holding.quantity * price;
    internalTotalValue += internalValue;

    return {
      holding,
      quote,
      internalValue,
      hasMissingPrice: false,
    };
  });

  const allocations: HoldingAllocation[] = internalItems.map(({ holding, quote, internalValue, hasMissingPrice }) => {
    let allocationPercent: number | null = null;
    if (!hasMissingPrice && internalValue !== null && internalTotalValue > 0) {
      allocationPercent = (internalValue / internalTotalValue) * 100;
    }

    return {
      symbol: holding.symbol,
      name: holding.name,
      allocationPercent,
      dailyChangePercent: quote?.dailyChangePercent ?? null,
      hasMissingPrice,
    };
  });

  // Sort highest allocation to lowest; items without allocation appear at the bottom
  allocations.sort((a, b) => {
    if (a.allocationPercent === null && b.allocationPercent === null) return 0;
    if (a.allocationPercent === null) return 1;
    if (b.allocationPercent === null) return -1;
    return b.allocationPercent - a.allocationPercent;
  });

  return {
    holdings: allocations,
    hasIncompleteData,
    isCachedOrDelayed,
  };
}

/**
 * Computes estimated annual gross dividend income per holding and total
 * where reliable per-share annual estimates are available.
 */
export function calculateEstimatedAnnualDividends(
  holdings: PortfolioHolding[],
  records: DividendRecord[]
): {
  estimates: HoldingDividendEstimate[];
  totalGross: number | null;
  currency: string;
  hasReliableEstimate: boolean;
} {
  const estimates: HoldingDividendEstimate[] = [];
  const currencies = new Set<string>();

  for (const holding of holdings) {
    const matching = records.filter((r) => r.symbol === holding.symbol);
    const reliable = matching.find(
      (r) =>
        typeof r.estimatedAnnualPerShare === "number" &&
        Number.isFinite(r.estimatedAnnualPerShare) &&
        r.estimatedAnnualPerShare > 0
    );

    if (!reliable || typeof reliable.estimatedAnnualPerShare !== "number") {
      continue;
    }

    currencies.add(reliable.currency);
    const gross = holding.quantity * reliable.estimatedAnnualPerShare;
    const paymentDates = matching
      .map((r) => r.paymentDate)
      .filter((d): d is string => Boolean(d));

    estimates.push({
      symbol: holding.symbol,
      companyName: holding.name,
      estimatedAnnualGross: gross,
      currency: reliable.currency,
      expectedPaymentDates: Array.from(new Set(paymentDates)),
      basis: reliable.isConfirmed
        ? "Confirmed/announced dividend per share"
        : "Provider annual dividend estimate",
    });
  }

  // Only sum across holdings if all estimates share the same currency (e.g. EUR)
  const canSum = estimates.length > 0 && currencies.size === 1;
  const totalGross = canSum
    ? estimates.reduce((sum, item) => sum + item.estimatedAnnualGross, 0)
    : null;

  return {
    estimates,
    totalGross,
    currency: currencies.size === 1 ? Array.from(currencies)[0] : "EUR",
    hasReliableEstimate: estimates.length > 0,
  };
}
