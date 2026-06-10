# Technical Architecture

## Intended Stack

- Framework: uni-app with Vue 3 and Vite.
- State: local reactive store first; persistent settings after MVP.
- Rendering: preview canvas plus export canvas.
- Image metadata: manual fields in Phase 1; evaluate `ExifReader` only after
  real export/save works.
- Storage: local temporary paths and local settings only.

## Core Flow

```text
Select image
  -> read image info
  -> load preview source
  -> apply frame settings
  -> preview composition
  -> export via render canvas
  -> save locally
```

## Canvas Model

The editor should separate preview interaction from export rendering.

Preview canvas:

- Uses a downscaled display representation.
- Optimized for interaction and layout tuning.
- Does not need to preserve original pixel dimensions.

Render canvas:

- Uses deterministic scale mapping from preview layout to export layout.
- Generates the final composed image.
- Should be created only when export starts.
- Should be released after each export.

Coordinate mapping:

```text
scale = exportWidth / previewWidth
exportX = previewX * scale
exportY = previewY * scale
exportFontSize = previewFontSize * scale
```

## EXIF Parsing Plan

Phase 1 avoids automatic EXIF parsing and uses manual metadata fields.

Phase 2 validates:

- Reading local image bytes as `ArrayBuffer`.
- Parsing image bytes with `ExifReader`.
- Formatting shutter speed, aperture, ISO, focal length, camera model, lens, and
  capture date.
- Handling metadata stripped by social apps.

Risk:

- H5 and App runtime may expose different file access behavior.
- Some images may not contain readable metadata.
- EXIF orientation must be handled before final export.

## Export Quality Risks

Claims that must remain unverified until device testing:

- Full original resolution export.
- Display P3 preservation.
- HDR preservation.
- Lossless visual equivalence.

The engineering target is high-quality local export. The documentation should
not promise exact color-space preservation until verified.

## Phase 1 Runtime Gate

The current browser-preview harness proves interaction and renderer direction,
but it is not the real product runtime. Phase 1 should only be marked complete
after a real H5 or App runtime can:

- Select one local photo.
- Build the shared composition model.
- Render one composed image through the uni-app canvas adapter.
- Save the generated image locally where supported.
- Match the browser-preview output closely for Full Frame, In-Photo, and Bottom
  Band.

## Batch Queue

Batch export should use a FIFO queue after the single-photo MVP is stable.

Rules:

- Do not use `Promise.all` for large image rendering.
- Export one image at a time.
- Release canvas and image references after each item.
- Track progress and failed items.

## Suggested Source Layout

```text
src/
  pages/
    editor/
    settings/
  components/
    PhotoPreview.vue
    FrameControls.vue
    MetadataEditor.vue
    ExportProgress.vue
  services/
    imagePicker.ts
    exifReader.ts
    renderCanvas.ts
    exportQueue.ts
  stores/
    editorStore.ts
    settingsStore.ts
  styles/
    tokens.scss
    typography.scss
```

## Validation Before Expansion

Do not begin advanced features until these are proven:

- One image can be selected and previewed.
- One image can be exported locally.
- Preview and export layout match.
- Export does not crash on a high-resolution phone photo.
