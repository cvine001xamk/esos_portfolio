import type { PortfolioHolding } from "@/types/portfolio";

/**
 * Centralized portfolio configuration.
 * Illustrative Nasdaq Helsinki (OMXH) holdings — replace with actual holdings when provided.
 */
export const portfolio: PortfolioHolding[] = [
  {
    symbol: "NOKIA",
    name: "Nokia",
    quantity: 100,
    currency: "EUR",
  },
  {
    symbol: "NESTE",
    name: "Neste",
    quantity: 50,
    currency: "EUR",
  },
  {
    symbol: "KNEBV",
    name: "KONE",
    quantity: 20,
    currency: "EUR",
  },
  {
    symbol: "SAMPO",
    name: "Sampo",
    quantity: 35,
    currency: "EUR",
  },
  {
    symbol: "UPM",
    name: "UPM-Kymmene",
    quantity: 40,
    currency: "EUR",
  },
];
