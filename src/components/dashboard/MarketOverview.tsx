import { Card } from "@/components/ui/Card";
import type { MarketIndexOverview, MarketStatus, DataClassification } from "@/types/marketData";
import { formatIndexLevel, formatSignedPercent, formatTimestamp } from "@/lib/formatters";

interface MarketOverviewProps {
  index: MarketIndexOverview;
}

const STATUS_LABELS: Record<MarketStatus, string> = {
  open: "Market open",
  closed: "Market closed",
  unavailable: "Status unavailable",
};

const CLASSIFICATION_LABELS: Record<DataClassification, string> = {
  live: "Live",
  delayed: "Delayed",
  "previous-close": "Previous close",
  cached: "Cached",
  illustrative: "Illustrative",
};

export function MarketOverview({ index }: MarketOverviewProps) {
  const isPositive = (index.dailyChangePercent ?? 0) > 0;
  const isNegative = (index.dailyChangePercent ?? 0) < 0;

  const changeColor = isPositive
    ? "text-emerald-800 bg-emerald-50 border-emerald-200"
    : isNegative
      ? "text-rose-800 bg-rose-50 border-rose-200"
      : "text-slate-800 bg-slate-100 border-slate-200";

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Helsinki Market
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">{index.name}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {STATUS_LABELS[index.status]} · {CLASSIFICATION_LABELS[index.classification]} · Updated{" "}
            {formatTimestamp(index.lastUpdated)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {index.level !== null && (
            <span className="text-2xl font-bold tabular-nums text-slate-900">
              {formatIndexLevel(index.level)}
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-xl border px-3.5 py-1.5 text-lg font-semibold tabular-nums ${changeColor}`}
          >
            {formatSignedPercent(index.dailyChangePercent)}
          </span>
        </div>
      </div>

      {index.note && (
        <p className="mt-4 rounded-xl bg-slate-100 px-4 py-2.5 text-sm text-slate-700">
          {index.note}
        </p>
      )}
    </Card>
  );
}
