# Feature Spec

## MVP Features

Scope note: the browser-preview harness already implements a validated MVP
prototype of these flows. Phase 1 App MVP completion requires the same
composition model to work in a real H5 or App runtime from local photo
selection through export and save.

### Photo Import

Purpose: select one local photo and prepare it for preview.

Requirements:

- Use `uni.chooseImage` or equivalent App runtime path.
- Store only local temporary paths.
- Read the selected image's name, type, size, width, height, and aspect ratio.
- Read image width and height.
- Show a failure state when the image cannot be loaded.
- Support multiple image formats and preserve the original file as the primary
  source for preview and export planning.

### Gallery Frame Preview

Purpose: show the selected photo in a minimal art-frame layout.

Requirements:

- Warm paper background.
- Image area centered with stable aspect ratio.
- The source photo area must not show artificial white edges caused by preview
  container sizing. Letterboxing is only allowed when explicitly selected as a
  template behavior.
- Optional outer border / mat area.
- Caption row below image.
- Preview controls separated from the image surface.
- Main editor controls must expose the current photo summary, watermark text,
  metadata editor entry, and name/metadata visibility toggles without requiring
  the user to discover a secondary tab first.

### Watermark Placement Modes

Purpose: support more than a full gallery frame. Signet must also let users add
watermarks directly inside the photo or in a bottom-only extension band.

Required MVP modes:

- `Full Frame`: photo is placed inside a mat / passepartout style border.
- `In-Photo`: watermark text is drawn inside the original photo bounds.
- `Bottom Band`: only the bottom area is extended with a clean information band.

`In-Photo` requirements:

- 3 by 3 anchor placement: top-left, top-center, top-right, middle-left,
  middle-center, middle-right, bottom-left, bottom-center, bottom-right.
- Bottom-center should be the default for text watermarks.
- Support size, opacity, and offset controls.
- Keep the watermark inside the image bounds.
- Warn or preview clearly when the watermark overlaps important image content.
- Allow the watermark text itself to be edited by the user.
- Keep name/metadata toggles separate from the main text so the user can choose
  how much information appears.

`Bottom Band` requirements:

- Preserve the photo content without overlay.
- Add a band only below the image.
- Support band height, alignment, background color, text size, and caption
  content.
- Text size changes must affect the preview immediately.
- Use this as the first alternative to the full-frame EXIF template.

### Manual Metadata Caption

Purpose: provide an MVP fallback before EXIF parsing exists.

Fields:

- Camera model.
- Lens model.
- Shutter speed.
- Aperture.
- ISO.
- Focal length.
- Watermark text / signature name.

Editing requirements:

- Watermark text must be directly editable in the main editor panel.
- Manual metadata fields must remain available from an explicit `Metadata`
  action.
- Long metadata lines must truncate in controls instead of expanding the layout.

Example output:

```text
Shot on A7R IV | FE 35mm f/1.4 GM | 1/500s f/1.4 ISO 100
```

### Export

Purpose: save the composed image locally in real H5 or App runtime.

Requirements:

- Use the shared composition model rather than a separate export-only state.
- Export the full composition, not only the source photo.
- Keep preview-to-export coordinate mapping deterministic.
- Report export success and failure clearly.
- Save the generated image locally where the runtime supports it.
- Avoid claiming original color-space preservation before validation.
- Treat format detection, aspect ratio, and scaling as part of the export
  planning model.

## Phase 2 Features

### EXIF Parsing

Purpose: auto-fill metadata from the selected image.

Candidate dependency:

- `ExifReader` as the first library to evaluate.

Required fields:

- Camera model.
- Lens model.
- Exposure time.
- F-number.
- ISO.
- Focal length.
- Capture date.

Fallback:

- Manual edit remains available when metadata is missing or stripped.

### Template Library

Initial templates:

- Classic Passepartout.
- Editorial caption.
- Minimal copyright corner.
- Bottom metadata band.
- In-photo bottom-center watermark.

Requirements:

- Template settings should be serializable.
- Template preview must support landscape, portrait, and square images.

## Phase 3 Features

### Batch Processing

Purpose: apply one style to multiple photos.

Requirements:

- Batch list with thumbnails.
- Shared template settings.
- Per-image metadata override.
- FIFO export queue.
- Progress and recoverable failure state.

### Tile Watermark

Purpose: protect e-commerce or catalog images.

Requirements:

- Text or logo repeated diagonally.
- Density, rotation, and opacity controls.
- Preview should make interference obvious before export.

## Deferred Features

- Signature background removal.
- Camera brand logo auto-detection.
- Subscription billing.
- Store review assets.
- Cloud sync.
- Preset marketplace.

## Open Questions

- Which runtime targets are mandatory for the first release: H5, App iOS,
  Android, or mini-program?
- Should the first monetization model be subscription, one-time unlock, or paid
  export packs?
- Is the app primarily for photographers or e-commerce sellers? The visual
  system favors photographers; tile watermarking favors sellers.
