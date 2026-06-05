# Android App-base Smoke Result

Last updated: 2026-06-05

## Current Result Summary

Current status: partial pass.

The latest rebuilt Android custom base has been launched on a real device. The startup image check passed after switching to validated `.9.png` splash assets.

Full functional App-base smoke is still pending. Use this file to record the next real-device run against `docs/ANDROID_APP_BASE_SMOKE.md`.

## Verified

### H5 State Smoke

Status: pass by automated H5 smoke.

Observed result:

- Unit setting persists after reload.
- Restored Imperial units also restore valid converted height and weight defaults.
- BMI calculation still creates records after unit restoration.
- Target weight persists and renders in Records.
- Progress summary renders saved-count and total-change state.
- Record filters render and update Records summary/list.
- Record edit saves weight/BMI changes locally.
- Reminder rhythm persists as a local preference.
- Guidance renders target checkpoint and recent movement.
- Fake ad placeholder renders, closes, toggles off, and records local counters.
- Max saved records setting trims the Records list.
- Weight Trend / BMI Trend switching renders the expected chart mode title.
- Clear local data stays empty after reload.

### Startup Image

Status: pass.

Observed result:

- Android custom base launches successfully.
- Splash image is no longer stretched or compressed.
- Center icon remains visually stable.
- Current manifest points to `.9.png` startup images:
  - `static/brand/fitcal-splash-480x762.9.png`
  - `static/brand/fitcal-splash-720x1242.9.png`
  - `static/brand/fitcal-splash-1080x1882.9.png`

### Manifest Baseline

Status: pass by local scan.

Observed result:

- `modules` is empty.
- Android `permissions` is empty.
- `sdkConfigs` is empty.
- Push / UniPush / GtPush is not configured in the current manifest.
- Current MVP keeps ad placement as visual placeholders only.

## Pending Device Checks

Run these on the Android custom base before adding new feature work:

1. BMI flow:
   - height numeric keyboard
   - weight numeric keyboard
   - calculate BMI
   - BMI calculation creates a Records entry
2. Calories flow:
   - age numeric keyboard
   - sex/activity/goal controls
   - result cards update correctly
   - ad area remains a placeholder
3. Guidance flow:
   - daily target is visible
   - macro visual remains aligned
   - 7-day guide CTA does not trigger rewarded ads
4. Records flow:
   - add record
   - delete record
   - switch Weight Trend / BMI Trend
   - chart line, dots, labels, and axis text stay inside the card
   - record and chart limits behave correctly
5. Settings and policy:
   - unit setting persists
   - saved-record limit persists
   - chart sample limit persists
   - Privacy Policy opens and native Back returns to Settings
   - Disclaimer opens and native Back returns to Settings
   - Clear local data persists after restart

## Fail Conditions

Treat the App-base smoke as failed if any of these appear:

- startup image stretches or compresses again
- numeric input is unreliable
- Records chart overflows, clips, or becomes unreadable
- native Back traps the user
- local records/settings are lost after restart
- unexpected Android permission prompt appears
- `[GtPush] register fail` appears after rebuilding from the current manifest
- real ad SDK behavior, consent flow, or network ad loading appears

## Latest Local Verification

Local verification passed on 2026-06-05:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run smoke:h5
npm run build:h5
```

Notes:

- `typecheck` passed.
- H5 smoke passed with tab, route, record, trend-mode, settings persistence, record-limit, clear-data, policy-route, and ad-placeholder checks.
- H5 build passed.
- Build still prints the known uni-app / Vite CJS deprecation warning.
