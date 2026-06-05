# Implementation Overview

Last updated: 2026-06-05

## Archived

This file used to describe an early FitCal implementation snapshot. That snapshot is outdated and has been archived to avoid conflicting guidance.

Use these current documents instead:

- `docs/DOCUMENTATION_INDEX.md` for the document map.
- `docs/PROJECT_STATUS_AND_PLAN.md` for current status and next priorities.
- `docs/IMPLEMENTATION_STATUS.md` for implemented behavior and verification.
- `docs/FEATURE_SPEC.md` for current feature contracts.
- `docs/SMOKE_CHECKLIST.md` for manual smoke coverage.

Current implementation summary:

- User app: `FitCal-Uniapp`
- Internal admin: `FitCal-Admin`
- Backend: `FitCal-Backend`
- Current scope skips Android package verification and production ad SDK integration.
- Records page owns record add/edit/delete, target progress, and trends.
- Settings owns local-data CSV export/import and global preferences.
