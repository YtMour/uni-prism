# Next Steps

Last updated: 2026-06-04

## Priority Order

The current priority is to harden the implemented MVP before adding new monetization or expansion features.

## P0: Stabilize Current MVP

Goal:

Keep the app usable on H5 and Android App base while reducing implementation risk.

Tasks:

1. Split `pages/index/index.vue` into smaller feature components.
2. Add input validation for height, weight, and age.
3. Add clear user-facing error states.
4. Replace static Records chart with data-driven chart rendering.
5. Add dedicated Privacy Policy and Disclaimer pages.
6. Confirm Android App base behavior on a real device.

Verification:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run build:h5
npm run dev:h5
```

Manual smoke test:

- BMI calculates from metric inputs.
- Unit switch converts values.
- Calories calculates after changing age/sex/activity/goal.
- Guidance uses the current daily target.
- Add Record adds a local record.
- Clear local data removes records.
- Privacy Policy and Disclaimer open.
- Bottom navigation remains fixed and icons render.

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

Prepare ads without damaging the calculator flow.

Tasks:

1. Create an ad slot component.
2. Create a platform adapter interface.
3. Keep placeholder mode for H5/dev.
4. Add result-page and guidance-page ad slots through the abstraction.
5. Add rewarded guide unlock state without real SDK dependency first.

Verification:

- App remains usable when ad adapter returns unavailable.
- No ad appears before the first useful result.
- Rewarded content is optional.

## P3: Retention

Goal:

Increase repeat use after the core calculator loop is stable.

Tasks:

1. Data-driven trend chart.
2. Target weight.
3. Progress summary.
4. Record filters.
5. Optional reminders.

Verification:

- Trend reflects local records.
- Target settings are stored locally.
- Reminder setting is explicit and optional.

## P4: Store Launch

Goal:

Prepare a first Android release candidate.

Tasks:

1. App icon.
2. Splash assets.
3. Store screenshots.
4. Store title and descriptions.
5. Android build package.
6. Install and smoke test package.

Verification:

- Android package installs.
- Core flows work offline.
- Store assets match current UI.
- Privacy/disclaimer are accessible.
