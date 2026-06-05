# Implementation Status

Last updated: 2026-06-05

## Current Summary

FitCal has a runnable uni-app MVP under `FitCal-Uniapp`.

The current app is a local-first wellness utility with five tabs: BMI, Calories, Guidance, Records, and Settings. The default uni-app template screen and logo have been removed. The app now uses TypeScript entrypoints and modular services for calculator logic, local storage, static app data, policy text, and shared domain types.

Internal operations data has been separated from the user app. A Go backend and React admin dashboard now expose backend status and fake ad placeholder metrics without showing those details in user-facing Settings.

## Completed

### Product and Design

- App name selected: FitCal
- Store title selected: FitCal: BMI & Calorie Tracker
- Initial product positioning defined
- MVP feature categories defined
- Visual style guide created
- 5-screen design board and detailed screen PNGs generated
- App icon and Android startup assets generated
- Android `.9.png` splash assets validated with Android SDK `aapt2`
- Android custom base confirmed startup image does not stretch
- Monetization strategy drafted
- Compliance notes drafted
- Admin deployment guide added

### App Foundation

- uni-app project scaffold under `FitCal-Uniapp`
- Vue 3 runtime configured
- H5 dev/build scripts configured
- TypeScript entrypoint: `main.ts`
- TypeScript Vite config: `vite.config.ts`
- TypeScript config: `tsconfig.json`
- Minimal uni global declarations: `env.d.ts`
- Default template page and default logo removed

### Modular Code Structure

- Shared domain types: `types/fitcal.ts`
- Static app data: `data/appData.ts`
- Calculator services: `services/calculators.ts`
- Local storage services: `services/storage.ts`
- Policy text service: `services/policy.ts`
- Feature screen components under `components/`
- SVG icon assets under `static/icons`

### MVP User Flows

- BMI calculator UI and logic
- Metric/imperial unit switching
- Healthy weight range calculation
- BMI category badge
- BMI calculation saves a local weight/BMI snapshot
- Calorie calculator UI and logic
- BMR/TDEE/daily target output
- Height, weight, and age validation states
- Goal-based guidance summary
- Guidance target checkpoint from saved target weight
- Guidance recent movement from local records
- Guidance 7-day guide can be opened/hidden, persists locally, and is generated from current goal, activity, calorie target, target weight, reminder rhythm, and local records
- Macro split visual display
- Meal focus suggestions
- Local record list
- Add Record action
- Individual record delete action from Records
- Individual record edit for weight and BMI from Records
- Copy local records as CSV from Settings local-data card for local-first portability
- Import local records from pasted CSV in Settings local-data card with validation and saved-record trimming
- Configurable saved-record limit in Settings
- Configurable chart-sample limit in Settings
- Records Current/BMI summary linked to the latest saved record
- Target weight setting stored locally
- Target progress summary linked to the latest local record
- Progress summary from local record history
- Records filters for All, Last 5, and BMI 25+ controlled in Settings
- Data-driven weight/BMI trend chart rendered with canvas for H5/App-base stability
- Trend chart labels for title, latest value, value range, Y-axis marks, and start/end dates
- Clear local data action with persistent empty state
- Settings page shell for global preferences, record display controls, privacy, and local-data controls including CSV import/export
- Records page focuses on current record summary, target weight, progress summary, trend display, add/edit/delete, and visible records
- Records control for target weight
- Guidance control for reminder rhythm without notification permission
- Settings language selector stores mainstream language selection locally and switches the app interface at runtime, including full Simplified Chinese coverage and mainstream-language coverage for core navigation, settings, records, and primary actions
- Restored unit preference keeps height and weight inputs in the matching unit system
- Dedicated Privacy Policy page and Settings entry point
- Dedicated Disclaimer page and Settings entry point
- Android manifest permissions reduced to an empty MVP baseline
- Push / UniPush disabled in Android manifest
- Android splash configuration uses validated `.9.png` startup images
- Android test signing keystore generated in project root
- Ad slot visual placeholders after useful content
- Fake ad placeholder mode with local impression/dismissal counters
- User actions now provide immediate toast feedback for key save/update/delete/toggle flows
- Runtime i18n service added for app UI, policy pages, BMI category labels, dynamic guide copy, and feedback toasts
- Internal fake ad metrics shown in React admin instead of user Settings
- Go backend exposes admin summary and fake ad event endpoints
- Go backend exposes anonymous activity event tracking for DAU, MAU, sessions, test retention, calculations, record writes, and ad engagements
- React admin dashboard has been localized to Chinese
- Backend persists admin test metrics to an ignored local JSON file
- Backend persists a capped operations config history to the ignored local JSON file
- React admin shows a 7-day test activity trend and a reset-test-data action
- React admin includes an operations config panel for ad placeholder visibility, App-base smoke status, and test announcement
- React admin includes a structured Android App-base smoke result form for per-check pending/pass/block notes
- React admin shows recent operations config history and can export local smoke/test metrics as JSON
- User app reads backend app config to decide whether fake ad placeholders should render
- User app shows the backend test announcement only when the independent announcement visibility switch is enabled
- Ad placeholder visibility and test announcement visibility are separate controls
- H5 resolves the backend config endpoint from the current browser host, while Android App-base uses the LAN backend default `http://192.168.1.128:48791`
- Admin operations config now tracks H5 version, Android base status, and release note for internal status recording.
- User app only renders the independent test announcement switch/text; release note and H5 version remain admin-only and are not rendered in the App header.
- Lightweight i18n audit script added as `npm run audit:i18n` to catch known hard-coded English UI regressions and English / Simplified Chinese missing-key drift before adding more screens.
- Narrow H5 layout audit script added as `npm run audit:layout:h5` for English, Simplified Chinese, Spanish, German, and Japanese Settings/Records/Guidance checks.
- H5 store screenshot capture script added as `npm run capture:store`, writing reference screenshots to `docs/store-screenshots/`.
- Narrow layout audit now also guards CSV ownership and layout: CSV import/export must stay in the Settings local-data card, must not appear on the Records page, and must stack without overlapping the CSV input on narrow H5 screens.
- Docker Compose starts backend and admin on LAN-accessible high ports
- Fixed bottom navigation and improved icon rendering

## Partial / Needs Hardening

- Guidance content now reflects target progress, recent movement, current goal, activity level, calorie target, reminder rhythm, and saved target weight; meal suggestions remain simple static guidance.
- Language setting now changes the runtime interface. Simplified Chinese covers the main app, dynamic guide copy, records, settings, policy/disclaimer pages, BMI category labels, and feedback toasts; other mainstream languages cover core navigation, settings, records, and primary actions, with deeper long-form guide copy still falling back to English where not translated.
- Ad slots are placeholders by decision; no production ad SDK or rewarded ad behavior should be added during current MVP hardening.
- Backend fake ad metrics are currently in-memory only and are intended for smoke testing, not analytics persistence.
- Activity and retention metrics are test-only local JSON metrics, not production analytics.
- Input validation covers height, weight, and age ranges, but field-specific UX can still be refined for platform keyboards and copy.
- Five tabs are split into feature screen components, while shared state remains in `pages/index/index.vue`.
- App-base/Android smoke testing is in progress via user device checking; startup image custom-base smoke passed, but full functional package smoke is still pending.

## Deferred / Future Scope

- Real ad component abstraction
- Production ad SDK integration
- Rewarded video unlock flow
- Native notification reminders
- Final store listing copy and Android-device screenshots
- Android package build verification
- iOS validation

## Verification

Latest verified in `FitCal-Uniapp`:

```bash
npm run typecheck
npm run audit:i18n
npm run audit:layout:h5
npm run build:h5
npm run smoke:h5
```

Runtime checked:

- H5 app opened at `http://localhost:5179/`
- Five bottom tabs rendered
- BMI screen rendered after TypeScript migration
- Automated H5 smoke covers BMI-to-Records creation, Records-based record deletion, Records-based record editing, Settings-based record filters, Settings-based trend-mode switching, unit persistence, language preference persistence, target weight persistence, reminder rhythm persistence, guidance target checkpoint, local 7-day guide open/hide persistence, progress summary, fake ad placeholder close/toggle behavior, max-record trimming, clear-data persistence, ad placeholders, and policy routes.
- Automated H5 smoke also covers Settings local-data CSV export success, empty-state feedback, invalid CSV import feedback, and valid CSV import.
- Browser verification confirmed Records exposes edit/delete record actions without CSV controls, while Settings exposes the local-data CSV import/export card with stacked non-overlapping buttons.
- Browser verification confirmed release notes and H5 version do not render in the user app, while the independent test announcement remains the only App header announcement path.
- Records trend chart renders inside its card with canvas and does not overflow in H5
- Records trend chart shows title, latest value, range, Y-axis labels, and start/end date labels
- Browser console showed no runtime errors during verification
- H5 store screenshots generated for English core screens and Simplified Chinese BMI/Settings screens.
- Narrow H5 layout audit passed for selected launch-review languages.

Latest admin/backend verification target:

- Backend health: `http://127.0.0.1:48791/api/health`
- Backend summary: `http://127.0.0.1:48791/api/admin/summary`
- Backend export: `http://127.0.0.1:48791/api/admin/export`
- Admin dashboard: `http://127.0.0.1:48792/`
- Admin same-origin API proxy: `http://127.0.0.1:48792/api/admin/summary`
- Docker ports bind to `0.0.0.0` for LAN access.
- User app reports anonymous test events to `POST /api/admin/activity-event`.
- Admin can clear backend metrics with `POST /api/admin/reset`.
- Admin can update operations config with `POST /api/admin/config`.
- Admin can export local smoke/test metrics with `GET /api/admin/export`.
- User app reads safe runtime config from `GET /api/app/config`.
- User app hides test announcements when `showTestAnnouncement=false`, even if announcement text is stored in the admin config.
- App-base smoke status is not exposed to the user app.
- App-base smoke checklist items are persisted in backend config for admin-only tracking.
- Android base status, App-base smoke status, H5 version, and release note are not exposed in the user app.

App-base feedback:

- HBuilder App base showed the previous CSS-transform chart could overflow and break line segments.
- The Records chart has been changed to canvas rendering to avoid App WebView percentage/transform drift.
- Custom base startup image was rebuilt and confirmed not stretched on device after `.9.png` regeneration.
- HBuilder App base still needs a full functional check for numeric keyboard, Records canvas chart, Back navigation, and persistence.
- App-base smoke result tracking is prepared in `docs/ANDROID_APP_BASE_SMOKE_RESULT.md` and the admin dashboard.

Known build notes:

- Vite prints a CJS Node API deprecation warning from the uni-app toolchain.
- npm audit reports upstream dependency vulnerabilities from the uni-app dependency tree; this has not blocked local H5 build verification.

## Current Source Of Truth

- Documentation index: `docs/DOCUMENTATION_INDEX.md`
- Project status and plan: `docs/PROJECT_STATUS_AND_PLAN.md`
- Current status: this file
- Feature behavior target: `docs/FEATURE_SPEC.md`
- Smoke checklist: `docs/SMOKE_CHECKLIST.md`
- Visual target: `docs/design/FITCAL_VISUAL_STYLE_GUIDE.md`
- Admin deployment: `ADMIN_DEPLOYMENT.md`

## Immediate Next Step

1. Keep H5 verification passing: typecheck, i18n audit, layout audit, build, smoke, and screenshot capture.
2. Use generated H5 screenshots for store copy and layout review while Android package verification is intentionally skipped.
3. Keep CSV import/export in Settings local data and record edit/delete in Records.
4. Keep internal metrics, release notes, App-base smoke status, and config history in the admin/backend stack only.
5. Keep Android package verification and real ad SDK integration deferred by current scope.
6. Refine validation UX only if future device smoke exposes issues.

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

### 2026-06-04

Decision: strengthen H5 smoke around state persistence before adding new features.

Reason:

- Android App-base smoke still needs real-device verification, but H5 can already catch state regressions.
- The enhanced smoke exposed and verified a restored Imperial-units input mismatch.
- Current MVP should remain placeholder-only for ads while core state flows are hardened.

### 2026-06-04

Decision: use validated `.9.png` startup images for Android custom base.

Reason:

- HBuilderX recommends `.9.png` for startup images to avoid unclear scaling on non-standard resolutions.
- New image-generated splash backgrounds avoid local-script color blocks and hard line artifacts.
- Android SDK `aapt2` compiled the `.9.png` assets successfully.
- User confirmed the rebuilt custom base no longer stretches the startup image.

### 2026-06-04

Decision: keep Android manifest permissions empty for the current MVP.

Reason:

- FitCal currently stores records locally and does not need camera, account, phone state, WiFi, log, or system settings access.
- Ad SDK integration is deferred, so ad-related permissions should not appear yet.
- Store privacy/data-safety wording should match the shipped binary.

### 2026-06-04

Decision: keep monetization placeholder-only during MVP hardening.

Reason:

- Core H5 and Android App-base smoke should stabilize before SDK integration.
- Privacy and store wording must match shipped behavior.
- Calculator, guidance, and record flows should not depend on ad loading.

### 2026-06-04

Decision: migrate app logic from JavaScript to TypeScript and modularize calculation/storage/data concerns before continuing feature growth.

Reason:

- Reduces risk as the page grows
- Makes calculator and storage behavior easier to test
- Keeps UI code focused on presentation and event binding

### 2026-06-05

Decision: separate internal operational information into a Go backend and React admin dashboard.

Reason:

- Fake ad placeholder counters and App-base smoke status are internal testing information.
- User-facing Settings should not expose implementation or ad-test details.
- The admin stack can run locally or over LAN through Docker on high ports without adding app permissions or real ad SDK dependencies.
