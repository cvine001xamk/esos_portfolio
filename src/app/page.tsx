import { portfolio } from "@/config/portfolio";
import { fetchPortfolioMarketData } from "@/services/marketDataService";
import { fetchPortfolioDividends } from "@/services/dividendService";
import { calculatePortfolioAllocation } from "@/lib/portfolioCalculations";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PortfolioAllocation } from "@/components/dashboard/PortfolioAllocation";
import { HoldingsList } from "@/components/dashboard/HoldingsList";
import { DividendOverview } from "@/components/dashboard/DividendOverview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [marketData, dividends] = await Promise.all([
    fetchPortfolioMarketData(portfolio),
    fetchPortfolioDividends(portfolio),
  ]);

  const allocation = calculatePortfolioAllocation(portfolio, marketData.quotes);

  return (
    <main className="space-y-6">
      <DashboardHeader
        lastUpdated={marketData.fetchedAt}
        classification={marketData.classification}
      />

      {/* 1. Helsinki market overview */}
      <MarketOverview index={marketData.index} />

      {/* 2. Portfolio allocation (primary emphasis) */}
      <PortfolioAllocation allocation={allocation} />

      {/* 3. Individual holdings */}
      <HoldingsList holdings={allocation.holdings} />

      {/* 4. Dividends */}
      <DividendOverview dividends={dividends} />
    </main>
  );
}
