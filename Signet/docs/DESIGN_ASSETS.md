# Design Assets

This file tracks generated visual references and project-bound assets.

## Style Baseline

All generated images should follow Gallerist Minimalism:

- Warm paper background.
- Minimal gallery composition.
- Midnight ink and espresso accents.
- Quiet controls.
- Soft natural shadows.
- High-end photography presentation.

Avoid:

- Dark editing-suite UI.
- Neon gradients.
- Busy sticker aesthetics.
- Real camera brand logos.
- Text-heavy generated UI that must be read exactly.

## Generated Asset Inventory

Generated first set:

| File | Purpose |
| --- | --- |
| `assets/design/signet-visual-direction.png` | Overall product and visual direction reference. |
| `assets/design/signet-editor-mockup.png` | Mobile editor UI mockup reference. |
| `assets/design/signet-exif-frame-example.png` | Example exported photo with EXIF gallery frame. |
| `assets/design/pages/signet-import-empty-page.png` | Concrete import / empty state page. |
| `assets/design/pages/signet-editor-frame-page.png` | Concrete frame editing page. |
| `assets/design/pages/signet-caption-sheet-page.png` | Concrete manual caption bottom-sheet page. |
| `assets/design/pages/signet-watermark-position-page.png` | Concrete in-photo watermark position page. |
| `assets/design/pages/signet-bottom-band-page.png` | Concrete bottom-only metadata band page. |
| `assets/design/pages/signet-export-progress-page.png` | Concrete local export progress page. |
| `assets/design/pages/signet-settings-page.png` | Concrete settings page. |
| `Signet-Uniapp/static/app-icon-1024.png` | Project app icon source, normalized to 1024 by 1024. |
| `Signet-Uniapp/static/demo-landscape.png` | Bundled demo landscape image for preview/demo project. |
| `Signet-Uniapp/static/import-placeholder.png` | Import empty-state framed placeholder artwork. |

## Prompt Records

### `Signet-Uniapp/static/app-icon-1024.png`

Purpose: app icon source for future HBuilderX / app-store icon generation.

Prompt summary:

```text
Create a premium app icon for Signet, a local-first photo watermark and EXIF
gallery framing app. Use an off-white gallery mat frame holding a minimal
mountain-and-lake photograph, with a small signature mark line beneath the
image. Use warm paper, midnight ink, mist sage, espresso accents, tactile paper,
subtle shadows, and no readable text.
```

Usage notes:

- Generated with imagegen, then normalized locally to 1024 by 1024.
- Keep as the high-resolution source for platform-specific icon sizes.
- Avoid adding readable text to icon variants.

### `Signet-Uniapp/static/demo-landscape.png`

Purpose: deterministic bundled demo photo for the browser preview harness and
template thumbnails.

Prompt summary:

```text
Create a high-quality natural landscape sample photo for Signet's demo editor:
an alpine lake with layered mountains, calm reflection, shoreline rocks, and
evergreen trees. Use realistic editorial travel photography, natural muted
greens, mist sage, cool blue-gray sky, and no text, logo, watermark, frame, UI,
or border.
```

Usage notes:

- Generated with imagegen, then normalized locally to 1600 by 1200.
- Used only for explicit demo and preset preview states.
- Real editing flow should still start from user-selected local photos.

### `Signet-Uniapp/static/import-placeholder.png`

Purpose: import empty-state artwork.

Prompt summary:

```text
Create a refined empty photo placeholder for Signet: an off-white gallery mat
frame containing a pale abstract mountain-photo placeholder, with tactile paper,
soft shadows, and no readable text, logo, watermark, device mockup, neon, or
busy background.
```

Usage notes:

- Generated with imagegen, then normalized locally to 1024 by 1024.
- Used on the import screen before a user selects a photo.
- Should remain visually quiet and not look like a user-imported photograph.

### `assets/design/signet-visual-direction.png`

Purpose: product visual direction reference.

Prompt summary:

```text
Create a refined visual direction board for Signet, a privacy-first photo
watermark and EXIF gallery framing app. Use warm contemporary gallery surfaces,
paper-white materials, a framed photograph, restrained typography samples,
color swatches, and a minimal mobile app glimpse. Keep the palette aligned with
warm paper, gallery gray, midnight ink, espresso, mist sage, and tiny soft red
accents. Avoid real camera brand logos, neon gradients, dark editing-suite UI,
busy sticker aesthetics, watermarks, and clutter.
```

Usage notes:

- Use as a mood and composition reference.
- Do not treat small generated UI text as final copy.
- The overall paper, photo, typography, and color direction is valid for future
  screens.

### `assets/design/signet-editor-mockup.png`

Purpose: mobile editor interface mockup reference.

Prompt summary:

```text
Create a polished mobile app screen mockup for Signet's photo editor. Show one
selected photograph in a gallery mat frame, an EXIF caption under the image,
and compact controls for border, text size, opacity, and layout. Use a premium
minimal interface with warm paper, gallery gray, midnight ink, espresso, and
mist sage. Avoid dark UI, neon, real camera brand logos, dense illegible text,
overlapping UI, and watermarks.
```

Usage notes:

- Use as a first editor layout reference.
- Replace generated icons with real implementation icons.
- Preserve the hierarchy: image preview first, compact controls second.

### `assets/design/signet-exif-frame-example.png`

Purpose: final exported EXIF gallery-frame example reference.

Prompt summary:

```text
Create a finished example of a Signet exported photograph with an elegant EXIF
gallery frame. Show a portrait travel photograph centered inside a wide
off-white passepartout mat border, with a restrained EXIF caption row beneath
the image and a tiny creator mark. Use realistic premium print presentation,
soft natural gallery light, off-white paper, subtle gray, midnight ink, and a
tiny espresso accent. Avoid real camera brand logos, fake social UI, neon, dark
backgrounds, watermarks, clutter, and invasive overlays.
```

Usage notes:

- Use as the target feel for the first gallery frame template.
- The exact generated photo is a placeholder and not a bundled product sample.
- Future export implementation should reproduce the frame layout
  deterministically in canvas rather than embedding this bitmap.

### `assets/design/pages/signet-import-empty-page.png`

Purpose: concrete first screen / empty editor state.

Key content:

- `Signet`
- `Choose Photo`
- `Local editing only`
- `Classic`
- `Editorial`

Implementation note: build this as the first real app page; it should route to
photo selection and settings.

### `assets/design/pages/signet-editor-frame-page.png`

Purpose: concrete selected-photo editor page.

Key content:

- `Edit Frame`
- `Export`
- frame preview
- `Frame`, `Text`, `Layout`
- `Border` slider
- `Mat` swatches

Implementation note: build the frame surface with layout / canvas primitives;
do not embed the generated image.

### `assets/design/pages/signet-caption-sheet-page.png`

Purpose: concrete manual EXIF caption editing state.

Key content:

- `Caption`
- `Camera`
- `Lens`
- `Shutter`
- `Aperture`
- `ISO`
- `Focal`
- `Cancel`
- `Apply`

Implementation note: use as the Phase 1 fallback before automatic EXIF parsing.

### `assets/design/pages/signet-watermark-position-page.png`

Purpose: concrete in-photo watermark positioning page.

Key content:

- `Position`
- photo preview with watermark drawn inside the image
- 3 by 3 anchor grid
- `Top`
- `Center`
- `Bottom`
- `Size`
- `Offset`
- `Cancel`
- `Apply`

Implementation note: this page represents direct in-image watermarking. It is
separate from full-frame and bottom-band output modes.

### `assets/design/pages/signet-bottom-band-page.png`

Purpose: concrete bottom-only extension band page.

Key content:

- `Bottom Band`
- `Export`
- preview with a band added only under the photo
- `Band Height`
- `Alignment`
- `Left`
- `Center`
- `Right`
- `Background`

Implementation note: this output mode extends only the bottom canvas area and
must not draw over the source photo.

### `assets/design/pages/signet-export-progress-page.png`

Purpose: concrete local export progress state.

Key content:

- `Export`
- `Saving locally`
- progress bar
- `Render full frame`
- `Save to Photos`
- `Cancel`
- `Done`
- `No upload`

Implementation note: progress must be tied to actual render and save steps.

### `assets/design/pages/signet-settings-page.png`

Purpose: concrete settings page.

Key content:

- `Settings`
- `Language`
- `Export`
- `Privacy`
- `About`
- `Privacy Policy`
- `Photos stay on this device`

Implementation note: `Privacy / Local processing / On` is a status row, not a
toggle to disable local processing.
