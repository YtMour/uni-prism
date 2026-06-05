# FitCal Documentation Index

Last updated: 2026-06-05

## Read These First

- `docs/PROJECT_STATUS_AND_PLAN.md`: current project status, completed work, remaining work, and priority order.
- `docs/IMPLEMENTATION_STATUS.md`: implementation facts, verification commands, decisions, and known caveats.
- `docs/FEATURE_SPEC.md`: feature contracts for BMI, Calories, Guidance, Records, Settings, advertising placeholders, and navigation.
- `docs/SMOKE_CHECKLIST.md`: manual smoke checklist and platform-specific checks.
- `docs/STORE_LAUNCH_PREP.md`: store copy, screenshot plan, privacy/data-safety draft, and release blockers.

## Supporting Docs

- `docs/COMPLIANCE_NOTES.md`: compliance principles and wording boundaries.
- `docs/MONETIZATION_PLAN.md`: deferred monetization strategy and placeholder rules.
- `docs/BRAND_ASSETS.md`: app icon and splash asset notes.
- `ADMIN_DEPLOYMENT.md`: internal admin/backend deployment and operational endpoints.
- `docs/ANDROID_APP_BASE_SMOKE.md`: future Android App-base real-device checklist.
- `docs/ANDROID_APP_BASE_SMOKE_RESULT.md`: future Android App-base result log.

## Archived Pointers

These files are kept only so old links do not break. Their old bodies were removed because they conflicted with the current scope.

- `docs/IMPLEMENTATION_OVERVIEW.md`
- `docs/IMPLEMENTATION_ROADMAP.md`
- `docs/MVP_HARDENING_PLAN.md`
- `docs/NEXT_STEPS.md`

## Current Scope

- H5 MVP hardening and documentation alignment continue.
- Android package verification is intentionally skipped.
- Production ad SDK integration is intentionally skipped.
- H5 screenshots under `docs/store-screenshots/` are for review, not final Android store upload.

## Current Verification Baseline

```bash
cd FitCal-Uniapp
npm run typecheck
npm run audit:i18n
npm run audit:layout:h5
npm run build:h5
npm run smoke:h5
npm run capture:store
```

```bash
cd FitCal-Backend
go test ./...
```

```bash
cd FitCal-Admin
npm run build
```
