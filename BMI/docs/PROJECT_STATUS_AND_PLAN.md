# FitCal Project Status and Plan

Last updated: 2026-06-05

## Current Stage

FitCal is now a runnable local-first uni-app MVP for H5 validation and future Android App-base validation.

The MVP has moved past static planning. It includes calculator logic, local records, settings, dedicated policy pages, componentized screens, canvas-based trend rendering, documented smoke checks, and a separated internal admin stack for operational checks.

## Completed

### Product and Planning

- Product name: FitCal
- Store title: FitCal: BMI & Calorie Tracker
- Product positioning: overseas wellness calculator, not a medical diagnosis tool
- Product plan, monetization plan, compliance notes, feature spec, roadmap, and visual style guide
- Five-screen visual direction and rendered design PNGs
- App icon and Android splash assets generated under `FitCal-Uniapp/static/brand/`
- Android `.9.png` splash assets configured in `manifest.json`
- Android custom base smoke confirmed the splash no longer stretches
- H5 store-review screenshots generated under `docs/store-screenshots/`
- Android signing keystore generated for custom base / test packaging
- Internal admin deployment guide added in `ADMIN_DEPLOYMENT.md`

### App Foundation

- uni-app project scaffolded under `FitCal-Uniapp`
- Vue 3 + TypeScript + Vite app foundation
- H5 dev/build scripts
- Custom FitCal app shell and fixed bottom navigation
- Default uni-app template removed
- Shared domain types, static data, calculator service, storage service, and policy service
- Feature screen components:
  - `components/BmiScreen.vue`
  - `components/CaloriesScreen.vue`
  - `components/GuidanceScreen.vue`
  - `components/RecordsScreen.vue`
  - `components/SettingsScreen.vue`

### BMI Flow

- Metric/imperial unit switch
- Height and weight input
- BMI calculation
- BMI category badge
- Healthy weight range
- Field-level validation for height and weight
- Invalid result placeholder to avoid stale or impossible values
- Successful BMI calculation writes a local record

### Calories Flow

- Sex, age, activity, and goal controls
- BMR, TDEE, and daily target calculation
- Age validation
- Result-page ad placeholder after useful result
- Fake ad placeholder mode for close-flow and layout testing

### Guidance Flow

- Goal-based title and daily target
- Macro split visual
- Goal checkpoint reads target progress
- Recent movement reads local record progress summary
- Meal focus suggestions
- Guidance ad placeholder after useful content
- Optional 7-day guide CTA placeholder

### Records Flow

- Local records list
- Add Record and individual Delete
- Individual record edit for weight and BMI
- Copy local records as CSV from Settings local-data card
- Import local records from pasted CSV in Settings local-data card
- BMI Calculate and Add Record share the same snapshot behavior
- Current/BMI summary cards read from the latest saved record
- Clear local data persists an empty state
- Target weight setting persists locally
- Target progress shows target, remaining difference, and direction
- Progress summary shows saved count, weight change, direction, and period
- Record filters: All, Last 5, BMI 25+
- Configurable saved-record limit: 5, 10, 20, 50
- Configurable chart sample limit: 5, 10, 20
- Chart sample limit is constrained by saved-record limit
- Canvas-based weight/BMI trend chart for H5/App-base stability
- Chart title, latest value, value range, Y-axis labels, and start/end date labels

### Settings and Compliance

- Unit preference setting
- Unit preference restores valid converted height and weight inputs after reload
- Target weight converts with metric/imperial unit changes
- Reminder rhythm setting: Off, Weekly, Monthly
- Ad placeholder test mode with internal impression/dismissal counters
- User-facing Settings no longer exposes internal fake ad counters
- Internal fake ad metrics moved to the separated admin dashboard
- Anonymous activity events feed the admin dashboard for DAU, MAU, test retention, sessions, calculations, record writes, and ad engagements
- Record retention and chart sampling settings
- Dedicated Privacy Policy page
- Dedicated Disclaimer page
- Local-first privacy wording
- Android manifest permissions remain empty
- Push / UniPush / GtPush disabled in manifest
- Clear local data action
- Settings local-data CSV export action
- Settings local-data CSV import action
- Runtime language selector with persisted mainstream-language preference
- Full Simplified Chinese coverage for the main app, policy/disclaimer pages, dynamic guide copy, BMI category labels, records, settings, and feedback toasts
- Core UI coverage for English, Traditional Chinese fallback, Spanish, French, German, Japanese, Korean, Portuguese, Indonesian, Thai, and Vietnamese

### Verification

Latest verified commands:

```bash
cd FitCal-Uniapp
npm run typecheck
npm run audit:i18n
npm run audit:layout:h5
npm run build:h5
npm run smoke:h5
```

Latest admin/backend verification target:

- Go backend under `FitCal-Backend`
- React admin under `FitCal-Admin`
- Docker Compose starts backend on `0.0.0.0:48791` and admin on `0.0.0.0:48792`
- Admin uses same-origin `/api` nginx proxy for LAN-safe backend access
- Backend exposes `GET /api/health`, `GET /api/admin/summary`, and `POST /api/admin/ad-event`
- Backend also exposes `POST /api/admin/activity-event` for anonymous test activity events
- Backend persists test metrics to `FitCal-Backend/data/metrics.json`
- Backend persists capped operations config history in `FitCal-Backend/data/metrics.json`
- Admin shows a 7-day test activity trend and can reset test metrics
- Admin can save test operations config for ad placeholder visibility, App-base smoke status, and test announcement
- User app reads `GET /api/app/config` to control ad placeholder visibility
- User app polls backend config about every 10 seconds and shows test announcements under the top bar
- Admin can manage H5 version, Android base status, and release note for internal tracking
- Admin can record structured Android App-base smoke checklist status and per-item notes
- Admin can show operations config history and export local smoke/test metrics as JSON
- User app only displays the independent test announcement when the announcement switch is enabled; H5 version and release note stay admin-only

Latest verification refresh on 2026-06-04:

- H5 dev server returned HTTP 200 at `http://127.0.0.1:5179/`.
- Automated H5 browser smoke confirmed the five tabs render.
- BMI calculation created Records entries.
- Privacy Policy and Disclaimer routes rendered.
- No blocking browser runtime errors were found.
- Chromium reported a non-blocking Records canvas readback performance warning.

Latest H5 checks:

- Five tabs render
- BMI calculation creates linked Records entries
- Unit persistence restores valid matching inputs after reload
- Records list respects configured saved-record limit
- Records deletion works
- Records trend mode switches between Weight and BMI
- Target weight saves locally and appears in Records target progress
- Records progress summary shows saved count and total weight change
- Records filters update the list and progress summary
- Records edit saves weight/BMI changes locally
- Settings local-data CSV export copies local history and shows empty-state feedback when no records exist
- Settings local-data CSV import rejects invalid pasted content and imports valid date/weight/BMI rows locally
- Guidance shows target checkpoint and recent movement
- Guidance shows reminder rhythm without requesting notification permission
- Fake ad placeholder can be shown, closed, disabled, and counted locally
- Chart sample setting controls trend sample size
- Clear local data persists empty Records after refresh
- Canvas trend chart stays inside the chart card
- Trend labels are visible
- Privacy and Disclaimer routes render
- Browser console has no runtime errors during checked flows
- Narrow H5 layout audit passes for English, Simplified Chinese, Spanish, German, and Japanese Settings/Records/Guidance screens, including CSV ownership and stacked Settings local-data button layout
- H5 store screenshot capture produces seven reference screenshots for English and Simplified Chinese review

Latest Android custom base feedback on 2026-06-05:

- Custom base rebuilt and launched successfully.
- `.9.png` startup image no longer stretches or compresses the center icon.
- Previous Push/GtPush configuration was removed from `manifest.json`.
- Device smoke result tracking added in `docs/ANDROID_APP_BASE_SMOKE_RESULT.md`.

## Partial / Needs Hardening

- Android App-base full functional smoke is still pending final confirmation.
- Numeric keyboard behavior needs App-base verification.
- Records canvas chart was changed after App-base feedback and should be rechecked on device.
- Runtime i18n is implemented, but long-form guide and policy copy for non-Chinese languages still needs deeper native review.
- Ad slots are visual placeholders by decision; production ad SDK integration is deferred.
- Backend fake ad counters are in-memory only and reset on restart.
- Admin activity and retention metrics are stored in a local ignored JSON file for test persistence.
- Operations config is stored in the same ignored local JSON file and is for test/admin use only.
- App-base smoke status is intentionally backend/admin-only; user-visible app reactions come from ad placeholder visibility and test announcement.
- App-base smoke checklist status and notes are intentionally backend/admin-only.
- Android base status, App-base smoke status, H5 version, and release note are backend/admin-only.
- Shared state still lives in `pages/index/index.vue`; this is acceptable for MVP but may need a store if the app expands.

## Deferred / Future Scope

- Real ad slot abstraction
- Production ad SDK integration
- Rewarded video unlock flow
- Native notification reminders
- Final store listing copy and Android-device screenshots
- Android package build verification
- iOS validation

## Immediate Next Plan

### P0: Keep Current H5 MVP Stable

1. Keep `npm run typecheck` passing.
2. Keep `npm run audit:i18n` passing.
3. Keep `npm run audit:layout:h5` passing.
4. Keep `npm run build:h5` passing.
5. Keep `npm run smoke:h5` passing.
6. Refresh `npm run capture:store` after UI or copy changes.
7. Use `docs/DOCUMENTATION_INDEX.md` as the documentation map.

Current scope note:

- Android package verification is intentionally skipped.
- Production ad SDK integration is intentionally skipped.
- H5 screenshots and H5 layout audit can continue independently.

### P1: Compliance and Trust

1. Keep Android manifest permissions empty for the local-first, ad-placeholder-only MVP.
2. Confirm Privacy Policy text matches actual local-only behavior.
3. Confirm Disclaimer avoids medical claims.
4. Prepare store-safe short and long descriptions.
5. Review non-Chinese long-form translations before first release screenshots.

### P2: Placeholder-Only Monetization Surface

1. Keep fake ad placeholder mode available for layout and close-flow testing.
2. Keep internal placeholder metrics in the admin dashboard, not user Settings.
3. Do not add production ad SDK dependencies yet.
4. Preserve the rule that ads appear only after useful calculation results.
5. Defer rewarded guide unlock state until MVP smoke and compliance copy are stable.

### P3: Retention

1. Consider native notification reminders only after Android package smoke and permission review.
2. Expand target progress only after real user testing shows what summary is useful.
3. Add richer record editing fields only if weight/BMI editing is not enough in testing.
4. Consider a lightweight streak/check-in counter that does not require notification permission.
5. Consider a file-picker import only if clipboard CSV import is not enough after portability testing.

### P3.5: UX and Internationalization Polish

1. Complete native-quality long-form translations for Spanish, French, German, Japanese, Korean, Portuguese, Indonesian, Thai, and Vietnamese.
2. Keep the expanded `npm run audit:i18n` missing-key audit passing so new UI text cannot ship as hard-coded English.
3. Review text fit on narrow Android screens for long translated labels.
4. Add screenshots for English and Simplified Chinese as the first store-ready language set.
5. Keep unit abbreviations and health formulas language-neutral unless a locale-specific format is required.

### P4: Store Launch

1. Review generated H5 store screenshots from current UI.
2. Prepare final store screenshot captions if needed.
3. Build Android package only after Android package verification resumes.
4. Install and smoke test package after package verification resumes.
5. Finalize store listing copy and data safety notes.
6. Use `docs/STORE_LAUNCH_PREP.md` as the current copy and data-safety draft.

## Current Source Files

- Main page and shared state: `FitCal-Uniapp/pages/index/index.vue`
- Policy page: `FitCal-Uniapp/pages/policy/policy.vue`
- Feature components: `FitCal-Uniapp/components/`
- Calculator logic: `FitCal-Uniapp/services/calculators.ts`
- Storage logic: `FitCal-Uniapp/services/storage.ts`
- Policy content: `FitCal-Uniapp/services/policy.ts`
- Static options: `FitCal-Uniapp/data/appData.ts`
- Shared types: `FitCal-Uniapp/types/fitcal.ts`
- Smoke checklist: `docs/SMOKE_CHECKLIST.md`
- Android App-base smoke guide: `docs/ANDROID_APP_BASE_SMOKE.md`
- Store launch prep: `docs/STORE_LAUNCH_PREP.md`
- Brand assets: `docs/BRAND_ASSETS.md`
- Admin deployment: `ADMIN_DEPLOYMENT.md`
