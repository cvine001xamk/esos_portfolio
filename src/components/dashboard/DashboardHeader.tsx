import { Clock } from "lucide-react";
import type { DataClassification } from "@/types/marketData";
import { formatTimestamp } from "@/lib/formatters";

interface DashboardHeaderProps {
  lastUpdated: string;
  classification: DataClassification;
}

const CLASSIFICATION_LABELS: Record<DataClassification, string> = {
  live: "Live data",
  delayed: "Delayed market data",
  "previous-close": "Previous close",
  cached: "Cached data",
  illustrative: "Illustrative placeholder data",
};

export function DashboardHeader({ lastUpdated, classification }: DashboardHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Portfolio Overview
        </h1>
        <p className="mt-1 text-base text-slate-600">
          Nasdaq Helsinki holdings, allocation, and dividends
        </p>
      </div>

      <div className="flex flex-col items-start gap-1.5 sm:items-end">
        <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-800">
          {CLASSIFICATION_LABELS[classification]}
        </span>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />
          <span>Updated {formatTimestamp(lastUpdated)}</span>
        </div>
      </div>
    </header>
  );
}
