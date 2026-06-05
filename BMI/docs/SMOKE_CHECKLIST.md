# Smoke Checklist

Last updated: 2026-06-05

## Purpose

Use this checklist after UI/layout changes, route changes, or Android App base packaging work.

## H5 Route Smoke

Run inside `FitCal-Uniapp`:

```bash
npm run typecheck
npm run audit:i18n
npm run build:h5
npm run dev:h5
```

Check these routes:

- `http://localhost:5179/#/`
- `http://localhost:5179/#/pages/policy/policy?type=privacy`
- `http://localhost:5179/#/pages/policy/policy?type=disclaimer`

Expected:

- Home route renders FitCal tabs.
- Home header order is FitCal brand, active page title, active page subtitle, then a single announcement row.
- Header has enough top safe-area spacing on Android App base and does not collide with the native status/navigation area.
- Announcement uses one compact row; long announcement text scrolls horizontally instead of pushing content down.
- Main vertical gaps between segmented controls, input cards, primary actions, and result cards stay compact.
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

Guidance:

- Target checkpoint uses the saved target weight when present.
- Recent movement reflects local records.
- Reminder rhythm is controlled directly in Guidance and persists after refresh.
- 7-Day Guide opens, hides, and persists its open state after refresh.
- 7-Day Guide entries render as separated day cards/rows without text collision.
- 7-Day Guide changes after goal, activity, calorie target, target weight, reminder, or record context changes.
- Meal focus content remains visible and readable.

Records:

- Add Record adds one local record.
- Target weight can be entered and saved directly in Records.
- Records shows the currently visible records after Settings filters are applied.
- Record list never exceeds the configured saved-record limit.
- Current and BMI summary cards match the newest saved record.
- Trend dots and line update after add/delete.
- Trend chart line and dots stay inside the chart card on H5.
- Trend chart shows title, latest value, value range, Y-axis labels, and start/end date labels.
- Records has edit/delete controls for individual records and does not show CSV import/export controls.
- Clear local data empties the list and stays empty after refresh.

Settings:

- Unit switch updates BMI and Settings units.
- Language selector contains mainstream language options, changes the runtime UI language, and persists after refresh.
- Privacy Policy and Disclaimer pages follow the stored app language.
- Record filter controls All, Last 5, and BMI 25+ visible-record modes.
- Trend mode controls Weight Trend and BMI Trend display.
- Saved-record limit is controlled in Settings, and lowering it trims older records immediately.
- Chart sample setting is controlled in Settings and changes how many newest records feed the trend chart.
- Record management in Records can edit weight/BMI and delete records.
- Target weight remains a direct Records-page input.
- Local-data CSV export/import controls remain in Settings and do not overlap the CSV input on narrow screens.
- Reminder rhythm remains a direct Guidance-page input.
- Privacy Policy opens the dedicated privacy page.
- Disclaimer opens the dedicated disclaimer page.
- Clear local data removes records.
- Button/chip taps show a visible pressed state or in-app feedback toast.

Operations config:

- Release note and H5 version remain admin-only and do not render in the user app.
- Turning off test-announcement visibility hides the announcement from the user app even when the announcement text still exists in admin.
- Ad placeholder visibility only controls ad placeholders, not announcements.
- Android App base must fetch backend config from the LAN backend address, not `127.0.0.1`; current local default is `http://192.168.1.128:48791`.
- Android base status and App-base smoke status remain admin-only and never render in the user app.

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
- App launch does not log `Cannot read property 'setInterval' of undefined`; timers must use cross-platform globals, not `window.*`.
- Android manifest permissions remain empty for the local-first, ad-placeholder-only MVP.

## Known Non-Blocking Notes

- Vite CJS Node API deprecation warning is from the current uni-app/Vite toolchain.
- H5 ad slots are visual placeholders only.
