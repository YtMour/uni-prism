# Next Steps

Last updated: 2026-06-04

## Priority Order

The current priority is to harden the implemented MVP before adding new monetization or expansion features.

## P0: Stabilize Current MVP

Goal:

Keep the app usable on H5 and Android App base while reducing implementation risk.

Tasks:

1. Add route-level smoke coverage after component split.
2. Refine validation copy and keyboard behavior on Android App base.
3. Run the Android App base smoke checklist on a real device.
4. Add individual record editing only if user testing shows it is needed.
5. Confirm Android App base behavior on a real device.

Verification:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run build:h5
npm run dev:h5
```

Manual smoke test:

- BMI calculates from metric inputs.
- BMI Calculate writes a linked Records entry.
- Unit switch converts values.
- Calories calculates after changing age/sex/activity/goal.
- Guidance uses the current daily target.
- Add Record adds a local record.
- Delete Record removes one record and updates the trend.
- Records Current/BMI summary cards match the latest saved record.
- Records list respects the configured saved-record limit.
- Clear local data removes records and stays empty after refresh.
- Records trend reflects local weight/BMI records.
- Invalid height, weight, and age values show page-level field errors.
- Privacy Policy and Disclaimer open as dedicated pages.
- Bottom navigation remains fixed and icons render.

## Next Implementation Slice

Recommended order:

1. Add a smoke script for:
   - `/pages/index/index`
   - `/pages/policy/policy?type=privacy`
   - `/pages/policy/policy?type=disclaimer`
   - BMI Calculate creates a Records entry
   - Records Delete removes one entry
2. Android App base check:
   - numeric keyboard behavior
   - policy page back navigation
   - record add/delete persistence
   - safe-area bottom navigation
   - use `docs/ANDROID_APP_BASE_SMOKE.md`
3. Fix only issues exposed by H5 smoke or Android App-base smoke.
4. Then start P1 compliance cleanup.
5. Keep monetization as placeholder-only until App-base smoke and compliance wording are stable.

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

1. Keep a reusable ad placeholder component.
2. Keep placeholder mode for H5/dev.
3. Do not add production ad SDK dependencies yet.
4. Do not add rewarded guide unlock behavior yet.
5. Revisit adapter interfaces after MVP smoke and compliance checks are stable.

Verification:

- App remains usable with placeholders only.
- No ad appears before the first useful result.
- No calculator, guidance, or record flow depends on ad loading.

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
