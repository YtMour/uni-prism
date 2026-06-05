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
- `FitCal-Uniapp/pages/policy/policy.vue`
- `FitCal-Uniapp/components/BmiScreen.vue`
- `FitCal-Uniapp/components/CaloriesScreen.vue`
- `FitCal-Uniapp/components/GuidanceScreen.vue`
- `FitCal-Uniapp/components/RecordsScreen.vue`
- `FitCal-Uniapp/components/SettingsScreen.vue`
- `FitCal-Uniapp/App.vue`
- `FitCal-Uniapp/pages.json`

Implemented:

- Single mobile app shell
- Custom top bar
- Fixed bottom navigation
- Five tabs: BMI, Calories, Guidance, Records, Settings
- Five feature screen components with shared state retained in the index page
- Dedicated policy route for Privacy Policy and Disclaimer
- FitCal visual style: light surface, teal accents, coral CTA, compact cards
- SVG icon assets under `FitCal-Uniapp/static/icons`

Current limitation:

- Shared state and calculator event wiring still live in the index page.

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
- Basic uni API declarations for the currently used storage, modal, and navigation calls

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
- Record retention setting loading/saving
- Local record clearing

Current limitation:

- Record schema migration/versioning is not implemented yet.
- Records are stored locally only.

### Policy Content

File:

- `FitCal-Uniapp/services/policy.ts`

Implemented:

- Structured Privacy Policy content
- Structured Disclaimer content
- Reusable policy page content lookup

Current limitation:

- Production ad SDK privacy wording must be revisited before launch.

## Implemented User Flows

### BMI

Implemented:

- Metric/imperial switch
- Height and weight inputs
- Height and weight range validation
- BMI calculation
- Successful BMI calculation saves a local record
- BMI category badge
- Healthy range
- Wellness disclaimer

Partial:

- Category explanation text is not expanded yet.

### Calories

Implemented:

- Sex, age, activity, goal inputs
- Age validation
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
- Current/BMI summary cards use the latest saved record
- Data-driven weight/BMI trend chart rendered on canvas
- Add Record action
- Delete individual record action
- Configurable saved-record limit
- Configurable chart-sample limit
- Recent local records
- Clear local data from Settings

Partial:

- HBuilder App base should be rechecked after the canvas chart fix.

### Settings

Implemented:

- Unit switch
- Runtime language selector
- Max saved records setting
- Chart samples setting
- Dedicated Privacy Policy page link
- Dedicated Disclaimer page link
- Clear local data
- App version display

Partial:

- Non-Chinese long-form translation quality still needs review before store screenshots.

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

- Decide later whether tab screens need route-level pages or a shared store.
- Refine validation behavior on Android App base keyboards.
- Add i18n dictionary structure before real language switching.
- Create ad abstraction before integrating any real ad SDK.
- Run Android App base smoke testing after each major UI/layout change.
