# Current App Assessment

Date: 2026-06-10

## Verdict

Signet is no longer just a low-level browser-preview MVP. It now has a real H5
runtime path that can select a local photo, build the shared composition model,
render a composed image through H5 Canvas, and download the generated file.

It is still not a complete App product. The main remaining blocker is App
runtime validation: the uni-app hidden canvas/temp-file renderer and album-save
path still need to be tested on device.

## Completed Product Capability

- Real H5 local photo selection through a native browser file picker.
- Real H5 export and browser download using the shared composition model.
- Three composition modes: Full Frame, In-Photo, and Bottom Band.
- Editable watermark text and manual metadata fields.
- Name and metadata visibility toggles.
- In-photo position, opacity, size, and offset controls.
- Bottom band height, text size, alignment, and background controls.
- Export Settings for width, format, and JPEG quality.
- No-upscale export behavior for smaller source photos.
- H5 auto-compression guard for small JPEG source photos.
- Export modal output dimensions, size, relative-size, and policy labels.
- Retry action for export failure state, with H5 simulation coverage for the
  failure UI.
- Data-driven preset templates for Classic, Editorial, Signature, Minimal,
  Dark Mat, and Left Note.
- Persistent editor settings for template, watermark text, metadata, and style
  controls.
- Settings reset control for editor defaults.
- Recent export history stored locally, shown on the import screen and Settings,
  with a local clear action.
- Long watermark and metadata text protection in both H5 and uni-app canvas
  renderers.
- H5 smoke coverage for default JPEG export, custom PNG export, and all three
  composition modes, plus presets, history, long-text export, and failure state.

## Current Maturity

| Area | Status | Notes |
| --- | --- | --- |
| Browser preview prototype | Mature | Useful for fast visual QA, not the product gate. |
| Real H5 runtime | Functional | Single-photo export/download is implemented and smoke-tested. |
| Real App runtime | Not proven | Needs device validation for temp-file canvas and album save. |
| Export settings | Functional | H5 Settings and debug query overrides are wired. |
| Visual output | Improving | Multi-mode smoke exists; long text is constrained in export renderers. |
| Privacy model | Directionally sound | No upload path is implemented, but final privacy copy needs verification. |
| Production readiness | Not ready | App runtime, high-res memory, and failure recovery still need validation. |

## What Is Still Missing

- App runtime manual smoke: select one photo, render temp file, save to album.
- Full manual H5 end-to-end pass with a user-selected local photo across
  `1600/JPEG` and `1080/PNG`.
- High-resolution phone photo memory and output-size testing.
- Visual parity checks between preview and exported files for all three modes.
- Manual user-selected H5 download pass across more local photo types.
- Permission/privacy audit for App packaging.
- Broader mobile layout visual QA across small screens.

## Recommended Route

### Track 1: Close H5 Phase 1

- Manually validate local-photo export/download with `1600/JPEG`.
- Manually validate local-photo export/download with `1080/PNG`.
- Compare downloaded outputs against the on-screen preview for Full Frame,
  In-Photo, and Bottom Band.
- Test one high-resolution phone photo.

### Track 2: App Runtime Proof

- Open in HBuilderX or App runtime.
- Select one local photo.
- Validate `common/uniCanvasRenderer.js` creates a temp file.
- Validate `uni.saveImageToPhotosAlbum` saves the generated image.
- Record any permission prompts or unsupported APIs.

### Track 3: Product Hardening

- Continue template polishing only through the current data-driven preset model.
- Tighten mobile layout checks for long metadata and long watermark names on
  real devices.
- Keep EXIF, batch, monetization, store assets, and marketplace work deferred
  until App runtime proof is complete.
