# FitCal

FitCal: BMI & Calorie Tracker is a lightweight wellness calculator app for overseas mobile markets. It helps users calculate BMI, estimate daily calorie needs, and get simple diet guidance for everyday weight management.

The app should be positioned as a wellness and fitness utility, not as a medical diagnosis or treatment product.

## Product Name

- App name: FitCal
- Store title: FitCal: BMI & Calorie Tracker
- Internal Chinese name: 轻衡 BMI
- Suggested package id: `com.uniprism.fitcal`

## Core Features

- BMI calculator
- BMR and TDEE calorie calculator
- Goal-based diet guidance
- Weight and BMI history
- Local-first records
- Ad-supported monetization

## Target Platforms

- Android App first
- iOS App later after product validation
- H5 preview during development
- Mini program adaptation only after the app flow is stable

## Documentation

- [Product Plan](docs/PRODUCT_PLAN.md)
- [Feature Specification](docs/FEATURE_SPEC.md)
- [Implementation Overview](docs/IMPLEMENTATION_OVERVIEW.md)
- [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)
- [Next Steps](docs/NEXT_STEPS.md)
- [Monetization Plan](docs/MONETIZATION_PLAN.md)
- [Compliance Notes](docs/COMPLIANCE_NOTES.md)
- [Implementation Status](docs/IMPLEMENTATION_STATUS.md)

## Current Stage

The uni-app offline MVP has been scaffolded under `FitCal-Uniapp` and now includes:

1. BMI calculator
2. Calorie calculator
3. Diet guidance
4. Local history
5. Settings, privacy, and disclaimer entry points
6. TypeScript entrypoints and modular calculator/storage/data services

Run the H5 verification build from `FitCal-Uniapp`:

```bash
npm install
npm run typecheck
npm run build:h5
npm run dev:h5
```
