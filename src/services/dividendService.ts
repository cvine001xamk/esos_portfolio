import type { PortfolioHolding } from "@/types/portfolio";
import type { DividendRecord, DividendSummary } from "@/types/dividends";
import { calculateEstimatedAnnualDividends } from "@/lib/portfolioCalculations";

/**
 * Dedicated dividend data service, separate from market price retrieval.
 * Currently uses clearly labelled illustrative Nasdaq Helsinki dividend records
 * for UI scaffolding.
 */
const ILLUSTRATIVE_DIVIDENDS: DividendRecord[] = [
  {
    id: "kneb-2026-paid",
    symbol: "KNEBV",
    companyName: "KONE",
    amountPerShare: 1.75,
    currency: "EUR",
    status: "paid",
    announcementDate: "2026-01-29",
    exDividendDate: "2026-03-04",
    paymentDate: "2026-03-13",
    source: "Illustrative placeholder data",
    lastUpdated: "2026-11-27T10:00:00Z",
    isConfirmed: true,
    estimatedAnnualPerShare: 1.75,
  },
  {
    id: "sampo-2026-approved",
    symbol: "SAMPO",
    companyName: "Sampo",
    amountPerShare: 1.80,
    currency: "EUR",
    status: "approved",
    announcementDate: "2026-02-12",
    exDividendDate: "2026-04-24",
    paymentDate: "2026-05-05",
    source: "Illustrative placeholder data",
    lastUpdated: "2026-11-27T10:00:00Z",
    isConfirmed: true,
    estimatedAnnualPerShare: 1.80,
  },
  {
    id: "nokia-2026-announced",
    symbol: "NOKIA",
    companyName: "Nokia",
    amountPerShare: 0.04,
    currency: "EUR",
    status: "announced",
    announcementDate: "2026-10-22",
    exDividendDate: "2026-11-04",
    paymentDate: "2026-11-14",
    source: "Illustrative placeholder data",
    lastUpdated: "2026-11-27T10:00:00Z",
    isConfirmed: true,
    estimatedAnnualPerShare: 0.14,
  },
  {
    id: "upm-2026-paid",
    symbol: "UPM",
    companyName: "UPM-Kymmene",
    amountPerShare: 1.50,
    currency: "EUR",
    status: "paid",
    announcementDate: "2026-02-05",
    exDividendDate: "2026-04-10",
    paymentDate: "2026-04-20",
    source: "Illustrative placeholder data",
    lastUpdated: "2026-11-27T10:00:00Z",
    isConfirmed: true,
    estimatedAnnualPerShare: 1.50,
  },
  {
    id: "neste-2026-proposed",
    symbol: "NESTE",
    companyName: "Neste",
    amountPerShare: 0.60,
    currency: "EUR",
    status: "proposed",
    announcementDate: "2026-02-14",
    source: "Illustrative placeholder data",
    lastUpdated: "2026-11-27T10:00:00Z",
    isConfirmed: false,
    estimatedAnnualPerShare: null,
  },
];

export async function fetchPortfolioDividends(holdings: PortfolioHolding[]): Promise<DividendSummary> {
  const configuredSymbols = new Set(holdings.map((h) => h.symbol));
  const records = ILLUSTRATIVE_DIVIDENDS.filter((r) => configuredSymbols.has(r.symbol));

  const calculatedAt = new Date().toISOString();
  const { estimates, totalGross, currency, hasReliableEstimate } =
    calculateEstimatedAnnualDividends(holdings, records);

  return {
    records,
    annualEstimates: estimates,
    totalEstimatedAnnualGross: totalGross,
    currency,
    calculatedAt,
    basisDescription:
      "Based on configured share quantities and latest confirmed or provider-supported annual dividend rates (gross, before taxes). Illustrative placeholder data.",
    classification: "illustrative",
    hasReliableEstimate,
  };
}
