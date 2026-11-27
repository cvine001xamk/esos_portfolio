import assert from "node:assert/strict";
import test from "node:test";
import {
  calculatePortfolioAllocation,
  calculateEstimatedAnnualDividends,
} from "../portfolioCalculations.ts";
import type { PortfolioHolding } from "../../types/portfolio.ts";
import type { StockQuote } from "../../types/marketData.ts";
import type { DividendRecord } from "../../types/dividends.ts";

const sampleHoldings: PortfolioHolding[] = [
  { symbol: "NOKIA", name: "Nokia", quantity: 100, currency: "EUR" },
  { symbol: "NESTE", name: "Neste", quantity: 50, currency: "EUR" },
  { symbol: "KNEBV", name: "KONE", quantity: 20, currency: "EUR" },
];

test("calculatePortfolioAllocation computes percentages summing to ~100% and sorts descending", () => {
  const quotes: Record<string, StockQuote> = {
    NOKIA: { symbol: "NOKIA", price: 4.0, dailyChangePercent: 1.5, currency: "EUR", timestamp: "2026-11-27T10:00:00Z", classification: "illustrative" }, // 400
    NESTE: { symbol: "NESTE", price: 20.0, dailyChangePercent: -0.8, currency: "EUR", timestamp: "2026-11-27T10:00:00Z", classification: "illustrative" }, // 1000
    KNEBV: { symbol: "KNEBV", price: 30.0, dailyChangePercent: 0.4, currency: "EUR", timestamp: "2026-11-27T10:00:00Z", classification: "illustrative" }, // 600
  };
  // Total = 2000 -> NESTE 50%, KNEBV 30%, NOKIA 20%
  const result = calculatePortfolioAllocation(sampleHoldings, quotes);

  assert.equal(result.hasIncompleteData, false);
  assert.equal(result.holdings[0].symbol, "NESTE");
  assert.equal(result.holdings[0].allocationPercent, 50);
  assert.equal(result.holdings[1].symbol, "KNEBV");
  assert.equal(result.holdings[1].allocationPercent, 30);
  assert.equal(result.holdings[2].symbol, "NOKIA");
  assert.equal(result.holdings[2].allocationPercent, 20);

  const sum = result.holdings.reduce((acc, h) => acc + (h.allocationPercent ?? 0), 0);
  assert.ok(Math.abs(sum - 100) < 0.001);

  // Ensure internal euro values are NOT exposed on returned holding objects
  assert.equal("marketValue" in result.holdings[0], false);
  assert.equal("totalValue" in result, false);
});

test("calculatePortfolioAllocation does not treat missing prices as zero", () => {
  const quotes: Record<string, StockQuote> = {
    NOKIA: { symbol: "NOKIA", price: 4.0, dailyChangePercent: 1.0, currency: "EUR", timestamp: "2026-11-27T10:00:00Z", classification: "illustrative" },
    NESTE: { symbol: "NESTE", price: null, dailyChangePercent: null, currency: "EUR", timestamp: "2026-11-27T10:00:00Z", classification: "illustrative", error: "Unavailable" },
    KNEBV: { symbol: "KNEBV", price: 30.0, dailyChangePercent: 0.2, currency: "EUR", timestamp: "2026-11-27T10:00:00Z", classification: "illustrative" },
  };

  const result = calculatePortfolioAllocation(sampleHoldings, quotes);
  assert.equal(result.hasIncompleteData, true);

  const neste = result.holdings.find((h) => h.symbol === "NESTE");
  assert.ok(neste);
  assert.equal(neste.hasMissingPrice, true);
  assert.equal(neste.allocationPercent, null);
});

test("calculateEstimatedAnnualDividends computes gross estimates using share quantities and currency", () => {
  const records: DividendRecord[] = [
    {
      id: "nokia-2026",
      symbol: "NOKIA",
      companyName: "Nokia",
      amountPerShare: 0.14,
      currency: "EUR",
      status: "approved",
      paymentDate: "2026-05-07",
      source: "Illustrative data",
      lastUpdated: "2026-11-27T10:00:00Z",
      isConfirmed: true,
      estimatedAnnualPerShare: 0.14,
    },
    {
      id: "neste-2026",
      symbol: "NESTE",
      companyName: "Neste",
      amountPerShare: 0.60,
      currency: "EUR",
      status: "proposed",
      source: "Illustrative data",
      lastUpdated: "2026-11-27T10:00:00Z",
      isConfirmed: false,
      estimatedAnnualPerShare: null, // No reliable annual estimate
    },
  ];

  const result = calculateEstimatedAnnualDividends(sampleHoldings, records);
  assert.equal(result.hasReliableEstimate, true);
  assert.equal(result.estimates.length, 1);
  assert.equal(result.estimates[0].symbol, "NOKIA");
  assert.ok(Math.abs(result.estimates[0].estimatedAnnualGross - 14.0) < 0.001);
  assert.ok(result.totalGross !== null && Math.abs(result.totalGross - 14.0) < 0.001);
});
