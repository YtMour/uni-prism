# Implementation Roadmap

Last updated: 2026-06-05

## Roadmap Summary

FitCal has moved from planning into an implemented offline MVP. The next work should focus on hardening the current app, splitting the large page into maintainable modules, then preparing Android release requirements.

## Phase 0: Planning and Visual Direction

Status: completed

Delivered:

- Product name and positioning
- Feature scope
- Monetization strategy
- Compliance notes
- Implementation status tracking
- Visual style guide
- Overview and detailed screen PNGs

Artifacts:

- `docs/PRODUCT_PLAN.md`
- `docs/FEATURE_SPEC.md`
- `docs/MONETIZATION_PLAN.md`
- `docs/COMPLIANCE_NOTES.md`
- `docs/design/FITCAL_VISUAL_STYLE_GUIDE.md`
- `docs/design/fitcal-overview-board.png`

## Phase 1: Offline MVP

Status: implemented, with hardening remaining

Goal:

Build a usable calculator app with no server dependency.

Delivered:

- uni-app project scaffold
- TypeScript app entry and Vite config
- BMI calculator tab
- Calories calculator tab
- Guidance tab
- Records tab
- Settings tab
- Local record storage
- Individual record delete action
- Data-driven weight/BMI trend chart
- Height, weight, and age validation states
- Unit preference storage
- Dedicated Privacy Policy and Disclaimer pages
- Runtime language selector and i18n service
- Simplified Chinese UI coverage for main flows, policy/disclaimer pages, dynamic guide copy, BMI category labels, and feedback toasts
- Core mainstream-language coverage for navigation, settings, records, and primary actions
- Ad placeholder slots
- H5 typecheck and build verification
- Feature screen component split

Remaining hardening:

- Android App base validation UX refinement
- Route-level smoke coverage
- Android App base smoke verification

Acceptance status:

- User can calculate BMI: done
- User can calculate BMR/TDEE and target calories: done
- User can read simple diet guidance: done
- User can save and view recent records: done
- User can delete individual records: done
- User can clear local data: done
- User can see local weight/BMI trend: done
- User can open dedicated privacy/disclaimer pages: done
- App runs in H5 preview: done
- Feature screens are split into components: done
- App package can be smoke-tested on Android: pending

## Phase 1.5: MVP Hardening

Status: next

Goal:

Make the implemented MVP maintainable and safer before adding monetization SDKs.

Delivered:

- Split `pages/index/index.vue` into feature components:
  - `components/BmiScreen.vue`
  - `components/CaloriesScreen.vue`
  - `components/GuidanceScreen.vue`
  - `components/RecordsScreen.vue`
  - `components/SettingsScreen.vue`

Remaining deliverables:

- Refine numeric validation on Android App base:
  - Keyboard behavior
  - Edge-case copy
  - Empty input timing
- Add route-level smoke tests for policy navigation and Records deletion.
- Add Android App base smoke checklist.
- Add i18n hard-coded text audit.
- Review translated text fit on Android App base.

Acceptance criteria:

- `npm run typecheck` passes.
- `npm run build:h5` passes.
- H5 visual check passes at `http://localhost:5179/`.
- App base smoke test confirms navigation, calculation, local storage, and clear data behavior.
- No core calculator action depends on ads, network, or login.

## Phase 2: Ad Integration

Status: planned

Goal:

Add monetization without damaging the core utility flow.

Deliverables:

- Ad slot abstraction component
- Result page ad placement
- Guidance page ad placement
- Development fallback state
- Unsupported-platform fallback state
- Rewarded video prototype for enhanced guidance

Rules:

- Never place ads before the first useful result.
- Never block BMI or calorie calculation behind ads.
- Rewarded ads may unlock optional extended guidance only.

Acceptance criteria:

- Basic calculator remains usable when ads fail to load.
- Placeholder and production ad modes share the same layout contract.
- Rewarded ad unlock is clearly optional.

## Phase 3: Retention Features

Status: planned

Goal:

Increase repeat usage and stable ad impressions.

Deliverables:

- Data-driven weight trend chart
- BMI trend chart
- Target weight setting
- Goal progress summary
- Record filtering
- Daily or weekly reminder setting
- Optional check-in/streak summary without notification permissions
- Local CSV export/import for record portability

Acceptance criteria:

- User can see weight/BMI trend from local records.
- User can set a target and track progress.
- Reminder setting is optional and user-controlled.
- Export/import does not require login or network.

## Phase 4: Store Launch

Status: planned

Goal:

Prepare overseas release assets and compliance materials.

Deliverables:

- Android build package
- App icons and splash assets
- Store title, subtitle, short description, long description
- Store screenshots
- Privacy policy
- Disclaimer
- Data safety declarations
- Android install smoke test

Acceptance criteria:

- Store materials avoid medical claims.
- Privacy policy matches actual data behavior.
- App package can be installed and smoke-tested.
- App does not request unnecessary sensitive permissions.

## Phase 5: Expansion

Status: future

Possible additions:

- Native-quality long-form translations for all selected mainstream languages
- Imperial unit refinement
- Macro calculator
- Ideal weight calculator
- Water intake calculator
- Body fat estimate
- Meal template packs
- Premium ad-free purchase
- Cloud backup only if usage justifies it

## Phase 6: Internal Operations Maturity

Status: future

Possible additions:

- Admin App-base smoke result form with structured pass/fail fields
- i18n coverage report in CI/local smoke
- Operations config history for release-note and announcement edits
- Safer local metrics retention and export from the backend

Expansion rule:

Operational tools should stay out of the user-facing app and should not add Android permissions.

Expansion rule:

New features should improve retention, search acquisition, or monetization. Avoid complex nutrition workflows before the basic calculator loop has stable usage.
