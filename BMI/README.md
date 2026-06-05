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
- Local-data CSV import/export
- Placeholder-only ad layout for future monetization review

## Target Platforms

- H5 preview during current development and verification
- Android App later after package verification resumes
- iOS App later after product validation
- Mini program adaptation only after the app flow is stable

## Documentation

- [Documentation Index](docs/DOCUMENTATION_INDEX.md)
- [Project Status and Plan](docs/PROJECT_STATUS_AND_PLAN.md)
- [Implementation Status](docs/IMPLEMENTATION_STATUS.md)
- [Product Plan](docs/PRODUCT_PLAN.md)
- [Feature Specification](docs/FEATURE_SPEC.md)
- [Monetization Plan](docs/MONETIZATION_PLAN.md)
- [Compliance Notes](docs/COMPLIANCE_NOTES.md)
- [Smoke Checklist](docs/SMOKE_CHECKLIST.md)
- [Android App-base Smoke Guide](docs/ANDROID_APP_BASE_SMOKE.md)
- [Store Launch Prep](docs/STORE_LAUNCH_PREP.md)
- [Brand Assets](docs/BRAND_ASSETS.md)
- [Android Keystore](ANDROID_KEYSTORE.md)
- [Admin Deployment](ADMIN_DEPLOYMENT.md)

Archived pointers kept for old links:

- [Implementation Overview](docs/IMPLEMENTATION_OVERVIEW.md)
- [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)
- [Next Steps](docs/NEXT_STEPS.md)
- [MVP Hardening Plan](docs/MVP_HARDENING_PLAN.md)

## Current Stage

The uni-app MVP under `FitCal-Uniapp` is runnable and currently includes:

1. BMI calculator
2. Calorie calculator
3. Goal-based guidance
4. Local Records with add/edit/delete, target progress, and trend chart
5. Settings with units, language, record display controls, CSV local-data import/export, privacy, disclaimer, and clear local data
6. TypeScript entrypoints and modular calculator/storage/policy/data services
7. H5 smoke, i18n audit, narrow layout audit, and store screenshot capture scripts
8. Separated Go backend and React admin for internal testing metrics and operations config

Current scope intentionally skips Android package verification and production ad SDK integration.

Run H5 verification from `FitCal-Uniapp`:

```bash
npm install
npm run typecheck
npm run audit:i18n
npm run audit:layout:h5
npm run build:h5
npm run smoke:h5
npm run capture:store
npm run dev:h5
```

## Internal Admin

The project now includes a separated internal admin stack:

- Go backend: `FitCal-Backend`
- React admin: `FitCal-Admin`
- Docker one-command startup from the project root
- Backend port: `48791`
- Admin port: `48792`

Start both services:

```bash
docker compose up -d --build
```

Open the admin dashboard:

```text
http://localhost:48792/
```

For LAN access, replace `localhost` with this machine's LAN IP. The admin frontend uses a same-origin `/api` nginx proxy, so LAN devices can load backend data through the admin port.
