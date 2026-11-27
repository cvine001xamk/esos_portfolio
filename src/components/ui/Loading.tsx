interface LoadingProps {
  label?: string;
}

export function Loading({ label = "Loading portfolio overview…" }: LoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-10 text-center"
    >
      <div className="mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
      <p className="text-base font-medium text-slate-700">{label}</p>
    </div>
  );
}
