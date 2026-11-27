import { Card } from "@/components/ui/Card";
import type { HoldingAllocation } from "@/types/portfolio";
import { formatPercent, formatSignedPercent } from "@/lib/formatters";

interface HoldingsListProps {
  holdings: HoldingAllocation[];
}

/**
 * Simple, uncluttered list of holdings.
 * Displays ONLY: company name (with ticker as secondary text), allocation %, and today's % change.
 */
export function HoldingsList({ holdings }: HoldingsListProps) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Your Holdings</h2>
        <p className="mt-1 text-base text-slate-600">
          Share of your portfolio and today&apos;s movement
        </p>
      </div>

      <ul className="divide-y divide-slate-200">
        {holdings.map((holding) => {
          const isPositive = (holding.dailyChangePercent ?? 0) > 0;
          const isNegative = (holding.dailyChangePercent ?? 0) < 0;

          const badgeStyle = isPositive
            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
            : isNegative
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-slate-100 text-slate-800 border-slate-200";

          return (
            <li
              key={holding.symbol}
              className="flex flex-col justify-between gap-2 py-4 first:pt-1 last:pb-1 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-xl font-semibold text-slate-900">{holding.name}</p>
                <p className="text-sm font-medium text-slate-500">{holding.symbol}</p>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Allocation
                  </p>
                  <p className="text-xl font-bold tabular-nums text-slate-900">
                    {holding.hasMissingPrice ? "Unavailable" : formatPercent(holding.allocationPercent)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-slate-500">
                    Today
                  </p>
                  <span
                    className={`inline-block min-w-[5.5rem] rounded-lg border px-3 py-1 text-center text-base font-semibold tabular-nums ${badgeStyle}`}
                  >
                    {formatSignedPercent(holding.dailyChangePercent)}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
