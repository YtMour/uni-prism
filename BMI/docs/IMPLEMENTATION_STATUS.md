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
- SVG icon assets under `static/icons`

### MVP User Flows

- BMI calculator UI and logic
- Metric/imperial unit switching
- Healthy weight range calculation
- BMI category badge
- Calorie calculator UI and logic
- BMR/TDEE/daily target output
- Goal-based guidance summary
- Macro split visual display
- Meal focus suggestions
- Local record list
- Add Record action
- Clear local data action
- Settings page shell
- Privacy Policy modal entry point
- Disclaimer modal entry point
- Ad slot visual placeholders after useful content
- Fixed bottom navigation and improved icon rendering

## Partial / Needs Hardening

- Records trend chart is currently visual/static; it is not data-driven yet.
- Guidance content is simple static guidance; it is not expanded by BMI category or detailed goal state yet.
- Privacy Policy and Disclaimer are modal text, not dedicated pages.
- Language setting is a placeholder; no i18n dictionary or runtime language switching yet.
- Ad slots are placeholders; no real ad abstraction or platform SDK integration yet.
- Input validation is minimal; impossible age/height/weight values need explicit error states.
- Five tabs are currently implemented in one `index.vue`; feature components or route-level pages should be introduced as scope grows.
- App-base/Android smoke testing is in progress via user device checking, but no packaged Android build has been verified yet.

## Not Started

- Dedicated Privacy Policy page
- Dedicated Disclaimer page
- i18n dictionary and language switching
- Real ad component abstraction
- Production ad SDK integration
- Rewarded video unlock flow
- Data-driven trend chart
- Individual record edit/delete
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
- Browser console showed no runtime errors during verification

Known build notes:

- Vite prints a CJS Node API deprecation warning from the uni-app toolchain.
- npm audit reports upstream dependency vulnerabilities from the uni-app dependency tree; this has not blocked local H5 build verification.

## Current Source Of Truth

- Implementation overview: `docs/IMPLEMENTATION_OVERVIEW.md`
- Current status: this file
- Next implementation sequence: `docs/IMPLEMENTATION_ROADMAP.md`
- Feature behavior target: `docs/FEATURE_SPEC.md`
- Visual target: `docs/design/FITCAL_VISUAL_STYLE_GUIDE.md`

## Immediate Next Step

1. Split the large `pages/index/index.vue` into feature components while preserving the current UI.
2. Add dedicated Privacy Policy and Disclaimer pages.
3. Bind Records trend chart to local record data.
4. Add validation states for numeric inputs.
5. Run Android App base smoke verification after each UI/layout change.

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
