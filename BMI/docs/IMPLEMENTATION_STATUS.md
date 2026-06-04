# Implementation Status

Last updated: 2026-06-04

## Current Summary

FitCal has a runnable uni-app MVP under `FitCal-Uniapp`.

The current app is a local-first wellness utility with five tabs: BMI, Calories, Guidance, Records, and Settings. The default uni-app template screen and logo have been removed. The app now uses TypeScript entrypoints and modular services for calculator logic, local storage, static app data, policy text, and shared domain types.

## Completed

### Product and Design

- App name selected: FitCal
- Store title selected: FitCal: BMI & Calorie Tracker
- Initial product positioning defined
- MVP feature categories defined
- Visual style guide created
- 5-screen design board and detailed screen PNGs generated
- Monetization strategy drafted
- Compliance notes drafted

### App Foundation

- uni-app project scaffold under `FitCal-Uniapp`
- Vue 3 runtime configured
- H5 dev/build scripts configured
- TypeScript entrypoint: `main.ts`
- TypeScript Vite config: `vite.config.ts`
- TypeScript config: `tsconfig.json`
- Minimal uni global declarations: `env.d.ts`
- Default template page and default logo removed

### Modular Code Structure

- Shared domain types: `types/fitcal.ts`
- Static app data: `data/appData.ts`
- Calculator services: `services/calculators.ts`
- Local storage services: `services/storage.ts`
- Policy text service: `services/policy.ts`
- Feature screen components under `components/`
- SVG icon assets under `static/icons`

### MVP User Flows

- BMI calculator UI and logic
- Metric/imperial unit switching
- Healthy weight range calculation
- BMI category badge
- BMI calculation saves a local weight/BMI snapshot
- Calorie calculator UI and logic
- BMR/TDEE/daily target output
- Height, weight, and age validation states
- Goal-based guidance summary
- Macro split visual display
- Meal focus suggestions
- Local record list
- Add Record action
- Individual record delete action
- Configurable saved-record limit
- Configurable chart-sample limit
- Records Current/BMI summary linked to the latest saved record
- Data-driven weight/BMI trend chart rendered with canvas for H5/App-base stability
- Trend chart labels for title, latest value, value range, Y-axis marks, and start/end dates
- Clear local data action with persistent empty state
- Settings page shell
- Settings controls for record retention and chart sampling
- Dedicated Privacy Policy page and Settings entry point
- Dedicated Disclaimer page and Settings entry point
- Ad slot visual placeholders after useful content
- Fixed bottom navigation and improved icon rendering

## Partial / Needs Hardening

- Guidance content is simple static guidance; it is not expanded by BMI category or detailed goal state yet.
- Language setting is a placeholder; no i18n dictionary or runtime language switching yet.
- Ad slots are placeholders; no real ad abstraction or platform SDK integration yet.
- Input validation covers height, weight, and age ranges, but field-specific UX can still be refined for platform keyboards and copy.
- Five tabs are split into feature screen components, while shared state remains in `pages/index/index.vue`.
- App-base/Android smoke testing is in progress via user device checking, but no packaged Android build has been verified yet.

## Not Started

- i18n dictionary and language switching
- Real ad component abstraction
- Production ad SDK integration
- Rewarded video unlock flow
- Individual record edit
- Reminder settings
- Target weight setting
- App icon and splash assets
- Store listing screenshots and copy
- Android package build verification
- iOS validation

## Verification

Latest verified in `FitCal-Uniapp`:

```bash
npm run typecheck
npm run build:h5
```

Runtime checked:

- H5 app opened at `http://localhost:5179/`
- Five bottom tabs rendered
- BMI screen rendered after TypeScript migration
- Records trend chart renders inside its card with canvas and does not overflow in H5
- Records trend chart shows title, latest value, range, Y-axis labels, and start/end date labels
- Browser console showed no runtime errors during verification

App-base feedback:

- HBuilder App base showed the previous CSS-transform chart could overflow and break line segments.
- The Records chart has been changed to canvas rendering to avoid App WebView percentage/transform drift.
- HBuilder App base needs a follow-up visual check to confirm the canvas fix on device.

Known build notes:

- Vite prints a CJS Node API deprecation warning from the uni-app toolchain.
- npm audit reports upstream dependency vulnerabilities from the uni-app dependency tree; this has not blocked local H5 build verification.

## Current Source Of Truth

- Implementation overview: `docs/IMPLEMENTATION_OVERVIEW.md`
- Project status and plan: `docs/PROJECT_STATUS_AND_PLAN.md`
- Current status: this file
- Next implementation sequence: `docs/IMPLEMENTATION_ROADMAP.md`
- Feature behavior target: `docs/FEATURE_SPEC.md`
- Smoke checklist: `docs/SMOKE_CHECKLIST.md`
- Visual target: `docs/design/FITCAL_VISUAL_STYLE_GUIDE.md`

## Immediate Next Step

1. Add route-level smoke coverage for Settings policy navigation and Records deletion.
2. Refine validation UX for Android App base keyboards and edge cases.
3. Add Android App base smoke checklist and run it on device.
4. Add individual record edit controls if retention testing needs them.
5. Start ad slot abstraction only after MVP smoke checks stay stable.

## Decision Log

### 2026-06-04

Decision: use `FitCal` as the app name and `FitCal: BMI & Calorie Tracker` as the overseas store title.

Reason:

- Short and memorable
- Covers both fitness and calorie calculation
- Does not limit the product to BMI only
- Suitable for later weight tracking, diet guidance, and monetization expansion

### 2026-06-04

Decision: keep MVP local-first and offline.

Reason:

- Lower implementation cost
- Easier privacy compliance
- Better first-use speed
- No backend dependency for initial launch

### 2026-06-04

Decision: use ads after the user receives core calculation value.

Reason:

- Improves retention
- Reduces review risk
- Keeps the tool experience usable

### 2026-06-04

Decision: migrate app logic from JavaScript to TypeScript and modularize calculation/storage/data concerns before continuing feature growth.

Reason:

- Reduces risk as the page grows
- Makes calculator and storage behavior easier to test
- Keeps UI code focused on presentation and event binding
