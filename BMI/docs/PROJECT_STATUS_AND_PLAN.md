# FitCal Project Status and Plan

Last updated: 2026-06-04

## Current Stage

FitCal is now a runnable local-first uni-app MVP for H5 and Android App-base validation.

The MVP has moved past static planning. It includes calculator logic, local records, settings, dedicated policy pages, componentized screens, canvas-based trend rendering, and documented smoke checks.

## Completed

### Product and Planning

- Product name: FitCal
- Store title: FitCal: BMI & Calorie Tracker
- Product positioning: overseas wellness calculator, not a medical diagnosis tool
- Product plan, monetization plan, compliance notes, feature spec, roadmap, and visual style guide
- Five-screen visual direction and rendered design PNGs

### App Foundation

- uni-app project scaffolded under `FitCal-Uniapp`
- Vue 3 + TypeScript + Vite app foundation
- H5 dev/build scripts
- Custom FitCal app shell and fixed bottom navigation
- Default uni-app template removed
- Shared domain types, static data, calculator service, storage service, and policy service
- Feature screen components:
  - `components/BmiScreen.vue`
  - `components/CaloriesScreen.vue`
  - `components/GuidanceScreen.vue`
  - `components/RecordsScreen.vue`
  - `components/SettingsScreen.vue`

### BMI Flow

- Metric/imperial unit switch
- Height and weight input
- BMI calculation
- BMI category badge
- Healthy weight range
- Field-level validation for height and weight
- Invalid result placeholder to avoid stale or impossible values
- Successful BMI calculation writes a local record

### Calories Flow

- Sex, age, activity, and goal controls
- BMR, TDEE, and daily target calculation
- Age validation
- Result-page ad placeholder after useful result

### Guidance Flow

- Goal-based title and daily target
- Macro split visual
- Meal focus suggestions
- Guidance ad placeholder after useful content
- Optional 7-day guide CTA placeholder

### Records Flow

- Local records list
- Add Record and individual Delete
- BMI Calculate and Add Record share the same snapshot behavior
- Current/BMI summary cards read from the latest saved record
- Clear local data persists an empty state
- Configurable saved-record limit: 5, 10, 20, 50
- Configurable chart sample limit: 5, 10, 20
- Chart sample limit is constrained by saved-record limit
- Canvas-based weight/BMI trend chart for H5/App-base stability
- Chart title, latest value, value range, Y-axis labels, and start/end date labels

### Settings and Compliance

- Unit preference setting
- Record retention and chart sampling settings
- Dedicated Privacy Policy page
- Dedicated Disclaimer page
- Local-first privacy wording
- Clear local data action
- Language placeholder

### Verification

Latest verified commands:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run build:h5
```

Latest H5 checks:

- Five tabs render
- BMI calculation creates linked Records entries
- Records list respects configured saved-record limit
- Chart sample setting controls trend sample size
- Canvas trend chart stays inside the chart card
- Trend labels are visible
- Privacy and Disclaimer routes render
- Browser console has no runtime errors during checked flows

## Partial / Needs Hardening

- Android App-base visual and interaction smoke is still pending final confirmation.
- Numeric keyboard behavior needs App-base verification.
- Records canvas chart was changed after App-base feedback and should be rechecked on device.
- Guidance remains simple and static.
- Language setting is a placeholder; no i18n dictionary exists yet.
- Ad slots are visual placeholders; no ad abstraction or SDK integration exists yet.
- Shared state still lives in `pages/index/index.vue`; this is acceptable for MVP but may need a store if the app expands.
- Record editing is not implemented; only add/delete exists.

## Not Started

- i18n dictionary and runtime language switching
- Real ad slot abstraction
- Production ad SDK integration
- Rewarded video unlock flow
- Target weight setting
- Progress summary
- Record filters
- Optional reminders
- App icon and splash assets
- Store listing screenshots and copy
- Android package build verification
- iOS validation

## Immediate Next Plan

### P0: Finish MVP Smoke Hardening

1. Run Android App-base smoke with `docs/SMOKE_CHECKLIST.md`.
2. Confirm Records canvas chart renders correctly on device.
3. Confirm numeric keyboard behavior for height, weight, and age.
4. Confirm local storage survives App restart:
   - units
   - records
   - saved-record limit
   - chart sample limit
5. Confirm policy page navigation and Back behavior in App-base.
6. Refine validation copy or input behavior only if App-base smoke exposes issues.

### P1: Compliance and Trust

1. Review Android manifest and remove unrelated sensitive permissions.
2. Confirm Privacy Policy text matches actual local-only behavior.
3. Confirm Disclaimer avoids medical claims.
4. Prepare store-safe short and long descriptions.
5. Decide whether language switching is required before first release.

### P2: Monetization Foundation

1. Create an ad slot component abstraction.
2. Keep H5/dev placeholder mode.
3. Add platform adapter interface.
4. Preserve the rule that ads appear only after useful calculation results.
5. Prototype rewarded guide unlock state without real SDK dependency.

### P3: Retention

1. Add target weight setting.
2. Add simple progress summary.
3. Add record filters if history grows beyond MVP usage.
4. Consider reminders only after core flows are stable on Android.

### P4: Store Launch

1. Prepare app icon and splash assets.
2. Generate store screenshots from current UI.
3. Build Android package.
4. Install and smoke test package.
5. Finalize store listing copy and data safety notes.

## Current Source Files

- Main page and shared state: `FitCal-Uniapp/pages/index/index.vue`
- Policy page: `FitCal-Uniapp/pages/policy/policy.vue`
- Feature components: `FitCal-Uniapp/components/`
- Calculator logic: `FitCal-Uniapp/services/calculators.ts`
- Storage logic: `FitCal-Uniapp/services/storage.ts`
- Policy content: `FitCal-Uniapp/services/policy.ts`
- Static options: `FitCal-Uniapp/data/appData.ts`
- Shared types: `FitCal-Uniapp/types/fitcal.ts`
- Smoke checklist: `docs/SMOKE_CHECKLIST.md`
