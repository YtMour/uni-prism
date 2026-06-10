# Signet

This directory contains the Signet uni-app source.

Current status:

- HBuilderX-style uni-app template has been cleaned.
- Main page and settings page now model real local photo import and editable
  watermark text.
- A shared composition model and first uni-app canvas temp-file adapter exist.
- The export modal calls the temp-file adapter, shows the generated image when
  available, and exposes a runtime save action.
- Real H5 build is now wired and passes locally. H5 photo selection uses a
  native browser file picker, then the export modal renders the same composition
  model through an H5 canvas fallback and downloads the generated image.
- Real H5 Settings can change export width, format, and JPEG quality for the
  next export.
- Six data-driven presets are available: Classic, Editorial, Signature,
  Minimal, Dark Mat, and Left Note.
- Successful exports are recorded in local history and can be cleared from
  Settings.
- Long watermark and metadata text are constrained during export rendering.
- App runtime album save is still not device-validated, so this is not a
  complete App MVP yet.
- EXIF parsing remains deferred until the real single-photo export/save path is
  proven.

## Real H5 Runtime

Install and build from this directory:

```bash
npm install
npm run build:h5
npm run smoke:shared-renderer
npm run smoke:h5
npm run audit:h5-ui
```

Serve the build output for local browser validation:

```bash
node scripts/serve-dist.mjs 5192
```

Open:

```text
http://localhost:5192/
```

Manual validation path:

1. Click `Choose Photo` and select one local image.
2. Optionally open `Settings` -> `Export` and adjust width, format, or quality.
3. Click `Export`.
4. Wait for `Ready locally`.
5. Click `Save` to download the composed image.

The H5 export width is capped at 1600px but will not upscale a smaller source
image beyond its original width. JPEG export defaults to Q86 and H5 may
automatically step quality down when the generated file is still larger than a
small selected source photo.

For direct smoke/debug URLs, H5 also accepts `exportWidth`, `exportFormat`, and
`jpegQuality` query parameters, plus `simulateExportError=1` for failure-state
testing, for example:

```text
http://localhost:5192/?demoPhoto=landscape&exportWidth=1080&exportFormat=png#/
```

For automated layout/export smoke without selecting a private local file, open:

```text
http://localhost:5192/?demoPhoto=landscape#/
```

`npm run audit:h5-ui` also writes regression screenshots into
`Signet-Uniapp/preview/audit-h5-*.png`.

## Pages

- `pages/index/index.vue`: import state, editor state, caption sheet, in-photo
  position controls, bottom-band controls, editable watermark text, and export
  progress modal.
- `pages/settings/settings.vue`: settings and privacy status page.

## Legacy Visual Preview

The lightweight preview harness is still available for fast visual inspection,
but it is not the active manual-test target. Use the real H5 runtime on port
`5192` for product validation. The preview harness may run on port `5188` only
when specifically checking legacy browser-preview behavior.

```bash
cd preview
npm install
npm run dev -- --port 5188
```

Open:

```text
http://localhost:5188/
```

The preview harness is the currently validated browser-preview MVP prototype.
It mirrors the current page flow for visual inspection and renderer-contract
work, but it does not prove the real H5/App runtime path. Implementation source
of truth remains under `pages/` and `common/`.

Preview-specific behavior:

- `Choose Photo` opens the browser file picker.
- `Try Demo` is a separate preview-only shortcut for checking layout and
  controls without selecting a local file.
- The production uni-app page does not inject a default photo into the editor.
