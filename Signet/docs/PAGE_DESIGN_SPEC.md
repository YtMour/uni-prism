# Page Design Spec

This document turns the generated page images into implementable page specs.
Generated images are layout references; final implementation must use real
components, deterministic text, responsive constraints, and accessible controls.

## Page Inventory

| Page | Reference image | Implementation priority |
| --- | --- | --- |
| Import Empty | `assets/design/pages/signet-import-empty-page.png` | Phase 1 |
| Editor Frame | `assets/design/pages/signet-editor-frame-page.png` | Phase 1 |
| Caption Sheet | `assets/design/pages/signet-caption-sheet-page.png` | Phase 1 |
| Watermark Position | `assets/design/pages/signet-watermark-position-page.png` | Phase 1 |
| Bottom Band | `assets/design/pages/signet-bottom-band-page.png` | Phase 1 |
| Export Progress | `assets/design/pages/signet-export-progress-page.png` | Phase 1 |
| Settings | `assets/design/pages/signet-settings-page.png` | Phase 1 |

## Shared Layout Rules

- Use warm paper page background.
- Keep the photo or frame as the strongest visual element.
- Use a serif title for page identity and sans-serif labels for controls.
- Keep controls compact and grouped.
- Prefer icon buttons for navigation and settings.
- Use sliders for numeric controls.
- Use swatches for color choices.
- Avoid nested cards in implementation.
- Do not copy generated device chrome into app UI.
- Browser previews should use a full-width app canvas. Do not wrap the page in
  an artificial centered phone frame that creates unrelated left/right gutters.

## Import Empty Page

Reference:

```text
assets/design/pages/signet-import-empty-page.png
```

Purpose:

- First app state before a photo is selected.
- Direct the user into the local photo selection flow.
- Establish privacy-first behavior without a marketing page.

Visible content:

- Top title: `Signet`.
- Settings icon button.
- Central empty frame placeholder.
- Primary action: `Choose Photo`.
- Privacy hint: `Local editing only`.
- Recent preset row.
- Preset tiles: `Classic`, `Editorial`.

Primary actions:

- `Choose Photo`: opens local photo picker.
- Settings icon: navigates to Settings page.
- Preset tile: selects default frame before image import.

Implementation notes:

- Placeholder frame should be a deterministic component, not a bitmap.
- Recent presets can be static in MVP.
- The privacy hint should be short and non-blocking.
- The editor should not show a default photo as if it were the user's image.
  Demo content, if needed for preview, must be a clearly separate demo action.

## Editor Frame Page

Reference:

```text
assets/design/pages/signet-editor-frame-page.png
```

Purpose:

- Main editing surface after a photo is selected.
- Let the user tune frame style, mat color, caption style, and layout.

Visible content:

- Back icon.
- Page title: `Edit Frame`.
- Primary action: `Export`.
- Large framed photo preview.
- EXIF caption row under the photo.
- Bottom control panel with tabs: `Frame`, `Text`, `Layout`.
- Frame template tiles.
- `Border` slider.
- `Mat` color swatches.

Primary actions:

- Back: returns to import state or previous photo list.
- Export: opens Export Progress page.
- Tab selection: switches the control group.
- Frame tile: selects frame template.
- Border slider: changes mat / border width.
- Mat swatch: changes frame surface color.

Implementation notes:

- The preview area needs stable aspect-ratio handling for portrait, landscape,
  and square photos.
- The generated frame preview should be implemented via layout and canvas, not
  by embedding the mockup image.
- Caption text should be editable through Caption Sheet.
- Export button should be disabled until a valid image is loaded.

## Caption Sheet

Reference:

```text
assets/design/pages/signet-caption-sheet-page.png
```

Purpose:

- Edit manual metadata before EXIF auto-fill exists.
- Provide fallback when EXIF is missing.

Visible content:

- Dimmed editor background.
- Bottom sheet title: `Caption`.
- Form rows:
  - `Camera`
  - `Lens`
  - `Shutter`
  - `Aperture`
  - `ISO`
  - `Focal`
- Buttons:
  - `Cancel`
  - `Apply`

Primary actions:

- Tap row: edit field or open a simple picker.
- Cancel: discard changes and close sheet.
- Apply: update preview caption and close sheet.

Implementation notes:

- Use a real modal / bottom-sheet component.
- Preserve scroll safety for small screens.
- Validate that long values do not overflow the value field.
- Use this page before automatic EXIF parsing exists.

## Watermark Position Page

Reference:

```text
assets/design/pages/signet-watermark-position-page.png
```

Purpose:

- Add a watermark directly inside the photo bounds.
- Choose a 3 by 3 anchor point for watermark placement.
- Tune size and offset without changing the output frame mode.

Visible content:

- Back icon.
- Page title: `Position`.
- Photo preview with watermark text inside the image.
- 3 by 3 anchor grid.
- Row labels: `Top`, `Center`, `Bottom`.
- `Size` slider.
- `Offset` slider.
- Buttons:
  - `Cancel`
  - `Apply`

Primary actions:

- Anchor point: selects watermark position.
- Size slider: changes text / mark scale.
- Offset slider: nudges the watermark away from the anchor.
- Cancel: discards position edits.
- Apply: updates the editor preview.

Implementation notes:

- This mode draws within the original photo rectangle, not in the mat or outside
  band.
- Use bottom-center as the default text watermark position.
- Keep watermark coordinates normalized so the same setting works across aspect
  ratios.
- Future implementation should add separate X and Y offsets if one slider is
  not precise enough.

## Bottom Band Page

Reference:

```text
assets/design/pages/signet-bottom-band-page.png
```

Purpose:

- Add a clean information band below the photo without surrounding the whole
  image in a full frame.
- Provide a compact EXIF / creator mark area while preserving the original
  photo content.

Visible content:

- Back icon.
- Page title: `Bottom Band`.
- Primary action: `Export`.
- Preview with photo and a bottom-only off-white information band.
- `Band Height` slider.
- `Alignment` segmented control: `Left`, `Center`, `Right`.
- `Background` swatches.

Primary actions:

- Band Height: changes extension height.
- Alignment: aligns caption content in the band.
- Background swatch: changes band surface color.
- Export: starts export with bottom-band composition.

Implementation notes:

- This is not a full passepartout frame. Only the bottom output canvas area is
  extended.
- The photo should remain unobscured.
- Use the same metadata formatting pipeline as the full-frame caption.
- This mode should be available from the layout / template control group.

## Export Progress Page

Reference:

```text
assets/design/pages/signet-export-progress-page.png
```

Purpose:

- Communicate local export status.
- Keep privacy reassurance close to the export action.

Visible content:

- Back icon.
- Page title: `Export`.
- Export preview thumbnail.
- Status: `Saving locally`.
- Numeric progress percentage.
- Progress bar.
- Queue status: `1 of 3`.
- Checklist:
  - `Render full frame`
  - `Save to Photos`
- Buttons:
  - `Cancel`
  - `Done`
- Privacy line: `No upload`.

Primary actions:

- Cancel: attempts to stop export queue.
- Done: returns to editor or result state after export completes.

Implementation notes:

- MVP can show `1 of 1`; batch queue should later reuse the same pattern.
- Progress must be driven by actual render/save states, not a fake timer.
- `Done` should remain disabled until save succeeds.

## Settings Page

Reference:

```text
assets/design/pages/signet-settings-page.png
```

Purpose:

- Hold app-level preferences and privacy information.

Visible content:

- Page title: `Settings`.
- Grouped list:
  - `Language` / `English`
  - `Export` / `JPEG / High`
  - `Privacy` / `Local processing / On`
  - `About` / `Version 0.1`
  - `Privacy Policy`
- Bottom note: `Photos stay on this device`.

Primary actions:

- Language: opens language selector.
- Export: opens export settings.
- Privacy: opens privacy summary.
- About: opens app version page or modal.
- Privacy Policy: opens local policy page.

Implementation notes:

- In MVP, language can be visible but limited to English until i18n is wired.
- Privacy toggle should not imply the user can disable local processing; it is a
  status row, not a behavior switch.
- Use real icons from the chosen implementation icon set.

## Page Flow

```text
Import Empty
  -> Choose Photo
  -> Editor Frame
      -> Caption Sheet
      -> Watermark Position
      -> Bottom Band
      -> Export Progress
  -> Settings
```

## Implementation Priority

1. Import Empty page.
2. Editor Frame page with static placeholder photo.
3. Caption Sheet manual fields.
4. Watermark Position page.
5. Bottom Band page.
6. Export Progress static state.
7. Settings page.
8. Replace placeholder flow with real image picker and export.
