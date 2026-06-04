# Implementation Overview

Last updated: 2026-06-04

## Current App State

FitCal currently has a working uni-app H5/App-base MVP under `FitCal-Uniapp`.

The current implementation is not only a static mockup. It includes a runnable mobile UI, calculation logic, local records, settings controls, TypeScript entrypoints, and modular business logic.

## Runtime Stack

- Framework: uni-app + Vue 3
- Language: TypeScript for app entry, page logic, shared types, data, and services
- Build tool: Vite with `@dcloudio/vite-plugin-uni`
- Primary preview target: H5
- App validation target: Android App base / HBuilderX runtime

## Implemented Modules

### App Shell

Files:

- `FitCal-Uniapp/pages/index/index.vue`
- `FitCal-Uniapp/App.vue`
- `FitCal-Uniapp/pages.json`

Implemented:

- Single mobile app shell
- Custom top bar
- Fixed bottom navigation
- Five tabs: BMI, Calories, Guidance, Records, Settings
- FitCal visual style: light surface, teal accents, coral CTA, compact cards
- SVG icon assets under `FitCal-Uniapp/static/icons`

Current limitation:

- The five tabs are implemented inside one page, not separate route pages.

### TypeScript Structure

Files:

- `FitCal-Uniapp/main.ts`
- `FitCal-Uniapp/vite.config.ts`
- `FitCal-Uniapp/types/fitcal.ts`
- `FitCal-Uniapp/env.d.ts`
- `FitCal-Uniapp/tsconfig.json`

Implemented:

- TypeScript app entrypoint
- TypeScript Vite config
- Shared domain types for units, tabs, goals, records, activity, and results
- Basic uni API declarations for the currently used storage/modal calls

Current limitation:

- uni global typing is intentionally minimal and only covers APIs used by the MVP.

### Static Data

File:

- `FitCal-Uniapp/data/appData.ts`

Implemented:

- Bottom tab metadata and active/inactive icons
- Activity level options
- Meal focus suggestions
- Default local records
- Local storage keys

### Calculator Services

File:

- `FitCal-Uniapp/services/calculators.ts`

Implemented:

- Metric/imperial label helpers
- Unit conversion
- BMI calculation
- BMI category mapping
- Healthy weight range calculation
- BMR/TDEE/daily calorie target calculation
- Goal title mapping
- Result number formatting

Current limitation:

- Calorie adjustment is a simple MVP offset rule.
- Activity options are simplified to Light, Moderate, Active in the UI.

### Local Storage Services

File:

- `FitCal-Uniapp/services/storage.ts`

Implemented:

- Unit preference loading/saving
- Record list loading/saving
- Local record clearing

Current limitation:

- Record schema migration/versioning is not implemented yet.
- Records are stored locally only.

### Policy Content

File:

- `FitCal-Uniapp/services/policy.ts`

Implemented:

- Privacy Policy modal text
- Disclaimer modal text

Current limitation:

- Dedicated policy/disclaimer pages are not implemented yet.

## Implemented User Flows

### BMI

Implemented:

- Metric/imperial switch
- Height and weight inputs
- BMI calculation
- BMI category badge
- Healthy range
- Wellness disclaimer

Partial:

- Input validation is minimal.
- Category explanation text is not expanded yet.

### Calories

Implemented:

- Sex, age, activity, goal inputs
- BMR, TDEE, and daily target output
- Result-page ad placeholder

Partial:

- Height and weight reuse BMI tab values instead of a dedicated calories form.
- Activity choices are simplified.

### Guidance

Implemented:

- Goal summary
- Daily target
- Macro split display
- Meal focus suggestions
- Guidance ad placeholder
- Optional extended guide CTA placeholder

Partial:

- Guidance content is static/rule-light.
- Rewarded ad unlock is not wired.

### Records

Implemented:

- Current weight
- Current BMI
- Static visual trend chart
- Add Record action
- Recent local records
- Clear local data from Settings

Partial:

- Trend chart is visual-only and not bound to record data yet.
- Record editing/deleting individual entries is not implemented.

### Settings

Implemented:

- Unit switch
- Language placeholder
- Privacy Policy modal
- Disclaimer modal
- Clear local data
- App version display

Partial:

- Language switching is only a placeholder.
- Privacy and disclaimer are modal content, not dedicated pages.

## Verification Commands

Run inside `FitCal-Uniapp`:

```bash
npm install
npm run typecheck
npm run build:h5
npm run dev:h5
```

Latest verified:

- `npm run typecheck`
- `npm run build:h5`
- Browser runtime check at `http://localhost:5179/`

## Known Technical Debt

- Split tab screens into route-level pages or feature components when the page grows further.
- Replace static Records chart with data-driven rendering.
- Add validation and error states for impossible height/weight/age values.
- Add dedicated Privacy Policy and Disclaimer pages.
- Add i18n dictionary structure before real language switching.
- Create ad abstraction before integrating any real ad SDK.
- Run Android App base smoke testing after each major UI/layout change.
