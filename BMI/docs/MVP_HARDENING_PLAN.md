# MVP Hardening Plan

Last updated: 2026-06-05

## Archived

The original hardening plan was written before the current H5 smoke, layout audit, store screenshot capture, admin config history, and CSV ownership checks were implemented.

Use the current live plan instead:

- `docs/PROJECT_STATUS_AND_PLAN.md`
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/SMOKE_CHECKLIST.md`
- `docs/STORE_LAUNCH_PREP.md`

Current hardening baseline:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run audit:i18n
npm run audit:layout:h5
npm run build:h5
npm run smoke:h5
npm run capture:store
```

Admin/backend baseline:

```bash
cd FitCal-Backend
go test ./...
```

```bash
cd FitCal-Admin
npm run build
```

Current scope skips Android package verification and production ad SDK integration.
