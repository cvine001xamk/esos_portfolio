import { Card } from "@/components/ui/Card";
import type { DividendSummary, DividendStatus } from "@/types/dividends";
import { formatCurrencyAmount, formatDateShort, formatTimestamp } from "@/lib/formatters";

interface DividendOverviewProps {
  dividends: DividendSummary;
}

const STATUS_BADGE: Record<DividendStatus, { label: string; style: string }> = {
  proposed: {
    label: "Proposed",
    style: "border-amber-300 bg-amber-50 text-amber-900",
  },
  announced: {
    label: "Announced",
    style: "border-sky-300 bg-sky-50 text-sky-900",
  },
  approved: {
    label: "Approved",
    style: "border-emerald-300 bg-emerald-50 text-emerald-900",
  },
  paid: {
    label: "Paid",
    style: "border-slate-300 bg-slate-100 text-slate-800",
  },
};

export function DividendOverview({ dividends }: DividendOverviewProps) {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dividends</h2>
        <p className="mt-1 text-base text-slate-600">
          Latest dividend information and estimated annual gross dividend income
        </p>
      </div>

      {/* B. Estimated Annual Dividend Income */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              Estimated Annual Gross Dividend Income
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Estimate only, before taxes — not guaranteed future income.
            </p>
          </div>
          <p className="text-3xl font-bold tabular-nums text-slate-900">
            {dividends.hasReliableEstimate && dividends.totalEstimatedAnnualGross !== null
              ? formatCurrencyAmount(dividends.totalEstimatedAnnualGross, dividends.currency)
              : "Estimate unavailable"}
          </p>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          {dividends.basisDescription} Calculated {formatTimestamp(dividends.calculatedAt)}.
        </p>

        {dividends.annualEstimates.length > 0 && (
          <div className="mt-4 border-t border-slate-200 pt-3">
            <p className="mb-2 text-sm font-semibold text-slate-700">
              Included in this estimate:
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {dividends.annualEstimates.map((est) => (
                <li
                  key={est.symbol}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base"
                >
                  <span className="font-medium text-slate-900">{est.companyName}</span>
                  <span className="font-semibold tabular-nums text-slate-900">
                    {formatCurrencyAmount(est.estimatedAnnualGross, est.currency)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* A. Latest Dividend Information */}
      <div>
        <h3 className="mb-3 text-xl font-bold text-slate-900">
          Latest Dividend Events
        </h3>
        <ul className="divide-y divide-slate-200">
          {dividends.records.map((record) => {
            const badge = STATUS_BADGE[record.status];
            const dateLabel = record.paymentDate
              ? `Payment date: ${formatDateShort(record.paymentDate)}`
              : record.exDividendDate
                ? `Ex-dividend date: ${formatDateShort(record.exDividendDate)}`
                : record.announcementDate
                  ? `Announced: ${formatDateShort(record.announcementDate)}`
                  : "Date not yet confirmed";

            return (
              <li
                key={record.id}
                className="flex flex-col justify-between gap-3 py-4 first:pt-1 last:pb-1 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-lg font-semibold text-slate-900">
                      {record.companyName}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold ${badge.style}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{dateLabel}</p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold tabular-nums text-slate-900">
                    {formatCurrencyAmount(record.amountPerShare, record.currency)}
                    <span className="text-sm font-normal text-slate-600"> / share</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
