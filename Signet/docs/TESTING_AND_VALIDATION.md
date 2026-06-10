# Testing and Validation

Date: 2026-06-10

This document is the repeatable validation entry point for Signet. It records
what is automated now, what each command proves, and what still requires manual
H5 or App runtime testing.

## Automated Commands

Run from `Signet-Uniapp`:

```powershell
npm run build:h5
npm run smoke:shared-renderer
npm run smoke:h5
npm run audit:h5-ui
```

## What Each Command Covers

### `npm run build:h5`

Builds the real H5 runtime into `Signet-Uniapp/dist`.

Known non-blocking warnings:

- DCloud/Vite CJS API deprecation warning.
- `NODE_ENV=production` warning from the uni-app build environment.

### `npm run smoke:shared-renderer`

Validates the shared composition model and renderer sizing contract without a
browser UI.

Covered source ratios:

- Landscape Full Frame: `1600x1483`.
- Landscape In-Photo: `1600x1200`.
- Landscape Bottom Band: `1600x1520`.
- Portrait Full Frame: `1600x2414`.
- Square In-Photo: `1600x1600`.
- Wide Bottom Band: `1600x1120`.

### `npm run smoke:h5`

Runs a Playwright-backed functional smoke against the built H5 runtime.

Covered behavior:

- Page title is `Signet`.
- Demo photo opens the real H5 editor.
- Default JPEG export reaches `Ready locally`.
- Custom `1080px / PNG` export reaches `Ready locally`.
- Full Frame, Bottom Band, and In-Photo exports produce expected canvas sizes.
- Export settings persist.
- Six preset templates are present.
- Signature preset opens the Position flow.
- Export history is recorded and can be cleared.
- Long watermark and metadata settings still export successfully.
- Simulated export failure shows `Export failed`, a useful error, and `Retry`.

### `npm run audit:h5-ui`

Runs a Playwright-backed UI audit against the built H5 runtime. It checks both
mobile and tablet viewports, saves screenshots, and asserts basic layout
stability.

Covered screens:

- Import home.
- Full Frame editor.
- Bottom Band editor.
- Export success modal.
- Settings with recent export history.
- Export failure modal.

Automated UI assertions:

- No horizontal overflow on checked screens.
- Export cards fit inside the viewport.
- Required screen text and controls are present.
- Recent export history appears after an export.

Screenshot outputs:

- `Signet-Uniapp/preview/audit-h5-home-mobile.png`
- `Signet-Uniapp/preview/audit-h5-editor-mobile.png`
- `Signet-Uniapp/preview/audit-h5-bottom-band-mobile.png`
- `Signet-Uniapp/preview/audit-h5-export-mobile.png`
- `Signet-Uniapp/preview/audit-h5-settings-mobile.png`
- `Signet-Uniapp/preview/audit-h5-home-tablet.png`
- `Signet-Uniapp/preview/audit-h5-editor-tablet.png`
- `Signet-Uniapp/preview/audit-h5-bottom-band-tablet.png`
- `Signet-Uniapp/preview/audit-h5-export-tablet.png`
- `Signet-Uniapp/preview/audit-h5-settings-tablet.png`
- `Signet-Uniapp/preview/audit-h5-export-error.png`

## Manual H5 Acceptance

Manual validation is still needed because automated demo-photo checks do not
prove browser download behavior for a user-selected private file.

Required pass:

1. Open `http://localhost:5192/`.
2. Select one local JPG or PNG.
3. Confirm the editor shows the selected image and dimensions.
4. Export with default `1600px / JPEG`.
5. Save and open the downloaded file.
6. Confirm the downloaded file contains the Signet composition, not only the
   original photo.
7. Repeat with `1080px / PNG` from Settings.
8. Test one high-resolution phone photo for memory and output-size behavior.

## App Runtime Acceptance

The App runtime is not complete until this path is verified on device:

1. Open the real uni-app project in HBuilderX or App runtime.
2. Select one local photo.
3. Export through `common/uniCanvasRenderer.js`.
4. Confirm a temp file is created.
5. Save through `uni.saveImageToPhotosAlbum`.
6. Record permission prompts, unsupported APIs, or platform-specific failures.

## Deferred Validation

Do not expand validation into these areas until single-photo H5/App runtime
export is proven:

- EXIF parsing.
- Batch export.
- Store assets.
- Monetization.
