# Feature Specification

Last updated: 2026-06-04

## Feature Status Legend

- Done: implemented in the current app.
- Partial: implemented but needs hardening or richer behavior.
- Planned: not implemented yet.

## 1. BMI Calculator

Status: done, with validation hardening planned

Purpose:

Provide a fast body mass index result and plain-language category.

Current implementation:

- Metric/imperial control
- Height input
- Weight input
- BMI calculation
- BMI category badge
- Healthy weight range
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

- Empty input state
- Min/max range validation
- Better category explanation
- Optional record snapshot after calculation

## 2. Calorie Calculator

Status: done, with form refinement planned

Purpose:

Estimate daily calorie needs using BMR, activity level, and goal.

Current implementation:

- Sex selection
- Age input
- Activity level selection: Light, Moderate, Active
- Goal selection: Maintain, Lose, Gain
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

Status: partial

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

Status: partial

Purpose:

Improve retention and support repeat use through local tracking.

Current implementation:

- Local record list
- Add Record action
- Current weight display
- Current BMI display
- Local data only note
- Clear local data from Settings

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`
- Storage: `FitCal-Uniapp/services/storage.ts`
- Default records: `FitCal-Uniapp/data/appData.ts`

Stored locally:

- Date label
- Weight
- BMI

Current limitation:

- Trend chart is visual/static and not generated from records.
- No individual record delete/edit.
- No schema versioning or migration.

Planned improvements:

- Data-driven weight trend chart
- BMI trend chart
- Individual record management
- Record timestamp normalization
- Optional calorie snapshot per record

## 5. Settings

Status: partial

Purpose:

Provide trust, unit control, privacy access, and data control.

Current implementation:

- Unit system switch
- Language placeholder
- Privacy Policy modal
- Disclaimer modal
- Clear local data
- App version display

Current files:

- UI: `FitCal-Uniapp/pages/index/index.vue`
- Policy text: `FitCal-Uniapp/services/policy.ts`
- Storage: `FitCal-Uniapp/services/storage.ts`

Current limitation:

- Language setting does not change app language.
- Privacy and disclaimer are modal text, not dedicated pages.

Planned improvements:

- Dedicated Privacy Policy page
- Dedicated Disclaimer page
- i18n dictionary and runtime language selection
- Clear data confirmation flow

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
