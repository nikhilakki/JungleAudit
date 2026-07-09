# JungleAudit roadmap

## Phase 1 (remaining)

- [ ] Average order value and order frequency over time
- [ ] Payment method breakdown
- [ ] Category breakdown via `category-taxonomy.json`
- [ ] Net spend after refunds (returns cluster joins)

## Phase 2

- [ ] Day-of-week / hour-of-day heatmap
- [ ] Seasonality view
- [ ] Cart-to-purchase conversion
- [ ] Return rate, refund totals, return reasons
- [ ] Refund funnel timing
- [ ] Gifts vs self-purchases split

## Phase 3

- [ ] Market basket analysis
- [ ] Repeat-ASIN price tracking
- [ ] Anomaly detection (simple-statistics)
- [ ] Monthly category-spend clustering
- [ ] Next-month spend forecast

## Phase 4

- [ ] OPFS persistence
- [ ] Static deployment polish (screenshot, GitHub Pages base path)
- [ ] Optional LLM categorization (opt-in, off by default)

## Data compatibility

- [ ] Verify amazon.com "Your Orders" exports (Retail.OrderHistory.N.csv,
      Digital-Ordering.N) against a real US export — filename detection and the
      "total owed" price alias were added from documentation, not a live sample