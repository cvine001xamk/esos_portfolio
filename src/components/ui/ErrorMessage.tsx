import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({
  title = "Data currently unavailable",
  message,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-slate-900"
    >
      <AlertCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-700" aria-hidden="true" />
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-base text-slate-700">{message}</p>
      </div>
    </div>
  );
}
