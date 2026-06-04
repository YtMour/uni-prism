# Implementation Status

Last updated: 2026-06-04

## Current Summary

FitCal is in the planning and documentation stage. No uni-app runtime code has been scaffolded yet.

## Completed

- App name selected: FitCal
- Store title selected: FitCal: BMI & Calorie Tracker
- Initial product positioning defined
- MVP feature categories defined
- Implementation roadmap created
- Monetization strategy drafted
- Compliance notes drafted

## Not Started

- uni-app project scaffold
- BMI calculator UI and logic
- Calorie calculator UI and logic
- Diet guidance templates
- Local record storage
- Settings page
- Privacy policy page
- Disclaimer page
- Ad component abstraction
- H5 build verification
- Android build verification
- Store listing assets

## Next Build Step

Create the uni-app project structure and implement the offline MVP:

1. Scaffold app files.
2. Build BMI calculator page.
3. Build calorie calculator page.
4. Build guidance page.
5. Add local records.
6. Add settings, disclaimer, and privacy policy.
7. Run H5 build verification.

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
