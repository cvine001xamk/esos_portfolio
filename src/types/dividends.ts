import type { DataClassification } from "./marketData";

export type DividendStatus = "proposed" | "announced" | "approved" | "paid";

export interface DividendRecord {
  id: string;
  symbol: string;
  companyName: string;
  amountPerShare: number;
  currency: string;
  status: DividendStatus;
  announcementDate?: string;
  exDividendDate?: string;
  paymentDate?: string;
  source: string;
  lastUpdated: string;
  isConfirmed: boolean;
  /** Optional reliable annual dividend per share estimate, only when supported by source */
  estimatedAnnualPerShare?: number | null;
}

export interface HoldingDividendEstimate {
  symbol: string;
  companyName: string;
  estimatedAnnualGross: number;
  currency: string;
  expectedPaymentDates: string[];
  basis: string;
}

export interface DividendSummary {
  records: DividendRecord[];
  annualEstimates: HoldingDividendEstimate[];
  totalEstimatedAnnualGross: number | null;
  currency: string;
  calculatedAt: string;
  basisDescription: string;
  classification: DataClassification;
  hasReliableEstimate: boolean;
}
