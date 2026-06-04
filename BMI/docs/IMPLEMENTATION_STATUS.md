# Implementation Status

Last updated: 2026-06-04

## Current Summary

FitCal now has a uni-app offline MVP scaffold under `FitCal-Uniapp`. The default template screen and logo were removed, and the app shell now follows the FitCal visual design system with five main tabs.

## Completed

- App name selected: FitCal
- Store title selected: FitCal: BMI & Calorie Tracker
- Initial product positioning defined
- MVP feature categories defined
- Implementation roadmap created
- Monetization strategy drafted
- Compliance notes drafted
- uni-app project scaffold
- BMI calculator UI and logic
- Calorie calculator UI and logic
- Diet guidance template
- Local record storage
- Settings page shell
- Privacy policy and disclaimer modal entry points
- Ad slot visual placeholders after useful results
- H5 build verification

## Remaining

- Android build verification
- Store listing assets
- Dedicated Privacy Policy page
- Dedicated Disclaimer page
- Real ad component abstraction and platform integration
- More robust records chart data binding
- i18n implementation beyond the English placeholder

## Latest Verification

- `npm run build:h5` passed in `FitCal-Uniapp` on 2026-06-04.

## Next Build Step

Run the H5 app visually and tighten mobile layout details, then add dedicated Privacy Policy and Disclaimer pages before Android packaging.

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
