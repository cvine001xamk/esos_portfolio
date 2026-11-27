import { Card } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { PortfolioAllocationSummary } from "@/types/portfolio";
import { formatPercent, formatSignedPercent } from "@/lib/formatters";

interface PortfolioAllocationProps {
  allocation: PortfolioAllocationSummary;
}

// Restrained, high-contrast, colorblind-friendly palette
const BAR_COLORS = [
  "bg-slate-800",
  "bg-sky-700",
  "bg-teal-700",
  "bg-amber-600",
  "bg-indigo-600",
  "bg-stone-500",
];

export function PortfolioAllocation({ allocation }: PortfolioAllocationProps) {
  const validHoldings = allocation.holdings.filter(
    (h) => h.allocationPercent !== null && h.allocationPercent > 0
  );

  return (
    <Card className="border-slate-300">
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Portfolio Allocation
        </h2>
        <span className="text-sm text-slate-600">
          Sorted from largest to smallest share
        </span>
      </div>

      {allocation.hasIncompleteData && (
        <div className="mb-5">
          <ErrorMessage
            title="Some price data is missing"
            message="Holdings without a valid current price are excluded from the allocation bar so percentages are not distorted."
          />
        </div>
      )}

      {allocation.isCachedOrDelayed && (
        <p className="mb-4 text-sm font-medium text-slate-700">
          Note: Allocation percentages are based on cached or delayed market data.
        </p>
      )}

      {/* Horizontal Allocation Bar */}
      {validHoldings.length > 0 && (
        <div
          className="mb-6 flex h-8 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
          role="img"
          aria-label="Horizontal bar showing portfolio allocation percentages across holdings"
        >
          {validHoldings.map((holding, idx) => {
            const pct = holding.allocationPercent ?? 0;
            const colorClass = BAR_COLORS[idx % BAR_COLORS.length];
            return (
              <div
                key={holding.symbol}
                className={`${colorClass} h-full border-r border-white/60 last:border-r-0`}
                style={{ width: `${pct}%` }}
                title={`${holding.name}: ${formatPercent(pct)}`}
              />
            );
          })}
        </div>
      )}

      {/* Clear Legend & Percentage Breakdown */}
      <ul className="divide-y divide-slate-200">
        {allocation.holdings.map((holding, idx) => {
          const colorClass = BAR_COLORS[idx % BAR_COLORS.length];
          const isPositive = (holding.dailyChangePercent ?? 0) > 0;
          const isNegative = (holding.dailyChangePercent ?? 0) < 0;

          return (
            <li
              key={holding.symbol}
              className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-4 w-4 flex-shrink-0 rounded-sm ${holding.hasMissingPrice ? "bg-slate-300" : colorClass}`}
                  aria-hidden="true"
                />
                <span className="text-lg font-semibold text-slate-900">
                  {holding.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-base font-medium tabular-nums ${
                    isPositive
                      ? "text-emerald-800"
                      : isNegative
                        ? "text-rose-800"
                        : "text-slate-600"
                  }`}
                >
                  {formatSignedPercent(holding.dailyChangePercent)}
                </span>
                <span className="min-w-[4.5rem] text-right text-xl font-bold tabular-nums text-slate-900">
                  {holding.hasMissingPrice ? "Unavailable" : formatPercent(holding.allocationPercent)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
