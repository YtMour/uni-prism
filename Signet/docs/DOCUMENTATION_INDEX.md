# Signet Documentation Index

This directory is the source of truth for the Signet project. The current
repository is in Phase 1 MVP scaffold: documentation is established, the
`Signet-Uniapp` source exists, and a lightweight browser preview harness is used
for iterative UI and flow validation.

## Core Documents

| Document | Purpose |
| --- | --- |
| [PROJECT_STATUS_AND_PLAN.md](PROJECT_STATUS_AND_PLAN.md) | Current state, phase plan, and decision log. |
| [CURRENT_APP_ASSESSMENT.md](CURRENT_APP_ASSESSMENT.md) | Current product maturity, completed capabilities, and route beyond low-level MVP. |
| [PHASE_ASSESSMENT.md](PHASE_ASSESSMENT.md) | Stage completeness assessment and Phase 1 completion gate. |
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | Product positioning, audience, jobs-to-be-done, and MVP shape. |
| [FEATURE_SPEC.md](FEATURE_SPEC.md) | Feature inventory split by MVP, next phase, and deferred scope. |
| [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md) | Proposed implementation model for photo selection, EXIF, canvas, and export. |
| [UI_STYLE_GUIDE.md](UI_STYLE_GUIDE.md) | Visual language, layout rules, typography, and asset direction. |
| [PAGE_DESIGN_SPEC.md](PAGE_DESIGN_SPEC.md) | Concrete page inventory, visible content, actions, and implementation notes. |
| [PRIVACY_AND_STORE_PREP.md](PRIVACY_AND_STORE_PREP.md) | Local-first privacy stance and app store preparation notes. |
| [VALIDATION_CHECKLIST.md](VALIDATION_CHECKLIST.md) | Verification checklist for H5, App runtime, EXIF, export quality, and memory safety. |
| [TESTING_AND_VALIDATION.md](TESTING_AND_VALIDATION.md) | Repeatable automated test commands, UI audit coverage, screenshots, and manual acceptance gates. |
| [NEXT_IMPLEMENTATION_PLAN.md](NEXT_IMPLEMENTATION_PLAN.md) | Next engineering slice, centered on real runtime export/save validation. |
| [DESIGN_ASSETS.md](DESIGN_ASSETS.md) | Generated design asset inventory and prompt records. |

## Current Source-of-Truth Rules

- `README.md` is the entry point only.
- `PROJECT_STATUS_AND_PLAN.md` owns project status.
- `FEATURE_SPEC.md` owns feature scope and priority.
- `TECHNICAL_ARCHITECTURE.md` owns technical assumptions and risks.
- `PAGE_DESIGN_SPEC.md` owns page-level UI content and flow.
- `VALIDATION_CHECKLIST.md` owns verification gates.
- `TESTING_AND_VALIDATION.md` owns repeatable command-level validation details.
- Generated visual assets must be listed in `DESIGN_ASSETS.md` before they are
  referenced by implementation work.

## Current Assessment

Read `CURRENT_APP_ASSESSMENT.md` and `PHASE_ASSESSMENT.md` before expanding
scope. The project has moved beyond a browser-preview-only MVP because real H5
can export and download composed images. It is still not a complete App product
until App runtime temp-file export and album save are validated on device.

## Immediate Next Step

Use `NEXT_IMPLEMENTATION_PLAN.md` for the next implementation slice. The
highest-priority gap is no longer browser-preview Canvas export. The
highest-priority gap is validated real uni-app runtime export and save behavior.
For day-to-day regression checks, run the command set in
`TESTING_AND_VALIDATION.md`.
