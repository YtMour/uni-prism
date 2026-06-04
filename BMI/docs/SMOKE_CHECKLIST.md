# Smoke Checklist

Last updated: 2026-06-04

## Purpose

Use this checklist after UI/layout changes, route changes, or Android App base packaging work.

## H5 Route Smoke

Run inside `FitCal-Uniapp`:

```bash
npm run typecheck
npm run build:h5
npm run dev:h5
```

Check these routes:

- `http://localhost:5179/#/`
- `http://localhost:5179/#/pages/policy/policy?type=privacy`
- `http://localhost:5179/#/pages/policy/policy?type=disclaimer`

Expected:

- Home route renders FitCal tabs.
- Privacy route shows Privacy Policy content and no bottom tab bar.
- Disclaimer route shows Disclaimer content and no bottom tab bar.
- Back button returns to the previous route.
- Browser console has no runtime errors.

## Core Flow Smoke

BMI:

- Metric inputs calculate BMI.
- Successful Calculate BMI adds a local record.
- Imperial switch converts height and weight.
- Invalid height or weight shows a field error.
- Invalid result display uses `--` instead of stale or impossible values.

Calories:

- Sex, age, activity, and goal controls update visually.
- Valid inputs calculate BMR, TDEE, and daily target.
- Invalid age shows a field error.

Records:

- Add Record adds one local record.
- Delete removes one record.
- Record list never exceeds the configured saved-record limit.
- Lowering the saved-record limit trims older records immediately.
- Chart sample setting changes how many newest records feed the trend chart.
- Current and BMI summary cards match the newest saved record.
- Trend dots and line update after add/delete.
- Trend chart line and dots stay inside the chart card on H5.
- Trend chart shows title, latest value, value range, Y-axis labels, and start/end date labels.
- Clear local data empties the list and stays empty after refresh.

Settings:

- Unit switch updates BMI and Settings units.
- Privacy Policy opens the dedicated privacy page.
- Disclaimer opens the dedicated disclaimer page.
- Clear local data removes records.

## Android App Base Smoke

Run after H5 smoke passes:

- Numeric keyboard appears for height, weight, and age.
- Unit switch remains responsive.
- Policy pages open and Back returns cleanly.
- Add/delete/clear record persistence survives app restart.
- BMI Calculate creates a record and Records screen reflects it.
- More calculations than the configured saved-record limit still keep only the configured maximum.
- Chart samples setting does not exceed saved-record limit.
- Records trend chart line and dots stay inside the chart card.
- Records trend chart labels remain readable and do not cover the main line.
- Bottom navigation is not covered by the safe area.
- Android manifest permissions remain empty for the local-first, ad-placeholder-only MVP.

## Known Non-Blocking Notes

- Vite CJS Node API deprecation warning is from the current uni-app/Vite toolchain.
- H5 ad slots are visual placeholders only.
