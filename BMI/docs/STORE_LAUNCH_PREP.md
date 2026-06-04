# FitCal Store Launch Prep

Last updated: 2026-06-04

## Current Release Posture

FitCal 1.0 is an offline-first wellness calculator MVP.

Current build assumptions:

- No account system.
- No backend upload for calculator records.
- No production ad SDK.
- Ad placements are placeholders only.
- Android manifest permissions are empty.
- Records and settings are stored locally on the device.

This document prepares store copy and data-safety answers for the current MVP only. Revisit it before adding analytics, real ads, cloud sync, purchases, reminders, or AI-generated guidance.

## Store Listing Copy

### App Name

```text
FitCal
```

### Store Title

```text
FitCal: BMI & Calorie Tracker
```

### Short Description

```text
Calculate BMI, estimate daily calories, and track weight trends locally.
```

### Subtitle Options

Option A:

```text
BMI, BMR, TDEE, and simple weight tracking
```

Option B:

```text
Simple wellness estimates with local records
```

Option C:

```text
Quick BMI and calorie estimates
```

### Long Description

```text
FitCal is a simple wellness calculator for BMI, daily calorie estimates, and local weight tracking.

Use FitCal to:

- Calculate BMI from height and weight
- See a general BMI category and healthy weight range
- Estimate BMR, TDEE, and daily calorie target
- Choose a basic goal: maintain, lose, or gain
- Review simple diet guidance for everyday planning
- Save recent weight and BMI records locally
- View local weight and BMI trends
- Switch between metric and imperial units
- Clear local records from Settings

FitCal is designed for quick everyday reference. It does not require an account, and the current MVP stores records on your device only.

FitCal provides general wellness estimates for informational purposes. It is not medical advice and does not diagnose, treat, cure, or prevent any disease or medical condition. Speak with a qualified health professional before making major diet, weight, or activity changes.
```

## Keyword Direction

Primary:

- BMI calculator
- calorie calculator
- BMR calculator
- TDEE calculator
- weight tracker

Secondary:

- healthy weight range
- diet guidance
- fitness calculator
- local weight record
- metric imperial BMI

Avoid:

- guaranteed weight loss
- medical diagnosis
- disease treatment
- clinical nutrition
- doctor replacement

## Screenshot Plan

Use screenshots from the current UI only after H5 and Android App-base smoke pass.

Recommended sequence:

1. BMI Calculator
   - Show BMI value, category, and healthy range.
2. Calories
   - Show BMR, TDEE, and daily target.
3. Guidance
   - Show daily target, macro visual, and meal focus.
4. Records
   - Show weight/BMI trend and recent records.
5. Settings
   - Show units, record limits, privacy, disclaimer, and clear local data.

Screenshot copy overlays, if used, should avoid medical promises. Use simple labels such as:

- Quick BMI estimate
- Daily calorie target
- Simple meal guidance
- Local weight trends
- Privacy-first settings

## Data Safety Draft

These answers are for the current local-first MVP.

### Data Collection

Current answer:

```text
The app does not collect or transmit personal data to a FitCal server in the current MVP.
```

### Local Data

Data stored locally on device:

- Unit preference
- Weight records
- BMI records
- Record display settings
- Chart sample setting

Purpose:

- App functionality
- Local tracking
- User preferences

Deletion:

- Users can clear local records from Settings.
- Uninstalling the app should remove local app data according to platform behavior.

### Account Data

Current answer:

```text
No account is required.
```

### Location

Current answer:

```text
The app does not request location permission.
```

### Contacts

Current answer:

```text
The app does not request contacts or account access.
```

### Health Data

Use careful wording:

```text
Users may enter height, weight, age, sex, activity level, and goal locally to calculate wellness estimates. The current MVP stores weight and BMI records locally on the device and does not upload them to a server.
```

### Advertising ID / SDK Data

Current answer:

```text
The current MVP does not integrate a production ad SDK. Visible ad areas are placeholders only.
```

### Permissions

Current baseline:

```text
Android permissions are empty for the current MVP.
```

## Privacy Policy Alignment

The in-app Privacy Policy should continue to state:

- Records are local to the device.
- No account is required.
- Calculator records are not sent to a FitCal server.
- Users can clear local records from Settings.
- Current builds use ad placeholders only.
- Production ad SDK privacy wording must be reviewed before release if real ads are added.
- Android permissions are empty for the current MVP.

## Release Blockers

Do not prepare a release candidate until these are done:

- `npm run typecheck` passes.
- `npm run build:h5` passes.
- `npm run smoke:h5` passes.
- Android App-base smoke passes on a real device.
- Android manifest permissions remain empty or every added permission has a documented reason.
- App icon and splash assets are created under `FitCal-Uniapp/static/brand/`.
- Store screenshots are generated from the current UI.

## Next Store-Prep Tasks

1. Run Android App-base smoke with `docs/ANDROID_APP_BASE_SMOKE.md`.
2. Capture Android screenshots after device smoke passes.
3. Create app icon and splash assets.
4. Decide whether to publish with English-only UI or add i18n before release.
5. Re-check privacy/data-safety copy immediately before packaging.
