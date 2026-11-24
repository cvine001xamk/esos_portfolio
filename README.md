# Investment Portfolio Dashboard

> Project specification and implementation guide.
## 1. Project Overview
### 1.1 Objective
Build a modern, minimalist web application that visualizes the historical and current development of a predefined investment portfolio consisting of stocks listed on the Nasdaq Helsinki Stock Exchange (OMXH).
- The application should provide a clear overview of portfolio performance through interactive charts, portfolio statistics, individual stock information, and recent financial news related to the portfolio holdings.
The application is primarily intended for personal investment tracking and portfolio monitoring.
### 1.2 Core Concept
- The application should answer three fundamental questions:
How has my investment portfolio developed over time?
What is the current value and performance of my investments?
What recent news and developments could be relevant to my portfolio?
- The application should prioritize simplicity, readability, and useful information over unnecessary features.
### 1.3 Main Features
Interactive portfolio performance chart.
Multiple selectable time periods.
Automatic fetching of stock market data.
Hardcoded portfolio holdings and quantities.
Portfolio value and performance statistics.
Individual stock performance information.
Recent news articles and headlines from the past 30 days.
- Responsive design for desktop, tablet, and mobile devices.
## 2. Technology Stack
- Use the following technologies unless a compelling technical reason requires an alternative.
| Technology | Purpose |
|---|---|
| Next.js | Web application framework |
| React | Component-based UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling and responsive layouts |
| Recharts or TradingView Lightweight Charts | Interactive financial charts |
| Lucide React | Icons |
| Financial data API | Stock market data |
| News API | Recent financial news |
| Vercel | Hosting and deployment |
Technical principles
- Use a modular component-based architecture.
- Keep business logic separate from UI components.
Use TypeScript throughout the application.
- Prefer server-side API requests when API keys are involved.
- Avoid unnecessary dependencies.
- Keep the application lightweight and fast.
- Make the code easy to extend with additional stocks and features.
## 3. Portfolio Configuration
### 3.1 Hardcoded Holdings
- The portfolio should initially be defined directly in the application's source code.
- Create a centralized configuration file:
src/config/portfolio.ts
- Example structure:
```typescript
export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  averagePurchasePrice: number;
  currency: string;
}

export const portfolio: PortfolioHolding[] = [
  {
    symbol: "NOKIA",
    name: "Nokia",
    quantity: 100,
    averagePurchasePrice: 3.50,
    currency: "EUR"
  },
  {
    symbol: "NESTE",
    name: "Neste",
    quantity: 50,
    averagePurchasePrice: 15.00,
    currency: "EUR"
  },
  {
    symbol: "KNEBV",
    name: "KONE",
    quantity: 20,
    averagePurchasePrice: 45.00,
    currency: "EUR"
  }
];
```

The values above are illustrative examples and must be replaced with the actual portfolio holdings.
### 3.2 Requirements
- Portfolio holdings must be configurable from one centralized file.
- Each holding must have a stock symbol, company name, quantity, purchase price, and currency.
- Do not duplicate portfolio information across components.
All portfolio calculations must use the centralized configuration.
- Adding or removing a stock should not require modifying chart components or other UI elements.
### 3.3 Portfolio Calculations
- Calculate the following values:
- Current portfolio value
Sum of the current market value of all holdings.
- Current value = Σ (quantity × current stock price)
- Initial investment value
Sum of the purchase value of all holdings.
- Initial investment = Σ (quantity × average purchase price)
- Total profit/loss
- Profit/Loss = Current value - Initial investment
- Total return percentage
- Return % = (Profit/Loss / Initial investment) × 100
- All monetary values should be displayed in EUR.
- If a holding is denominated in another currency, convert it using an appropriate exchange rate API.
- Dividends should initially be excluded from performance calculations. Structure the calculation logic so dividend-adjusted performance can be implemented later.
## 4. Stock Market Data Integration
### 4.1 Objective
The application must automatically retrieve stock market prices for all configured portfolio holdings.
- The data source should support Nasdaq Helsinki listings.
- The preferred solution is a free API that provides:
Current or near-real-time stock prices.
Historical stock prices.
Daily closing prices.
- Historical data suitable for chart generation.
Multiple stock symbols.
EUR-denominated prices.
### 4.2 API Provider Evaluation
- Investigate the following providers:
- Nasdaq Nordic / Nasdaq Data Link
- Official exchange-related data source.
- Investigate available historical data and pricing.
- Verify whether public display rights are available.
- Twelve Data
- International stock market coverage.
- Investigate OMXH symbol availability.
- Verify historical data availability and free-tier restrictions.
- Marketstack
- Investigate historical Nasdaq Helsinki data.
Free tier may be sufficient for an initial prototype.
- Alternative Nasdaq Nordic data providers
- Investigate other providers that support Finnish equities.
- Prefer documented REST APIs.
- Provider selection must be based on actual successful API tests rather than assumptions about market coverage.
### 4.3 API Selection Requirements
- The coding agent must:
- Verify that the API supports the actual portfolio symbols.
- Test retrieving historical prices for at least two OMXH stocks.
- Test retrieving the latest available prices.
- Check API rate limits.
- Check whether the free tier allows displaying data in a personal web application.
- Determine whether prices are real-time, delayed, or end-of-day.
- Document any limitations.
- Important: Do not describe delayed or end-of-day prices as real-time.
If genuinely real-time OMXH data is not available for free, implement the best available free solution and clearly communicate the data delay to the user.
- Do not use unofficial scraping as the primary market data source.
### 4.4 API Architecture
- Create a dedicated market data service:
src/services/marketDataService.ts
- Responsibilities:
- Fetch current stock prices.
- Fetch historical stock prices.
Normalize API responses.
- Handle API errors.
- Handle missing data.
Convert data into a standardized internal format.
- Cache responses to minimize API requests.
- Use a provider abstraction so that the underlying API can be replaced without modifying portfolio calculations or UI components.
- Example normalized data structure:
```typescript
export interface StockPrice {
  symbol: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  currency: string;
  lastUpdated: string;
}
```
### 4.5 Refresh Strategy
- Fetch the latest available prices when the application loads.
- Refresh quotes periodically, preferably every 1–5 minutes where API limits allow.
- Avoid unnecessary repeated requests.
- Cache historical price data.
- Display the last successful update timestamp.
- Show a loading state during requests.
- Show a clear error state if the API is unavailable.
- Never replace missing API data with fabricated prices.
- Respect exchange trading hours and market holidays.
## 5. Portfolio Performance Chart
### 5.1 Main Feature
The portfolio performance chart is the central element of the application.
It should visualize the historical development of the entire investment portfolio.
The chart should be interactive, visually clean, and easy to understand.
### 5.2 Chart Data Calculation
For every historical date, calculate the portfolio value using:
Portfolio value at date T = Σ (quantity × stock closing price at date T)
Use the same portfolio holdings and quantities for the historical calculations as for the current portfolio.
The chart should represent the historical market value of the currently configured holdings, not the historical value of the account including past purchases, sales, or deposits.
Align historical price series by date. Handle missing trading days appropriately without treating missing prices as zero.
### 5.3 Time Scale Selection
Provide selectable time periods above or below the chart.
Required options:
1D — One day
1W — One week
1M — One month
3M — Three months
6M — Six months
1Y — One year
5Y — Five years
ALL — All available historical data
When a time period is selected:
Update the chart immediately using cached data where available.
- Fetch additional historical data if necessary.
Update the visible date range.
Recalculate the displayed performance for the selected period.
### 5.4 Chart Appearance
The chart should include:
Smooth, clean line visualization.
Subtle gradient fill underneath the line.
Interactive tooltip on hover.
Date and portfolio value in the tooltip.
EUR currency formatting.
- Responsive sizing.
Minimal grid lines.
Clear axis labels.
Optional percentage performance view.
- Add a toggle between:
Portfolio value (€) — Absolute portfolio value.
Performance (%) — Percentage change relative to the beginning of the selected period.
### 5.5 Chart Performance Indicators
- Display relevant information near the chart:
- Current portfolio value.
Absolute change during the selected period.
Percentage change during the selected period.
Highest portfolio value within the selected period.
Lowest portfolio value within the selected period.
Use green for positive performance and red for negative performance, while maintaining sufficient contrast.
## 6. Portfolio Overview
- Create a dashboard section above or near the main chart.
### 6.1 Summary Cards
- Display four primary statistics:
Total Portfolio Value
Current combined market value.
Total Return
Absolute profit/loss.
Percentage return.
Today's Change
Change in value compared with the previous trading day's close.
Percentage change.
Number of Holdings
Total number of stocks in the portfolio.
### 6.2 Holdings Table
- Create a compact table listing all portfolio stocks.
Columns:
| Column | Description |
| Company | Company name |
| Symbol | Stock ticker |
| Quantity | Number of shares |
| Price | Latest available price |
| Market Value | Quantity × price |
| Daily Change | Daily percentage change |
| Total Return | Return relative to purchase price |
Requirements:
- Sortable columns.
- Responsive layout.
- Positive and negative values visually differentiated.
symbol: string;
currentPrice: number;
previousClose: number;
change: number;
changePercent: number;
currency: string;
lastUpdated: string;
- Clicking a stock should optionally open a detailed stock view.
- Show loading and error states for individual holdings.
## 7. Financial News Integration
### 7.1 Objective
- Display recent news articles related to companies in the configured portfolio.
The purpose is to provide a quick overview of recent events that could affect portfolio performance.
### 7.2 News Requirements
- Retrieve articles published within the past 30 days.
- Include only articles relevant to the configured portfolio stocks.
- Display the latest articles first.
- Associate each article with the relevant company.
- Avoid duplicate articles.
- Limit the initial display to approximately 5–10 articles.
- Allow users to open the original article.
### 7.3 News Data Sources
- Investigate free news APIs such as:
GNews.
NewsAPI.
Finnhub company news.
Other suitable financial news providers.
Verify:
Finnish company coverage.
Availability of historical news from the past 30 days.
Free-tier request limits.
API key requirements.
Commercial and personal-use restrictions.
Whether article titles, summaries, and images can legally be displayed.
If a free provider cannot retrieve the full 30-day period, implement the maximum available period and document the limitation.
### 7.4 News Card Design
Each article should display:
Headline.
Company name or ticker.
Publisher.
Publication date.
Short description, if available.
Optional thumbnail.
External link to the original article.
- Example layout:
```text
NOKIA · 2 hours ago
Nokia announces a new strategic partnership...
Publisher: Example News
Read article →
```

### 7.5 News Filtering
Provide simple filtering options:
All companies.
Individual portfolio stocks.
Most recent.
- Do not build a complex news recommendation system.
### 7.6 News Service
Create:
src/services/newsService.ts
- Fetch recent articles.
Filter articles by configured portfolio symbols and company names.
Normalize results.
- Remove duplicates.
- Sort by publication date.
- Cache responses.
- Never fabricate article headlines or summaries.
## 8. User Interface and Visual Design
### 8.1 Design Philosophy
- The application should have a modern, simplistic, premium-looking financial dashboard aesthetic.
Visual inspiration can be taken from:
Linear.
Stripe Dashboard.
Modern fintech applications.
Minimalist financial analytics platforms.
- Avoid overly complicated dashboards, excessive colors, unnecessary animations, and dense information layouts.
The interface should feel like a polished personal investment terminal.
### 8.2 Color Palette
Suggested color scheme:
Element	Color
Main background	#0B0D12
Card background	#141821
Secondary background	#1B202B
Primary text	#F5F6F8
Secondary text	#9299A8
Accent	#6C8CFF
Positive	#35C98B
Negative	#F16F76
Borders	#252B36
- Use a dark theme as the default.
- Keep the visual hierarchy clear and consistent.
### 8.3 Typography
- Use a modern sans-serif font such as Inter.
Clear heading hierarchy.
Large portfolio value typography.
Compact but readable table text.
Consistent spacing.
Consistent font weights.
Tabular numbers for financial values.
### 8.4 Layout
Suggested desktop layout:
```text
┌──────────────────────────────────────────────────────┐
│ LOGO                                  LAST UPDATED    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  My Portfolio                                        │
│  € XX,XXX.XX                                         │
│  +€ XXX.XX (+X.XX%)                                  │
├───────────────┬───────────────┬──────────────────────┤
│ Total Return  │ Today's Change│ Holdings             │
├───────────────┴───────────────┴──────────────────────┤
│  PORTFOLIO PERFORMANCE                               │
│  1D  1W  1M  3M  6M  1Y  5Y  ALL                    │
│              INTERACTIVE CHART                       │
│  PORTFOLIO HOLDINGS                                  │
│  Stock       Price       Value       Change           │
│  Nokia       €X.XX       €XXX        +X.XX%           │
│  Neste       €X.XX       €XXX        -X.XX%           │
│  KONE        €X.XX       €XXX        +X.XX%           │
│  LATEST NEWS                                         │
│  Article card                                        │
└──────────────────────────────────────────────────────┘
```

This is a conceptual layout, not a strict pixel-level requirement.
### 8.5 Responsive Design
Desktop:
Main chart should occupy most of the available width.
Summary cards should appear horizontally.
Holdings should use a table.
Mobile:
Summary cards should stack or use a compact grid.
Chart should remain fully usable.
Holdings should use a horizontally scrollable table or compact stock cards.
News cards should stack vertically.
Navigation and controls should be touch-friendly.
## 9. Application Structure
- Use the following suggested folder structure:
```text
src/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── PortfolioSummary.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── PortfolioChart.tsx
│   │   ├── ChartControls.tsx
│   │   ├── HoldingsTable.tsx
│   │   └── NewsSection.tsx
│   │
│   ├── stocks/
│   │   ├── StockRow.tsx
│   │   └── StockDetails.tsx
│   └── ui/
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Loading.tsx
│       └── ErrorMessage.tsx
├── config/
│   └── portfolio.ts
├── services/
│   ├── marketDataService.ts
│   └── newsService.ts
├── hooks/
│   ├── usePortfolio.ts
│   ├── useMarketData.ts
│   └── useNews.ts
├── lib/
│   ├── portfolioCalculations.ts
│   ├── chartCalculations.ts
│   ├── formatters.ts
│   └── dateUtils.ts
├── types/
│   ├── portfolio.ts
│   ├── marketData.ts
│   └── news.ts
└── ...
```

The exact folder structure may be adjusted if necessary, but maintain separation between configuration, business logic, services, and UI.
## 10. Error Handling and Data Reliability
Financial information must be handled carefully.
- Implement the following:
API request timeouts.
API error handling.
Rate-limit handling.
Data validation.
- Missing price handling.
- Invalid symbol handling.
Loading indicators.
Last-updated timestamps.
Cached data fallback.
If an API request fails, retain the last successfully retrieved data where possible and indicate that it may be outdated.
- Never display zero as a substitute for missing stock prices.
- Never invent historical prices or financial statistics.
Clearly distinguish:
Live prices.
Delayed prices.
End-of-day prices.
Cached prices.
## 11. Security and Configuration
- Store API keys in environment variables.
- Never commit API keys to Git.
Use server-side API routes for providers requiring secret credentials.
- Add an .env.example file.
- Validate all external API responses.
- Do not expose private API credentials to browser clients.
- Follow provider rate limits and usage terms.
Example:
```env
MARKET_DATA_API_KEY=
NEWS_API_KEY=
```

Add suitable server-side API endpoints if required by the selected providers.
## 12. Implementation Phases
The agent should build the application incrementally.
Phase 1 — Project Setup
Initialize Next.js with TypeScript.
Configure Tailwind CSS.
Install required dependencies.
Establish folder structure.
Create the portfolio configuration.
- Implement the basic dashboard layout.
Deliverable: A functioning dashboard with static sample data.
Phase 2 — Portfolio Calculations
- Implement portfolio valuation.
- Implement profit/loss calculations.
- Implement percentage returns.
- Implement per-stock calculations.
- Add unit tests for financial calculations.
Deliverable: Correctly calculated portfolio statistics.
Phase 3 — Market Data Integration
- Investigate and select an appropriate API.
- Verify OMXH symbol support.
- Implement market data service.
- Retrieve current prices.
- Retrieve historical prices.
- Implement caching and refresh logic.
- Add data freshness indicators.
Deliverable: Working portfolio data using an external market data provider.
Phase 4 — Interactive Chart
Integrate charting library.
- Implement historical portfolio valuation.
- Add selectable time periods.
- Implement value and percentage views.
- Add tooltips and chart interactions.
Optimize chart responsiveness.
Deliverable: Fully functional interactive portfolio performance chart.
Phase 5 — Portfolio Holdings
- Implement holdings table.
- Display individual stock prices.
- Display daily performance.
- Add sorting.
- Implement responsive mobile presentation.
Deliverable: Complete holdings overview.
Phase 6 — News Integration
- Investigate and select news API.
- Implement news service.
- Retrieve articles from the previous 30 days.
Filter articles by portfolio holdings.
- Implement news cards.
- Add company filters.
Deliverable: Working portfolio-related news section.
Phase 7 — UI Polish and Testing
Refine typography and spacing.
Improve responsive layouts.
- Add loading and error states.
- Verify financial calculations.
- Test API failure scenarios.
- Check performance.
Fix UI inconsistencies.
Deliverable: Production-quality initial application.
## 13. Testing Requirements
The agent must test the following scenarios.
Portfolio calculations
Multiple holdings calculate correctly.
- Current portfolio value is correct.
- Initial investment is correct.
Profit/loss is correct.
Percentage returns are correct.
- Missing stock data does not produce misleading calculations.
Chart
- Every time period can be selected.
- Historical data is correctly aligned.
Portfolio values are correctly calculated.
- Chart responds to different screen sizes.
- Missing historical data is handled appropriately.
API integration
Valid API responses work.
- API failures are handled.
Rate limits are respected.
Data timestamps are correct.
No fabricated data is displayed.
News
Only relevant company articles are displayed.
- Articles are within the supported date range.
Duplicate articles are removed.
Original article links work.
- Empty news results are handled gracefully.
UI
- Desktop layout works.
- Mobile layout works.
- Loading states work.
- Error states work.
- No horizontal overflow on mobile.
## 14. Future Enhancements (Not Required Initially)
- Keep the architecture flexible enough to support these features later.
Potential additions:
Portfolio transaction history.
Adding and removing stocks through the UI.
Multiple portfolios.
Dividend tracking.
Dividend-adjusted total returns.
Benchmark comparison against OMXH25 or OMX Helsinki indices.
Stock-specific historical charts.
Portfolio allocation visualization.
Investment performance comparisons.
News sentiment analysis.
Historical portfolio snapshots.
Exporting portfolio data to CSV.
Light/dark theme switching.
- Do not implement these features in the initial version unless they are necessary for the core functionality.
## 15. Definition of Done
The application is considered complete when:
The application launches successfully.
The portfolio is configurable through a centralized hardcoded file.
Current stock prices are retrieved from a working external API.
Historical stock prices can be retrieved.
Portfolio value is calculated correctly.
The interactive portfolio chart works.
All requested time periods are selectable.
Users can switch between absolute value and percentage performance.
Individual holdings are displayed correctly.
Recent portfolio-related news is displayed.
News articles can be opened at their original sources.
The application works on desktop and mobile.
- API failures and missing data are handled appropriately.
API keys are stored securely.
The application has a consistent, modern, minimalist visual design.
## 16. Instructions to the Coding Agent
Treat this document as the primary development specification.
- Follow these instructions throughout implementation:
First inspect the project directory and existing code before making changes.
If the project is empty, initialize the application using the proposed technology stack.
- Implement the application in the phases described above.
Prioritize a functioning end-to-end application over unnecessary complexity.
- Do not leave core features as placeholders or static mockups.
Use real external market data wherever the provider supports it.
- Do not fabricate stock prices, financial information, or news.
- Verify the availability and limitations of APIs before integrating them.
If a requested capability cannot be implemented with a free provider, explain the limitation and implement the closest reliable alternative.
- Keep components small, reusable, and maintainable.
Write clean, readable TypeScript.
- Test financial calculations independently from the UI.
- Do not introduce authentication, databases, or user management unless genuinely required.
Update the README with installation, configuration, API setup, and deployment instructions.
Final Development Priority
The most important part of this project is the portfolio performance chart.
Prioritize development in this order:
Correct stock market data.
Correct historical portfolio valuation.
Functional interactive chart.
Accurate portfolio statistics.
Holdings overview.
Recent financial news.
Visual polish and additional refinements.
The final result should feel like a clean, premium personal investment dashboard rather than a generic financial website.
