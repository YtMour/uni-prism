# Implementation Roadmap

Last updated: 2026-06-04

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
- Unit preference storage
- Privacy/disclaimer modal entry points
- Ad placeholder slots
- H5 typecheck and build verification

Remaining hardening:

- Dedicated Privacy Policy page
- Dedicated Disclaimer page
- Input validation and error states
- Data-driven trend chart
- Component split for the current large `index.vue`
- Android App base smoke verification

Acceptance status:

- User can calculate BMI: done
- User can calculate BMR/TDEE and target calories: done
- User can read simple diet guidance: done
- User can save and view recent records: done
- User can clear local data: done
- App runs in H5 preview: done
- App package can be smoke-tested on Android: pending

## Phase 1.5: MVP Hardening

Status: next

Goal:

Make the implemented MVP maintainable and safer before adding monetization SDKs.

Deliverables:

- Split `pages/index/index.vue` into feature components:
  - BMI screen component
  - Calories screen component
  - Guidance screen component
  - Records screen component
  - Settings screen component
  - Shared card/input/result/nav components if useful
- Add numeric validation:
  - Height range
  - Weight range
  - Age range
  - Empty input handling
- Replace static records chart with data-driven chart rendering.
- Add dedicated Privacy Policy and Disclaimer pages.
- Add route/page entries in `pages.json` for policy pages.
- Add Android App base smoke checklist.

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

Acceptance criteria:

- User can see weight/BMI trend from local records.
- User can set a target and track progress.
- Reminder setting is optional and user-controlled.

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

- Multi-language support
- Imperial unit refinement
- Macro calculator
- Ideal weight calculator
- Water intake calculator
- Body fat estimate
- Meal template packs
- Premium ad-free purchase
- Cloud backup only if usage justifies it

Expansion rule:

New features should improve retention, search acquisition, or monetization. Avoid complex nutrition workflows before the basic calculator loop has stable usage.
