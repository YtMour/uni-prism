# Next Steps

Last updated: 2026-06-05

## Priority Order

The current priority is to harden the implemented MVP before adding new monetization or expansion features.

Internal operational data now belongs in the separated admin stack, not in the user-facing app.

## P0: Stabilize Current MVP

Goal:

Keep the app usable on H5 and Android App base while reducing implementation risk.

Tasks:

1. Keep route and state smoke coverage passing after each code slice.
2. Refine validation copy and keyboard behavior on Android App base.
3. Run the Android App base smoke checklist on a real device.
4. Expand record editing only if weight/BMI editing is not enough in testing.
5. Confirm Android App base behavior on a real device.
6. Keep Go backend, React admin, and Docker startup passing after each admin change.

Verification:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run audit:i18n
npm run build:h5
npm run dev:h5
```

Admin/backend verification:

```bash
cd FitCal-Backend
go test ./...
```

```bash
cd FitCal-Admin
npm run build
```

```bash
docker compose up -d --build
```

Manual smoke test:

- BMI calculates from metric inputs.
- BMI Calculate writes a linked Records entry.
- Unit switch converts values.
- Restored unit preference keeps matching valid inputs after reload.
- Calories calculates after changing age/sex/activity/goal.
- Guidance uses the current daily target.
- Guidance shows target checkpoint and recent movement.
- Guidance 7-day guide opens, hides, stays in the selected state after reload, and changes with goal/activity/calorie/target/record context.
- Add Record adds a local record.
- Delete Record removes one record and updates the trend.
- Edit Record updates weight/BMI locally.
- Records Current/BMI summary cards match the latest saved record.
- Target weight saves locally and appears in Records.
- Progress summary reflects local record count and total change.
- Record filters update the list and progress summary.
- Reminder rhythm is a local preference and does not request notification permission.
- Language selector changes the runtime UI, persists locally, and keeps policy/disclaimer pages aligned with the selected language.
- Fake ad placeholder can be shown and closed in the app.
- Internal fake ad metrics are viewed in the admin dashboard, not in user Settings.
- Admin activity metrics show anonymous DAU, MAU, test retention, sessions, calculations, record writes, and ad engagements.
- Admin test metrics persist to local JSON and show a 7-day activity trend.
- Admin operations config can control ad placeholder visibility and App-base smoke status.
- User-visible operations config is limited to ad placeholder visibility and short test announcements.
- H5 version and release notes stay admin-only; the user app only shows the independent test announcement when explicitly enabled.
- Records list respects the configured saved-record limit.
- Records trend can switch between Weight Trend and BMI Trend.
- Clear local data removes records and stays empty after refresh.
- Records trend reflects local weight/BMI records.
- Invalid height, weight, and age values show page-level field errors.
- Privacy Policy and Disclaimer open as dedicated pages.
- Bottom navigation remains fixed and icons render.

## Next Implementation Slice

Recommended order:

1. Finish Android App base functional check:
   - numeric keyboard behavior
   - policy page back navigation
   - record add/delete persistence
   - safe-area bottom navigation
   - use `docs/ANDROID_APP_BASE_SMOKE.md`
   - record the result in `docs/ANDROID_APP_BASE_SMOKE_RESULT.md`
2. Confirm Records canvas chart on device.
3. Capture Android screenshots after device smoke passes.
4. Fix only issues exposed by Android App-base smoke.
5. Browser-check the admin dashboard at `http://localhost:48792/`.
6. Run a language pass on Android App-base:
   - Simplified Chinese main tabs
   - Settings picker
   - Privacy/Disclaimer routes
   - translated text fit on narrow devices
7. Keep monetization as placeholder-only until package smoke and compliance wording are stable.

Detailed plan:

- `docs/MVP_HARDENING_PLAN.md`

## P1: Compliance and Trust

Goal:

Make the app safer for store review before ad SDK integration.

Tasks:

1. Add real Privacy Policy page.
2. Add real Disclaimer page.
3. Ensure wording avoids medical claims.
4. Confirm local data behavior matches privacy text.
5. Remove unnecessary Android permissions before packaging.

Verification:

- Privacy page states local-only MVP behavior.
- Disclaimer says results are general wellness estimates.
- Store copy avoids medical diagnosis/treatment claims.
- Android manifest does not request unrelated sensitive permissions.

## P2: Monetization Foundation

Goal:

Reserve ad layout positions without integrating real ads yet.

Tasks:

1. Keep fake ad placeholder mode for H5/dev layout testing.
2. Keep fake ad counters in the internal admin dashboard.
3. Do not add production ad SDK dependencies yet.
4. Do not add rewarded guide unlock behavior yet.
5. Revisit adapter interfaces after MVP smoke and compliance checks are stable.

Verification:

- App remains usable with placeholders only.
- Fake ad close/toggle behavior works without network calls.
- Admin shows fake ad metrics through the backend summary API.
- Admin shows anonymous activity metrics through the backend summary API.
- Admin can reset local test metrics without changing user-device local records.
- User app reads backend config before rendering fake ad placeholders.
- User app polls backend config so admin changes are visible without a page restart.

## Suggested Optimization Path

1. Finish Android App-base smoke and record exact pass/block status in the admin config.
2. Add a small App-base smoke result form to the admin dashboard so test outcomes are not only free text.
3. Extend the existing `npm run audit:i18n` script into a broader missing-key audit before adding more screens.
4. Keep using fake ad placeholders until the Android package flow is stable.
5. Add an ad adapter interface before integrating a real SDK.
6. Add local CSV export/import only after the record model stabilizes.
7. Only after package smoke and consent/privacy wording are stable, evaluate production analytics or real ad SDK metrics.
8. Replace JSON persistence with SQLite or another small embedded store only when local JSON becomes limiting.
- No ad appears before the first useful result.
- No calculator, guidance, or record flow depends on ad loading.

## P3: Retention

Goal:

Increase repeat use after the core calculator loop is stable.

Tasks:

1. Data-driven trend chart.
2. Native notification reminders only after Android package smoke and permission review.
3. Expand target-progress copy after user testing.
4. Add record editing only if testing shows add/delete is not enough.
5. Add streak/check-in summary only if it improves repeat use without adding permissions.
6. Add local export/import before cloud backup.

Verification:

- Trend reflects local records.
- Target settings are stored locally.
- Progress summary reflects local records.
- Record filters affect Records list and summary.
- Reminder rhythm is explicit and optional.

## P4: Store Launch

Goal:

Prepare a first Android release candidate.

Tasks:

1. Store screenshots.
2. Store title and descriptions.
3. Android build package.
4. Install and smoke test package.
5. Final data-safety review.

Verification:

- Android package installs.
- Core flows work offline.
- Store assets match current UI.
- Privacy/disclaimer are accessible.
