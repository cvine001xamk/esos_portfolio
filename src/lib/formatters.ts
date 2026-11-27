/**
 * Formatting helpers designed for high readability, tabular numerals,
 * and non-color-dependent clarity (+ / − signs).
 */

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }
  return `${value.toFixed(decimals)}%`;
}

export function formatSignedPercent(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }
  if (value > 0) {
    return `+${value.toFixed(decimals)}%`;
  }
  if (value < 0) {
    // Use true minus sign (−) for clarity
    return `−${Math.abs(value).toFixed(decimals)}%`;
  }
  return `0.${"0".repeat(decimals)}%`;
}

export function formatCurrencyAmount(amount: number | null | undefined, currency = "EUR"): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatIndexLevel(level: number | null | undefined): string {
  if (level === null || level === undefined || !Number.isFinite(level)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(level);
}

export function formatDateShort(isoDate: string | undefined): string {
  if (!isoDate) return "—";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

export function formatTimestamp(isoString: string | undefined): string {
  if (!isoString) return "Unavailable";
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return isoString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}
