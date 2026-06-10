# Project Status and Plan

## Current Status

Signet is in Phase 1 product hardening. The documentation skeleton is complete,
the `Signet-Uniapp` template has been cleaned, and the real H5 runtime now
validates the core single-photo export/download flow.

The project is no longer just a browser-preview MVP. Real H5 has a working
single-photo export path, but the full App product is not complete until App
runtime canvas/temp-file export and album save are validated on device. See
`CURRENT_APP_ASSESSMENT.md` and `PHASE_ASSESSMENT.md` for the current
completeness judgment.

Completed:

- Product concept captured in the original README.
- Documentation source-of-truth structure created.
- MVP boundary separated from later subscription, batch, and store work.
- Initial `Signet-Uniapp` template cleanup.
- uni-app / Vue 3 source scaffold.
- Import empty state with real photo selection flow.
- Browser preview harness at `Signet-Uniapp/preview`.
- Editor frame state with selected local photo metadata.
- Three output modes: `Full Frame`, `In-Photo`, and `Bottom Band`.
- Directly editable watermark text in the main editor panel.
- Manual metadata sheet with editable camera/lens/shutter/aperture/ISO/focal
  fields.
- Name and metadata visibility toggles.
- In-photo watermark anchor, size, opacity, and offset controls.
- Bottom band height, text size, alignment, and background controls.
- Browser preview Canvas export for Full Frame, In-Photo, and Bottom Band, with
  local PNG/JPEG download link.
- Settings page with grouped rows and detail sheet.
- Local demo project in preview harness, separated from the real `Choose Photo`
  flow.
- Preview export defaults are now adjustable from Settings: width, format, and
  JPEG quality.
- A first browser-preview `compositionModel` module now captures source image,
  frame, text, watermark, and export settings as one serializable snapshot.
- Browser preview Canvas drawing is now split into
  `preview/src/canvasRenderer.js`, so page state, model building, and export
  rendering are no longer all embedded in `main.js`.
- Browser preview export settings persist in local storage for width, format,
  and JPEG quality.
- Renderer smoke validation exists for Full Frame, In-Photo, and Bottom Band
  output dimensions, plus the basic composition-model and export-naming
  contract.
- Browser visual validation now covers import, mobile-width import, Bottom Band
  alignment, and Bottom Band export preview in the in-app browser.
- Real uni-app source now has `common/compositionModel.js` and the index page
  builds the same composition model shape for export.
- Real uni-app source now has a first `common/uniCanvasRenderer.js` adapter and
  hidden export canvas wiring in `pages/index/index.vue`.
- Real uni-app export modal now renders through the shared temp-file adapter,
  previews the generated temp file when available, and exposes a runtime save
  action.
- Real H5 build is now wired through `Signet-Uniapp/package.json`,
  `vite.config.js`, and `scripts/run-h5.mjs`.
- Real H5 runtime now uses a native file picker for local photo selection.
- Real H5 export now has a DOM Canvas fallback that renders the shared
  composition model and downloads the composed image.
- Real H5 smoke now covers the built page title, demo-photo import, export-ready
  state, export policy text, and generated canvas size.
- Real H5 Settings now changes export width, format, and JPEG quality for
  subsequent exports; direct H5 query overrides are available for smoke/debug
  URLs.
- Preset templates are now data-driven through `common/presetTemplates.js`.
- Editor defaults for template, watermark text, metadata, and style controls
  persist through `common/editorSettingsStore.js`.
- Real H5 export now avoids source upscaling, defaults to JPEG Q86, and applies
  an H5 auto-compression guard when a small source photo would otherwise produce
  a larger generated file.
- A user-generated H5 Full Frame download has been inspected as a real composed
  JPEG output; the remaining H5 gate is confirming the full manual interaction
  sequence from local picker to saved download.

Recently fixed:

- Removed preview white-edge artifacts caused by fixed minimum image stage
  height plus `object-fit: contain`.
- Moved watermark and metadata editing into the main editing panel so users do
  not need to discover a hidden tab before changing output text.
- Replaced remote demo image dependency with a local demo asset so preview
  validation is deterministic.
- Preview stage now follows the selected photo's real aspect ratio instead of
  forcing every sample into the same square frame.
- Export panel now reports output file size and relative size against the
  source photo so PNG/JPEG quality tradeoffs are visible during validation.
- Real H5 export panel now reports effective JPEG quality, no-upscale status,
  and output width cap.
- Full Frame export typography was reduced so metadata and signature read as a
  photo caption instead of oversized title text.
- User-facing app/browser title is now `Signet`; `Signet-Uniapp` remains only a
  source directory name.
- H5 smoke now verifies both the default JPEG 1600px export path and a custom
  PNG 1080px export path.
- H5 smoke now verifies real H5 exports for Full Frame, Bottom Band, and
  In-Photo modes.
- Export failure state now exposes a Retry action.
- H5 smoke now checks the Signature preset path and Settings Reset Editor
  control.
- Presets now cover six production-oriented variants: Classic, Editorial,
  Signature, Minimal, Dark Mat, and Left Note.
- Recent export history is now stored locally after successful render/download
  generation, appears on the import screen and Settings, and can be cleared
  from Settings.
- H5 and uni-app canvas renderers now shrink long watermark and metadata text
  to fit the available output width instead of letting export text overflow.
- Dark Mat exports now use a readable light caption color from the shared
  composition model.
- H5 smoke now covers template count, export history record/clear behavior,
  long-text export, and simulated export failure with a visible Retry action.
- `npm run audit:h5-ui` now provides automated H5 UI coverage for mobile and
  tablet import, editor, Bottom Band, export, Settings, and failure states.
- The import preset grid now falls back to two columns on very narrow screens,
  and export cards are height-limited with internal scrolling for small
  viewports.
- Demo sample selection now stays inside the demo page until the user explicitly
  enters the editor.
- Preview frame sizing is ratio-aware so portrait photos do not sit inside a
  large landscape-oriented mat.
- Bottom Band preview alignment now visibly follows Left/Center/Right controls
  before export.
- Export modal preview has a larger generated-image preview area for checking
  text and frame quality before download.
- Import page spacing was tightened and mobile-width checked to reduce the
  perceived empty lower area without reintroducing horizontal overflow.

Not started:

- EXIF parsing.
- i18n resources.
- Batch mode.
- App runtime device validation.
- Broader real-device mobile layout QA.

Completeness judgment:

- Browser-preview product slice: mature enough for fast visual QA.
- Real H5 product slice: functional for single-photo local export/download and
  now hardened around presets, history, long text, failure recovery, and
  automated UI regression checks.
- Real App product slice: incomplete until App runtime can export and save one
  composed image from one selected photo.
- Expansion features: not ready to start beyond targeted technical evaluation.

Waiting for validation:

- Full manual H5 end-to-end validation with a user-selected local photo.
- EXIF parsing feasibility across H5 and App runtime.
- Full-resolution canvas export quality.
- Memory behavior for large photos.
- Whether Display P3 / HDR preservation is possible through the selected export
  path.
- Real uploaded-photo behavior in App runtime, especially HEIC/HEIF support and
  orientation handling.
- Complete multi-aspect preview and export comparisons across portrait, square,
  wide, and landscape photos.
- Manual H5 end-to-end confirmation with the user's selected local photo and
  downloaded output file.
- Validating the real uni-app canvas export adapter in App after device runtime
  checks are available.
- Validating the real App save path: App/mini-program album save.

## Phase Plan

### Phase 0: Documentation Skeleton

Goal: create stable planning documents before source code exists.

Deliverables:

- Documentation index.
- Product spec.
- Feature spec.
- Technical architecture.
- UI style guide.
- Privacy and validation checklists.
- Initial generated design references.

Exit criteria:

- The repository has a clear implementation route and no longer depends on a
  single long README.

### Phase 1: MVP Scaffold

Goal: create a runnable uni-app application with one local image editing flow.

Target capabilities:

- Select one image.
- Display image preview.
- Apply a simple gallery border.
- Edit visible text metadata.
- Place text inside the image or in a bottom-only band.
- Export composed image locally.

Validation:

- Browser preview harness builds and runs.
- Preview screenshot checks cover the import, frame editor, bottom band, and
  settings states.
- Real uni-app H5 build runs after compatible CLI dependencies are resolved.
- H5 smoke verifies basic navigation, export-ready behavior, default export
  policy, Settings export controls, and custom export sizing.
- App runtime smoke verifies image selection and export on at least one device.
- User-editable watermark text and metadata fields remain in the product model.

Next implementation slice:

- Treat the existing browser preview composition model as the current renderer
  contract.
- Keep the shared composition model and uni-app renderer adapter aligned with
  browser-preview smoke coverage.
- Manually validate H5 with a real selected local photo and exported download.
- Validate the current uni-app canvas temp-file path on App.
- Validate the App save behavior: album save where supported.
- Add more production templates only after App runtime proof; current templates
  are already data-driven enough for Phase 1.

### Phase 2: EXIF and Template System

Goal: convert the MVP from manual framing to metadata-aware framing.

Target capabilities:

- Parse camera model, lens, shutter, aperture, ISO, focal length, and capture
  date when available.
- Provide manual fallback fields.
- Add two gallery frame templates.
- Add one small copyright watermark template.

Validation:

- Test with photos that include complete EXIF, partial EXIF, and no EXIF.
- Verify formatting for English and one long-label language.

### Phase 3: Batch Workflow

Goal: process multiple images safely without memory spikes.

Target capabilities:

- Batch selection.
- Shared template settings.
- FIFO export queue.
- Progress UI.

Validation:

- Export 3, 10, and 30 images.
- Track failure recovery and memory behavior.

### Phase 4: Store and Monetization Prep

Goal: prepare the app for external testing and commercial packaging.

Target capabilities:

- Privacy policy.
- App metadata.
- Freemium gates.
- Subscription or one-time unlock strategy.

Validation:

- Confirm required permissions.
- Confirm no photo upload path exists.
- Confirm app store copy matches actual behavior.

## Decision Log

- The first implementation should be local-first and offline by default.
- MVP should prioritize reliable export over advanced visual effects.
- Subscription, brand logo auto-detection, and signature cutout are deferred
  until the core editing path is validated.
- Design assets generated during planning are references, not final app assets.
- For photo-heavy flows, preview fidelity should prefer the source aspect ratio
  and preserve the original framing unless the user explicitly selects a crop.
- Watermark export should stay local-only and expose size/quality tradeoffs
  rather than hiding them behind a single default compression choice.
