# Investment Portfolio Dashboard
## Revised Product Specification

> A simple, readable investment overview for a 70-year-old audience, focused on portfolio allocation, daily stock movements, dividends, and the Helsinki stock market.
>
> **Core rule: The dashboard must never display the total portfolio value or the euro market value of individual holdings.** These values may be calculated internally when needed for allocation percentages, but must not appear in the user interface.

---

## 1. Product objective

Build a lightweight web dashboard for monitoring a predefined portfolio of stocks listed on Nasdaq Helsinki (OMXH).

The dashboard should help the user answer five questions:

1. Which companies do I own?
2. What percentage of my portfolio does each holding represent?
3. How are my holdings performing today?
4. What dividends have recently been paid or announced, and what annual dividends might I expect?
5. What is happening in the Helsinki stock market?

The product is an investment overview, not a trading terminal or advanced analytics platform. Prioritize clarity, trustworthiness, readability, and ease of use over feature count.

### 1.1 Product principles

- Do not display total portfolio value, individual holding market values, or total profit/loss in euros.
- Make portfolio allocation percentages the primary information.
- Show daily percentage movements as secondary information.
- Make dividend information prominent and easy to understand.
- Provide a simple Helsinki market indicator.
- Keep the initial screen understandable in approximately 10 seconds.
- Avoid dense tables, complex charts, unnecessary controls, and excessive financial terminology.

---

## 2. Version 1 scope

### 2.1 Required features

1. Portfolio allocation by holding, shown as percentages.
2. A clear list of holdings, sorted by allocation from largest to smallest.
3. Daily percentage change for each holding.
4. Helsinki market index level or daily percentage movement, with a clear update time and data-delay label.
5. Dividend information:
   - latest declared, approved, or paid dividend, with its status clearly identified;
   - estimated annual gross dividend income, where reliable data is available;
   - relevant payment dates, where known.
6. Clear data freshness, loading, and error states.
7. Responsive layout with large, touch-friendly controls.

### 2.2 Optional / later features

- A small selection of relevant company news headlines (maximum 2–3).
- A simple percentage-based historical performance chart, only if user testing shows that it is useful.
- A more detailed stock view opened by selecting a holding.
- Historical dividend history.
- Benchmark comparisons.

### 2.3 Explicitly out of scope for version 1

- Displaying total portfolio value.
- Displaying individual holding market values in euros.
- Displaying total profit/loss in euros.
- A large interactive portfolio performance chart.
- Multiple chart periods and chart-mode controls.
- A complex sortable holdings table.
- A full financial news feed or news recommendation system.
- Transaction history and performance accounting.
- Multiple portfolios.
- User accounts, authentication, or a database unless a real requirement emerges.
- Advanced analytics, sentiment analysis, or complex stock detail pages.

---

## 3. Dashboard layout and information hierarchy

Use one simple page with four main sections, in this order.

### 3.1 Helsinki market overview

At the top, show a concise market summary.

Recommended information:

- Index name: OMX Helsinki All-Share Index (OMXHPI), subject to confirmation of provider symbol and availability.
- Current index level, if available and useful.
- Today's percentage change.
- Market status: open, closed, or data unavailable.
- Last updated timestamp.
- Data classification: live, delayed, or previous close.

Requirements:

- Do not call data “live” unless the provider confirms it is genuinely real-time and the relevant display rights are in place.
- If only delayed or end-of-day data is available, label it clearly.
- Show a calm, concise status rather than a large trading-style ticker.
- Do not imply that the index represents the user's own portfolio.

### 3.2 Portfolio allocation

This is the primary section and should receive the strongest visual emphasis.

Show:

- A simple horizontal allocation bar or similarly easy-to-read visualization.
- A list of company names.
- Each holding's percentage of the total portfolio.
- Optional daily percentage change beside each holding.

Sort holdings from highest allocation to lowest allocation.

#### Allocation calculation

Calculate each holding's current market value internally:

`holding market value = quantity × latest valid share price`

Then calculate:

`portfolio allocation (%) = holding market value / total market value of all holdings × 100`

The total portfolio value is an internal calculation only. Never render it in the interface, tooltips, accessibility labels that expose it unnecessarily, or stock detail views.

Requirements:

- Percentages should add up to approximately 100%, allowing for rounding.
- Recalculate allocation when valid market prices change.
- Do not calculate or display misleading percentages when required price data is missing or stale beyond the defined threshold.
- Clearly indicate when allocation is based on cached or delayed data.
- Do not silently treat missing prices as zero.

### 3.3 Individual holdings

Use a simple list rather than a dense financial table.

For each holding, show only:

1. Company name.
2. Portfolio allocation percentage.
3. Today's percentage change.

Ticker symbols may appear as smaller secondary text if they help identify companies.

Do not show:

- Share quantity.
- Purchase price.
- Current share price by default.
- Individual market value in euros.
- Profit or loss in euros.
- Multiple return periods or dense statistics.

A holding may open a simple optional detail view later, but the primary dashboard must remain uncluttered. Any detail view must also respect the rule against showing portfolio value and individual holding market value.

### 3.4 Dividends

Give dividends their own clearly separated section. This is a core feature, not a minor future enhancement.

Separate the information into two categories.

#### A. Latest dividend information

For each relevant holding, show:

- Company name.
- Dividend amount per share.
- Status: proposed, announced, approved, or paid.
- Relevant announcement, ex-dividend, or payment date, where available.
- Currency.

Do not present a proposed dividend as approved or a paid dividend as an upcoming payment.

#### B. Estimated annual dividend income

Where reliable data is available, show:

- Estimated annual gross dividend income for the configured holdings.
- The basis of the estimate and the date it was calculated.
- Relevant expected payment dates, if known.

Calculation:

`estimated gross dividend = shares owned × estimated dividend per share`

Sum the estimates across holdings only when the underlying dividend information is sufficiently reliable.

Important safeguards:

- Clearly label estimates as estimates, not guaranteed income.
- Distinguish declared and approved dividends from forecasts.
- Do not assume last year's dividend will be repeated.
- Do not describe an estimate based on a previous dividend as a confirmed future payment.
- Do not include tax calculations or imply that the displayed amount is net income.
- If reliable estimates are unavailable, show the latest confirmed dividend information instead of inventing an estimate.
- Avoid making dividend yield the main metric; an estimated gross amount is easier to interpret.

---

## 4. Design and accessibility

The primary audience includes older users. Design for comfortable reading and straightforward interaction without assuming that all people in this age group have identical needs.

### 4.1 Visual direction

Use a calm, familiar, light interface by default.

Suggested characteristics:

- White or very light grey background.
- Dark, high-contrast text.
- Restrained accent colors.
- Clear section separation.
- Generous spacing.
- Minimal decoration.
- No unnecessary animation.
- No trading-terminal aesthetic.

A dark theme can be considered later, but should not be the default for version 1.

### 4.2 Typography and readability

- Body text: approximately 18px where practical.
- Section headings: approximately 24–30px.
- Use readable font weights and line heights.
- Avoid tiny labels and compact financial tables.
- Use tabular numerals for percentages and financial figures.
- Support browser zoom and larger text settings without breaking the layout.

### 4.3 Interaction

- Use large, clearly labelled interactive elements.
- Ensure comfortable click and touch target sizes.
- Avoid icon-only controls unless their meaning is universally clear and accessible.
- Keep navigation shallow and predictable.
- Keep the most important information visible without excessive scrolling.
- Do not rely on color alone: pair positive/negative colors with `+` and `−` signs and clear text.
- Use plain language and explain financial terms when necessary.

### 4.4 Accessibility

- Maintain strong text and interface contrast.
- Use semantic headings and accessible labels.
- Ensure keyboard navigation.
- Provide visible focus states.
- Do not communicate market or dividend status by color alone.
- Test with browser zoom and larger text.
- Test the interface with the intended user where possible. Do not assume age alone predicts accessibility needs.

---

## 5. Market data and reliability

### 5.1 Data provider selection

Investigate suitable providers for Nasdaq Helsinki equities and the chosen OMX Helsinki index.

Potential providers to investigate include:

- Nasdaq Nordic / Nasdaq Data Link.
- Twelve Data.
- Marketstack.
- Other documented providers with verified Nasdaq Helsinki coverage.

Do not assume that a provider supports a particular symbol or index. Test the actual portfolio symbols and index.

Before selecting a provider, verify:

- Coverage of all configured OMXH holdings.
- Availability of the required index.
- Whether quotes are real-time, delayed, or end-of-day.
- Historical data availability, if needed later.
- Rate limits and caching requirements.
- API costs.
- Personal-use and public-display rights.
- Exchange-data licensing restrictions.

Do not use unofficial scraping as the primary market data source.

### 5.2 Data labels and freshness

Always display:

- Last successful update time.
- Whether the data is live, delayed, previous close, or cached.
- A clear error or stale-data state when appropriate.

Never:

- Describe delayed or end-of-day data as live.
- Replace missing prices with zero.
- Fabricate prices, dividends, or timestamps.
- Hide a provider failure while presenting old data as current.

Retain the last successful response when appropriate, but clearly mark it as cached or outdated.

### 5.3 Refresh strategy

- Fetch the latest available data when the dashboard loads.
- Refresh periodically only where provider limits and market-data terms allow.
- Avoid unnecessary repeated API calls.
- Respect exchange trading hours and holidays.
- Cache data where appropriate.
- Show a clear loading state.
- Handle partial failures per holding.

---

## 6. Dividend data integration

Create a dedicated dividend data service, separate from market price retrieval.

Suggested responsibilities:

- Retrieve the latest available dividend announcements and payment information.
- Normalize dividend amounts, currencies, dates, and statuses.
- Distinguish proposed, announced, approved, and paid dividends.
- Provide an estimated annual dividend per share only when the source supports it.
- Calculate estimated gross dividend income using configured share quantities.
- Track the source and timestamp of dividend data.
- Handle missing, stale, or conflicting dividend records.
- Avoid duplicate dividend events.

The data model should distinguish at least:

- Company / symbol.
- Amount per share.
- Currency.
- Status.
- Announcement date.
- Ex-dividend date, if available.
- Payment date, if available.
- Data source.
- Last updated timestamp.
- Whether the amount is confirmed or estimated.

Do not assume that every provider offers reliable dividend forecasts. If estimates are unavailable, show confirmed historical or announced information without inventing a forecast.

---

## 7. Portfolio configuration and calculations

Keep the initial portfolio hardcoded in one centralized configuration file:

`src/config/portfolio.ts`

Suggested structure:

```typescript
export interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  currency: string;
}

export const portfolio: PortfolioHolding[] = [
  {
    symbol: "NOKIA",
    name: "Nokia",
    quantity: 100,
    currency: "EUR"
  },
  {
    symbol: "NESTE",
    name: "Neste",
    quantity: 50,
    currency: "EUR"
  },
  {
    symbol: "KNEBV",
    name: "KONE",
    quantity: 20,
    currency: "EUR"
  }
];
```

The examples above are illustrative and must be replaced with the actual holdings.

### 7.1 Calculation requirements

Implement and test:

- Internal market value per holding.
- Internal total market value.
- Allocation percentage per holding.
- Estimated dividend income per holding.
- Total estimated gross dividend income, where supported.

The internal market values are permitted only to support calculations. They must not be exposed in the UI.

Keep calculation logic separate from presentation components.

---

## 8. Application architecture

Retain a lightweight modular architecture.

Suggested technologies:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- Lucide React.
- A lightweight charting library only if a chart is added later.
- Vercel or another suitable hosting provider.

Suggested structure:

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── MarketOverview.tsx
│   │   ├── PortfolioAllocation.tsx
│   │   ├── HoldingsList.tsx
│   │   ├── DividendOverview.tsx
│   │   └── NewsHighlights.tsx
│   └── ui/
│       ├── Card.tsx
│       ├── Loading.tsx
│       └── ErrorMessage.tsx
├── config/
│   └── portfolio.ts
├── services/
│   ├── marketDataService.ts
│   └── dividendService.ts
├── hooks/
│   ├── usePortfolio.ts
│   ├── useMarketData.ts
│   └── useDividends.ts
├── lib/
│   ├── portfolioCalculations.ts
│   └── formatters.ts
└── types/
    ├── portfolio.ts
    ├── marketData.ts
    └── dividends.ts
```

Adjust the structure if the project already has a suitable architecture. Avoid creating abstractions that do not solve a real problem.

### 8.1 Technical principles

- Keep business logic separate from UI components.
- Use TypeScript throughout.
- Keep API keys server-side in environment variables.
- Validate external API responses.
- Avoid unnecessary dependencies.
- Use a provider abstraction where it makes provider replacement materially easier.
- Do not introduce authentication, databases, or user management unless genuinely required.

---

## 9. Optional company news

News is secondary and should not compete visually with holdings or dividends.

If implemented:

- Show no more than 2–3 relevant recent headlines initially.
- Associate each headline with the relevant company.
- Show publisher and publication date.
- Link to the original article.
- Avoid duplicates.
- Handle an empty news result gracefully.
- Verify the provider's Finnish company coverage, API limits, and display rights.

Do not build a full news feed, complex filters, or sentiment analysis in version 1.

---

## 10. Error handling and security

Implement:

- API request timeouts.
- Rate-limit handling.
- Data validation.
- Missing-data handling.
- Loading indicators.
- Clear error messages.
- Last-updated timestamps.
- Cached-data fallback with a visible stale-data label.

Never display fabricated financial information or substitute zero for missing data.

Store API keys in environment variables. Never commit secrets to Git or expose private API credentials to browser clients.

Provide an `.env.example` file and document required provider configuration.

---

## 11. Implementation phases

### Phase 1 — Foundation and market data

- Inspect the existing project before changing files.
- Initialize or adapt the Next.js / TypeScript project.
- Create the centralized portfolio configuration.
- Build the simple light dashboard layout.
- Verify market data provider coverage for the actual holdings and OMXH index.
- Implement normalized quote retrieval, caching, and freshness labels.

**Deliverable:** A working dashboard shell with reliable market data.

### Phase 2 — Portfolio allocation and holdings

- Implement and unit-test portfolio calculations.
- Calculate allocation percentages internally.
- Build the allocation visualization.
- Build the simple holdings list.
- Display daily percentage movements.
- Verify that no portfolio value or individual holding market value is rendered anywhere.

**Deliverable:** A clear portfolio allocation overview.

### Phase 3 — Dividend information

- Investigate and verify dividend data sources.
- Implement the dividend service.
- Distinguish announced, approved, paid, and estimated dividends.
- Calculate annual gross estimates where reliable.
- Display relevant dates and data freshness.
- Handle missing or uncertain dividend information.

**Deliverable:** A reliable and understandable dividend overview.

### Phase 4 — Quality, accessibility, and optional news

- Test readability and usability with the intended user.
- Test desktop, tablet, and mobile layouts.
- Test browser zoom and larger text.
- Verify keyboard navigation and contrast.
- Add 2–3 news highlights only if they provide clear value.
- Test provider failures, stale data, and missing data.
- Update README documentation.

**Deliverable:** A polished, dependable, accessible initial dashboard.

---

## 12. Testing requirements

### Portfolio calculations

- Allocation percentages calculate correctly.
- Allocation percentages total approximately 100%.
- Price changes update allocation correctly.
- Missing prices do not create misleading allocation results.
- Dividend estimates use the configured share quantities correctly.
- Dividend currencies are handled correctly.
- Estimated and confirmed dividend data remain distinct.

### Critical display restriction

Test that the following never appear in the user interface:

- Total portfolio value.
- Individual holding market values.
- Total profit/loss in euros.
- Portfolio value in chart tooltips or detail views.

Internal calculations may use these figures where necessary, but UI components must not render them.

### Market data

- All configured symbols are supported.
- Index data is correct.
- Live, delayed, previous-close, and cached data are labelled accurately.
- Timestamps are correct.
- API failures are handled.
- No missing data is replaced by fabricated values.

### Dividends

- Status labels are accurate.
- Proposed dividends are not presented as approved.
- Paid dividends are not presented as upcoming.
- Estimates are clearly identified.
- Missing forecasts do not produce fabricated estimates.
- Payment dates and currencies are correct where available.

### Usability

- The main dashboard is understandable without instructions.
- Text remains readable at increased browser zoom.
- Controls are easy to click.
- Positive and negative movements are understandable without color alone.
- There is no unnecessary horizontal scrolling.
- The dashboard works on desktop, tablet, and mobile.

---

## 13. Definition of done

Version 1 is complete when:

- The application launches successfully.
- Holdings are configurable in one centralized file.
- Current market data is retrieved from a verified provider.
- The OMX Helsinki market indicator is displayed with accurate data labels.
- Portfolio allocation percentages are calculated and displayed correctly.
- Holdings are shown in a simple, readable list.
- Daily percentage changes are displayed where available.
- Latest dividend information is displayed with accurate status labels.
- Estimated annual gross dividends are displayed only when supported by reliable data.
- Data freshness and error states are clear.
- The interface is readable and easy to use for the intended audience.
- No portfolio value or individual holding market value is displayed.
- API credentials are stored securely.
- The application works on desktop, tablet, and mobile.

---

## 14. Instructions to the coding agent

Treat this document as the primary product specification.

Before implementation:

1. Inspect the existing project and its current code.
2. Identify reusable components and existing functionality.
3. Verify market and dividend data providers before assuming symbol coverage or data availability.
4. Confirm the licensing and display restrictions for market data.
5. Replace illustrative holdings with the actual portfolio configuration when provided.

During implementation:

- Prioritize accuracy and readability over feature count.
- Do not reintroduce portfolio value displays.
- Do not build the original complex historical chart as part of version 1.
- Do not add a full news feed.
- Do not fabricate stock prices, dividend data, or news.
- Clearly document data-provider limitations.
- Keep the interface calm, simple, and accessible.
- Test calculations independently from the UI.
- Keep the application lightweight and maintainable.

### Final product priority

1. Reliable market data.
2. Clear portfolio allocation percentages.
3. Simple individual holdings overview.
4. Accurate dividend information.
5. Accessible, readable design.
6. Helsinki market context.
7. Optional limited company news.

**The finished application should feel like a calm, trustworthy investment overview — not a trading platform or a complex financial analytics dashboard.**
