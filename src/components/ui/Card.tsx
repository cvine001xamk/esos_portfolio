import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 ${className}`}
    >
      {children}
    </section>
  );
}
