# Android App-base Smoke Guide

Last updated: 2026-06-05

## What This Means

Android App-base smoke is a quick real-device check using the HBuilderX / uni-app Android App runtime.

It is not a formal release package test. It is used before packaging to confirm that the current H5-working MVP also behaves correctly inside the Android WebView/runtime, especially where desktop H5 cannot fully represent native behavior.

## Why It Matters

H5 smoke can confirm routes, text, layout, and basic interaction. Android App-base smoke checks the parts that commonly differ on device:

- numeric keyboard behavior
- native Back behavior
- WebView canvas layout
- bottom safe area
- local storage after app restart
- Android manifest permissions
- tap targets and scrolling feel

## Before Running

Local verification should pass first:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run audit:i18n
npm run build:h5
npm run smoke:h5
```

Current MVP permission baseline:

- `FitCal-Uniapp/manifest.json` keeps Android `permissions` empty.
- The app is local-first.
- Ads are placeholders only.
- No production ad SDK is integrated.
- Startup image uses validated `.9.png` files and has already been confirmed not stretched in a rebuilt custom base.

Record the actual device run in:

- `docs/ANDROID_APP_BASE_SMOKE_RESULT.md`

## Device Smoke Steps

### 1. Launch

Open the app on an Android device through HBuilderX / uni-app App-base.

Expected:

- FitCal opens without a template logo page.
- Startup image is not stretched or compressed.
- BMI tab is the first screen.
- Bottom navigation is visible and not covered by the system safe area.
- Top announcement appears only when the backend test-announcement switch is enabled; H5 version, release note, Android base status, and App-base smoke status do not appear in the user app.

### 2. BMI

Steps:

1. Tap Height.
2. Confirm a numeric keyboard appears.
3. Tap Weight.
4. Confirm a numeric keyboard appears.
5. Tap Calculate BMI.
6. Switch to Records.

Expected:

- BMI value updates.
- BMI category remains readable.
- Healthy range remains readable.
- A new Records entry appears.
- Invalid values show field errors instead of stale results.

### 3. Calories

Steps:

1. Open Calories.
2. Tap Age.
3. Confirm a numeric keyboard appears.
4. Change sex, activity, and goal.
5. Tap Calculate Calories.

Expected:

- BMR, TDEE, and Daily target update.
- Result-page ad placeholder remains a simple placeholder.
- No real ad, network ad load, or SDK consent flow appears.

### 4. Guidance

Steps:

1. Open Guidance.
2. Scroll through the page.

Expected:

- Daily target is visible.
- Macro visual and meal suggestions remain aligned.
- Guidance ad placeholder remains a simple placeholder.
- Unlock 7-Day Guide is only a CTA placeholder and does not trigger rewarded ads.

### 5. Records

Steps:

1. Add several records.
2. Delete one record.
3. Switch between Weight Trend and BMI Trend.
4. Change max saved records and chart samples from Settings.
5. Return to Records.

Expected:

- Add/delete persists in the list.
- Trend line and dots stay inside the chart card.
- Y-axis labels are readable.
- X-axis labels do not overlap the trend line.
- Chart sample limit never exceeds saved-record limit.

### 6. Settings and Policy Pages

Steps:

1. Open Settings.
2. Switch units.
3. Open Privacy Policy.
4. Use native Back.
5. Open Disclaimer.
6. Use native Back.
7. Clear local data.
8. Restart the app.

Expected:

- Unit preference persists.
- Policy pages open without bottom tabs.
- Native Back returns to Settings.
- Clear local data leaves Records empty after restart.

### 7. Manifest Check

Expected:

- Android permissions remain empty for this MVP.
- The app does not request camera, account, phone state, WiFi management, log access, or system settings permissions.
- Push / UniPush / GtPush is not enabled in `manifest.json`.
- Custom-base startup images use validated `.9.png` files.

## Pass / Fail Rule

Pass:

- All core flows complete on the device.
- No layout break blocks use.
- No unexpected Android permission request appears.
- No real ad SDK behavior appears.

Fail:

- Numeric input cannot be entered reliably.
- Records chart overflows or becomes unreadable.
- Native Back traps the user.
- Local records/settings are lost after restart.
- Any sensitive Android permission appears without a feature requiring it.
- `[GtPush] register fail` appears after rebuilding a custom base from the current manifest.

## If Issues Are Found

Record:

- Device model
- Android version
- HBuilderX / uni-app runtime version
- Exact screen and step
- Screenshot or short screen recording if possible

Then fix only the failing behavior before adding new product features.
