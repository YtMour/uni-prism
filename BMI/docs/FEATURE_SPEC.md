# Feature Specification

Last updated: 2026-06-04

## Feature Status Legend

- Done: implemented in the current app.
- Partial: implemented but needs hardening or richer behavior.
- Planned: not implemented yet.

## 1. BMI Calculator

Status: done, with validation UX refinement planned

Purpose:

Provide a fast body mass index result and plain-language category.

Current implementation:

- Metric/imperial control
- Height input
- Weight input
- BMI calculation
- BMI category badge
- Healthy weight range
- Empty input and range validation
- Calculate BMI saves a local BMI/weight snapshot
- Short wellness disclaimer

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`
- Logic: `FitCal-Uniapp/services/calculators.ts`
- Types: `FitCal-Uniapp/types/fitcal.ts`

Calculation:

```text
BMI = weight_kg / (height_m * height_m)
```

Categories:

- Underweight
- Normal weight
- Overweight
- Obesity

Planned improvements:

- Better category explanation
- Android App base keyboard and validation copy refinement

## 2. Calorie Calculator

Status: done, with form refinement planned

Purpose:

Estimate daily calorie needs using BMR, activity level, and goal.

Current implementation:

- Sex selection
- Age input
- Activity level selection: Light, Moderate, Active
- Goal selection: Maintain, Lose, Gain
- Age validation
- BMR output
- TDEE output
- Daily target output

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`
- Logic: `FitCal-Uniapp/services/calculators.ts`
- Static options: `FitCal-Uniapp/data/appData.ts`

Formula direction:

- Mifflin-St Jeor formula for BMR
- TDEE = BMR * activity factor
- Daily target = TDEE plus or minus a simple MVP offset

Current limitation:

- Height and weight are shared from the BMI tab rather than repeated in a dedicated calories form.
- Activity choices are simplified compared with the broader product plan.
- Goal adjustment uses a simple fixed offset.

Planned improvements:

- Dedicated height/weight context or clearer shared input behavior
- Expanded activity levels
- More transparent goal adjustment copy
- Validation for age and body metrics

## 3. Diet Guidance

Status: implemented, needs translation depth review

Purpose:

Convert calculator results into simple, non-clinical diet guidance.

Current implementation:

- Goal summary
- Daily target
- Macro split visual
- Meal focus suggestions
- Wellness-only note
- Optional extended guide CTA placeholder
- Guidance ad placeholder

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`
- Static content: `FitCal-Uniapp/data/appData.ts`

Current limitation:

- Content is static and only lightly connected to goal state.
- No BMI-category-specific guidance.
- No rewarded video unlock behavior.

Planned improvements:

- Goal-specific guidance templates
- BMI-category-sensitive notes
- Expanded free guidance before any rewarded ad
- Optional 7-day guide unlock flow

## 4. Record History

Status: implemented, with Android App-base hardening pending

Purpose:

Improve retention and support repeat use through local tracking.

Current implementation:

- Local record list
- Add Record action
- Individual record delete action
- Current weight display
- Current BMI display
- Local data only note
- Clear local data from Settings
- Edit and delete records from Records
- Copy local records as CSV from Settings local-data card
- Import local records from pasted CSV in Settings local-data card
- Data-driven weight/BMI trend chart
- Trend chart title, latest value, range, Y-axis labels, and start/end date labels
- Configurable maximum saved records
- Configurable chart sample limit
- Current and BMI summary cards read from the latest record
- Current and BMI summary cards are read-only summaries, not editable inputs

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`
- Storage: `FitCal-Uniapp/services/storage.ts`
- Default records: `FitCal-Uniapp/data/appData.ts`

Stored locally:

- Date label
- Weight
- BMI

Record rules:

- BMI screen `Calculate BMI` writes a new local record after successful validation.
- Records screen `Add Record` uses the same current BMI snapshot behavior.
- The list keeps the newest records up to the configured saved-record limit.
- The chart uses the newest records up to the configured chart-sample limit.
- The chart-sample limit cannot exceed the saved-record limit.
- The Records summary cards always reflect the newest saved record, falling back to current BMI inputs only when no record exists.
- CSV export copies date, weight, and BMI rows to the clipboard and does not use network or login.
- CSV import reads date, weight, and BMI rows from the Settings local-data paste box, rejects invalid input, trims to the configured saved-record limit, and stays local-only.

Current limitation:

- No schema versioning or migration.

Planned improvements:

- Optional file picker import if clipboard import is not enough after device testing
- Record timestamp normalization
- Optional calorie snapshot per record

## 5. Settings

Status: partial

Purpose:

Provide trust, unit control, privacy access, and data control.

Current implementation:

- Unit system switch
- Runtime language selector with persisted app-language switching
- Max saved records setting
- Chart samples setting
- Dedicated Privacy Policy page link
- Dedicated Disclaimer page link
- Local data card for CSV export/import
- Clear local data
- App version display

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`
- Policy pages: `FitCal-Uniapp/pages/policy/policy.vue`
- Policy text: `FitCal-Uniapp/services/policy.ts`
- Storage: `FitCal-Uniapp/services/storage.ts`

Current limitation:

- Simplified Chinese coverage is complete for current MVP screens; other mainstream languages cover core UI but still need native review for long-form guidance copy.

Planned improvements:

- Clear data confirmation flow
- Native review for long-form non-Chinese translations

## 6. Advertising

Status: visual placeholder only

Reserved placements:

- Result page ad slot
- Guidance page ad slot
- Rewarded video for enhanced guidance in a later version

Current implementation:

- Dashed placeholder containers after useful content

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`

Rules:

- Ads must not block BMI calculation.
- Ads must not block calorie calculation.
- Ads must not appear before the first useful result.
- Rewarded ads must unlock optional content only.

Planned improvements:

- Ad abstraction component
- Platform-specific ad adapter
- Development fallback
- Unsupported-platform fallback
- Rewarded video unlock flow

## Navigation

Status: done

Current tabs:

- BMI
- Calories
- Guidance
- Records
- Settings

Current implementation:

- Fixed bottom navigation in `pages/index/index.vue`
- SVG icon assets in `FitCal-Uniapp/static/icons`

Planned improvement:

- Split large tab content into feature components or route-level pages as complexity grows.
