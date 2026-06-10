# Next Implementation Plan

## Current Product Slice

The current MVP slice is a local-first single-photo editor:

- Import one local photo.
- Preview three composition modes: Full Frame, In-Photo, Bottom Band.
- Edit watermark text directly in the main panel.
- Edit manual metadata through a bottom sheet.
- Tune frame, text placement, and bottom-band controls.
- Render a composed PNG in the browser preview harness and expose a local
  download link.
- Adjust export width, format, and JPEG quality from Settings in the real H5
  app.
- Choose from six data-driven preset templates.
- See recent local exports on the import screen and Settings.
- Keep demo samples isolated from the real photo import path.

The browser preview harness remains useful for fast visual QA. The real uni-app
H5 build is now wired and can be served from `Signet-Uniapp/dist`; H5 photo
selection uses a native file picker and H5 export uses a DOM Canvas fallback
that shares the composition model.

Current phase assessment:

- The preview MVP is solid enough for continued QA and renderer-contract work.
- The H5 path is now functional enough for manual end-to-end validation with a
  real selected local photo and multiple export settings.
- The App MVP is not complete until one selected photo can be exported and
  saved from App runtime.
- Do not start EXIF, batch, monetization, or store-prep work before the real
  runtime export path is proven.

## Immediate Engineering Priority

### 1. Composition Model

Create one serializable model that describes the output:

- Source image path and natural dimensions.
- Mode: `fullFrame`, `inPhoto`, or `bottomBand`.
- Mat/background color.
- Border or band size.
- Caption text fields.
- Watermark visibility, anchor, size, opacity, and offset.
- Export target format and quality.

This model should feed both preview and export so the saved image cannot drift
from what the user sees.

Current progress:

- `Signet-Uniapp/preview/src/compositionModel.js` now provides the first
  browser-preview model builder.
- The model currently feeds the preview Canvas export path.
- Renderer smoke now checks required model fields, caption construction, and
  output filename extension in addition to dimensions.
- `Signet-Uniapp/common/compositionModel.js` now mirrors the model shape for
  real uni-app migration.
- The real uni-app index page builds the shared composition model and calls the
  first `common/uniCanvasRenderer.js` temp-file adapter from the export modal.
- The real uni-app export modal now keeps the generated temp-file path, shows it
  as the export preview when available, and exposes a save action.
- H5 runtime now bypasses App-only canvas APIs: it uses `common/h5CanvasRenderer.js`
  to render the same composition model into a DOM Canvas data URL and downloads
  the generated image.
- Real H5 Settings now persists export width, format, and JPEG quality; the
  export modal uses those settings before rendering.
- Real H5 now has data-driven preset templates and persisted editor defaults
  for template, watermark text, metadata, and style controls.
- The shared composition model now exposes readable text color for light/dark
  mats, and both renderers protect long watermark/metadata text from overflow.

### 2. Canvas Renderer

The browser preview harness now has a first Canvas renderer for:

- Full Frame: draw mat, photo, metadata line, and signature.
- In-Photo: draw source photo and watermark inside image bounds.
- Bottom Band: draw photo plus only a bottom extension band.

Next step: widen renderer coverage across source ratios, then port the same
composition contract to uni-app canvas APIs.

Renderer contract work required next:

- Mode-specific browser Canvas drawing has been moved to
  `Signet-Uniapp/preview/src/canvasRenderer.js`.
- Keep renderer inputs limited to the composition model plus a loaded image.
- Keep deterministic output sizing smoke cases for landscape, portrait, square,
  and wide sources.

Next renderer work:

- Renderer-level smoke checks now cover Full Frame, In-Photo, and Bottom Band
  output dimensions plus basic model and naming contracts.
- Shared uni-app renderer smoke now checks the common composition model and
  multi-ratio output dimensions.
- Validate `common/uniCanvasRenderer.js` in App; H5 now uses the DOM Canvas
  fallback because browser-preview tests do not prove uni-app App canvas
  behavior.

### 3. Export Flow

The browser preview export modal now supports:

- Rendering state.
- Success state with a blob download link.
- Failure state copy.
- Clear copy that export is local.
- Output file size and relative size against the source photo.
- PNG/JPEG choice, export width choice, and JPEG quality tuning.
- A larger generated-image preview inside the export modal so frame/text quality
  can be inspected before download.

Next step: finish manual H5 local-photo acceptance, then validate the App
temp-file and album-save path on device. Do not claim color-space preservation
or original-resolution export until device tests prove it.

Manual H5 pass criteria:

- A user-selected local photo opens the real editor.
- Export reaches `Ready locally`.
- The export modal shows output dimensions and file size.
- Save starts a browser download.
- The downloaded file contains the composed frame/text output.
- Small source images are not upscaled beyond their original width.

Recommended default while validation continues:

- JPEG Q86 for ordinary local sharing, with H5 auto-compression for small
  source photos when the generated JPEG is still larger than the source.
- PNG for exact text/frame inspection or when the user explicitly chooses it.
- Keep export history local-only and use it as user feedback, not as a cloud or
  account feature.

Current next implementation order:

1. Manual H5 pass with user-selected local photos, including one high-resolution
   phone photo.
2. Device/App runtime pass for `common/uniCanvasRenderer.js` temp-file export
   and album save.
3. Mobile visual pass for the six presets and long text on real device widths.
4. Only after those gates, evaluate EXIF and batch work.
- Keep 1600px width as the preview default until high-resolution memory tests
  pass on device.

### 4. EXIF Evaluation

After real H5/App export works:

- Evaluate `ExifReader` on H5.
- Evaluate App runtime support and fallback behavior.
- Keep manual metadata editing as the guaranteed path.

## Visual QA Rules

Before marking UI work complete:

- Generate a browser screenshot for editor, bottom band, in-photo position, and
  settings.
- Check a landscape and portrait image.
- Confirm no unexpected white edges appear inside the source photo area.
- Confirm long watermark and metadata text do not overflow controls.
- Confirm the main user path starts with `Choose Photo`, with demo content only
  available through an explicit demo action.
- Confirm demo sample selection does not navigate away before the user taps
  `Use Selected Demo`.
- Confirm portrait frames do not leave excessive left/right mat space.

## Four-Track Plan

### Track A: Preview Product Closure

- Finish visual QA for remaining In-Photo anchor combinations and long text.
- Validate landscape, portrait, square, and wide demo cases.
- Keep Settings export defaults covered by `npm run smoke:h5` and manually
  verify them with a user-selected local photo.
- Continue checking mobile-width screenshots after every layout change.

### Track B: Composition and Renderer

- Keep `compositionModel.js`, preset templates, and renderer helpers as the
  current shared contract.
- Keep mode-specific renderer functions small enough to validate on App runtime.
- Add renderer smoke cases for portrait, square, and wide source ratios, not
  only the current landscape baseline.

### Track C: Real uni-app Migration

- Keep H5 build scripts working with the locked DCloud/Vite dependency set.
- Keep `common/compositionModel.js` as the shared contract for
  `Signet-Uniapp/pages/index`.
- Validate the H5 DOM Canvas export/download path with a user-selected local
  photo across Full Frame, In-Photo, and Bottom Band.
- Validate the App hidden-canvas temp-file adapter and album save on device.

### Phase 1 Completion Gate

Phase 1 should only be marked complete when:

- Real H5 or App runtime can select one local photo.
- Real H5 or App runtime can export one composed image.
- Exported output visually matches the preview for Full Frame, In-Photo, and
  Bottom Band.
- Export failure can be surfaced and recovered from.
- A high-resolution phone photo has been tested for memory and output size.

### Track D: Deferred Metadata Work

- Keep manual metadata editing as the guaranteed path.
- Evaluate EXIF only after real export works.
- Do not start batch, subscription, marketplace, or cloud work before single
  photo export is proven.

## Deferred Until Real App Export Works

- Batch processing.
- Subscription and monetization surfaces.
- Template marketplace.
- Cloud sync.
- Signature background removal.
