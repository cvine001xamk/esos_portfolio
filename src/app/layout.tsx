import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio Overview — Nasdaq Helsinki",
  description:
    "A calm, readable overview of portfolio allocation, daily movements, dividends, and the Helsinki stock market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
