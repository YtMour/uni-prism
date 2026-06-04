# FitCal MVP Hardening Plan

Last updated: 2026-06-04

## Purpose

This plan turns the current FitCal MVP status into the next implementation sequence.

The goal is not to add broad new features yet. The next step is to make the existing offline calculator loop stable enough for Android App-base packaging, store-material preparation, and later monetization work.

## Current Verification Snapshot

Checked on 2026-06-04:

- `npm run typecheck` passes.
- `npm run build:h5` passes.
- H5 dev server returns HTTP 200 at `http://127.0.0.1:5179/`.
- H5 smoke confirmed the five tabs render:
  - BMI
  - Calories
  - Guidance
  - Records
  - Settings
- BMI calculation creates Records entries.
- Privacy Policy route renders.
- Disclaimer route renders.
- Browser runtime check found no blocking runtime error.

Observed non-blocking signal:

- Chromium reports a canvas readback performance warning during Records chart rendering. This is not a functional failure, but Records chart drawing should stay on the hardening watchlist.

## Confirmed Current Gaps

### P0: Android App-base Hardening

The H5 path is usable, but Android App-base still needs device confirmation.

Work items:

1. Run the full Android App-base smoke checklist from `docs/SMOKE_CHECKLIST.md`.
2. Confirm numeric keyboard behavior for height, weight, and age inputs.
3. Confirm Records canvas chart layout on device:
   - line stays inside card
   - dots stay inside card
   - Y-axis labels remain readable
   - X-axis labels do not overlap content
4. Confirm bottom navigation is not covered by safe area.
5. Confirm local persistence after app restart:
   - units
   - records
   - max saved records
   - chart sample limit
6. Confirm policy pages open and native Back returns cleanly.

Acceptance:

- Android App-base can complete BMI, Calories, Records, Settings, Privacy Policy, and Disclaimer flows without layout breakage or runtime error.

### P1: Route and Interaction Smoke Coverage

The current smoke checklist is documented, but the project does not yet have an automated route smoke script.

Work items:

1. Add a small H5 smoke script for:
   - home route
   - Privacy Policy route
   - Disclaimer route
   - BMI calculate to Records entry
   - Records delete
2. Save screenshots or console output only when useful for debugging.
3. Keep the script independent from Android packaging.

Acceptance:

- One command can catch broken H5 route navigation and core record interactions before manual App-base testing.

### P2: Compliance Cleanup Before Ads

Compliance should be tightened before ad SDK integration.

Work items:

1. Review `FitCal-Uniapp/manifest.json`.
2. Keep Android `permissions` empty during the local-first, ad-placeholder-only MVP.
3. Re-read Privacy Policy and Disclaimer against current behavior:
   - local-only records
   - no account
   - no backend
   - general wellness estimates only
4. Prepare store-safe short description, long description, and data safety notes.

Acceptance:

- Android manifest does not request unrelated sensitive permissions.
- Policy wording matches the actual MVP.
- Store copy avoids medical diagnosis, treatment, and guaranteed health-result claims.

### P3: Placeholder-Only Monetization Surface

Real ads should not be integrated during the current MVP hardening pass.

Work items:

1. Keep a reusable ad placeholder component for H5/dev.
2. Do not add production ad SDK dependencies yet.
3. Do not add rewarded video behavior yet.
4. Keep placeholders after useful results only:
   - after BMI result
   - after calorie result
   - after guidance content
5. Revisit adapter interfaces only after App-base smoke and compliance copy are stable.

Acceptance:

- The app remains fully useful because there is no ad loading dependency.
- Placeholder locations are visible enough for layout planning.
- Production ad SDK integration remains a later, separate milestone.

### P4: Retention Features

Only start these after the MVP hardening loop is stable.

Work items:

1. Target weight setting.
2. Progress summary from local records.
3. Optional record editing.
4. Record filters if the record list becomes dense.
5. Optional reminders after Android release behavior is stable.

Acceptance:

- Retention features improve repeat use without increasing first-use complexity.

## Recommended Next Execution Order

1. Add automated H5 smoke script for routes, BMI-to-record, and record deletion.
2. Run Android App-base smoke manually with `docs/SMOKE_CHECKLIST.md`.
3. Fix only App-base issues found by smoke testing.
4. Review manifest and policy/store wording.
5. Keep only ad placeholders during the current MVP hardening pass.
6. Prepare Android icon, splash, screenshots, and package verification.

## Files To Revisit Next

- `FitCal-Uniapp/pages/index/index.vue`
- `FitCal-Uniapp/components/BmiScreen.vue`
- `FitCal-Uniapp/components/CaloriesScreen.vue`
- `FitCal-Uniapp/components/RecordsScreen.vue`
- `FitCal-Uniapp/components/SettingsScreen.vue`
- `FitCal-Uniapp/pages/policy/policy.vue`
- `FitCal-Uniapp/manifest.json`
- `docs/SMOKE_CHECKLIST.md`
- `docs/COMPLIANCE_NOTES.md`
- `docs/MONETIZATION_PLAN.md`
