# Validation Checklist

## Documentation Phase

- [x] README reduced to a project entry point.
- [x] Documentation index created.
- [x] Phase assessment document created.
- [x] MVP and deferred features separated.
- [x] Technical risks listed.
- [x] Design asset inventory started.

## Phase 1 Completion Gate

- [x] Real H5 runtime exposes local photo selection through a native browser
  file picker.
- [ ] Real H5 runtime has been manually validated with a user-selected local
  photo.
- [ ] Real H5 or App runtime can export one composed image from a selected
  local photo.
- [ ] Exported Full Frame output visually matches the preview.
- [ ] Exported In-Photo output visually matches the preview.
- [ ] Exported Bottom Band output visually matches the preview.
- [x] Export failure state can be surfaced with a visible Retry action in H5
  simulation.
- [ ] One high-resolution phone photo is tested for memory and output size.

## Phase 1 MVP Validation

- [x] App page skeleton exists.
- [x] Lightweight browser preview harness builds.
- [x] Lightweight browser preview server returns HTTP 200.
- [x] Browser DOM/style validation confirms editor mode thumbnails, framed photo
  shadow, settings rows, and settings detail sheet are present.
- [x] Browser screenshot validation confirms the local demo editor renders
  without the previous image white-edge artifact.
- [x] Browser interaction validation confirms direct watermark input updates the
  preview caption.
- [x] Real uni-app H5 build runs with compatible CLI dependencies.
- [x] Photo selection works in the browser preview harness via file input.
- [ ] Photo selection works in App runtime.
- [x] Static preview surface shows Full Frame, In-Photo, and Bottom Band modes.
- [x] Manual metadata bottom sheet is represented and reachable from the main
  editor panel.
- [x] Gallery frame renders as a static page skeleton.
- [x] Bottom Band exposes band height, text size, alignment, and background
  controls.
- [x] In-Photo exposes anchor, size, opacity, and offset controls.
- [x] Browser preview export creates a composed PNG image.
- [x] Browser preview export result visually matches the Full Frame preview
  layout.
- [x] Browser preview exposes PNG/JPEG format, export width, and JPEG quality
  controls.
- [x] Settings page can update preview export defaults for width, format, and
  JPEG quality.
- [x] Browser preview has a first composition model snapshot for source, mode,
  frame, text, watermark, and export settings.
- [x] Browser preview renderer is split into `preview/src/canvasRenderer.js`.
- [x] Renderer-level smoke check covers output dimensions for all three modes.
- [x] Renderer-level smoke check covers model shape and output naming.
- [x] Preview export defaults persist through local storage.
- [x] Real uni-app source has a shared `common/compositionModel.js` adapter.
- [x] Real uni-app source has a first `common/uniCanvasRenderer.js` temp-file
  adapter and hidden export canvas wiring.
- [x] Real uni-app source has an export modal save action wired after temp-file
  generation.
- [x] Real H5 source has a DOM Canvas export/download fallback using the shared
  composition model.
- [x] Real H5 Settings updates export width, format, and JPEG quality for the
  export flow.
- [x] Real H5 editor settings persist template, watermark text, metadata, and
  style controls.
- [x] Preset templates are data-driven and include Classic, Editorial,
  Signature, Minimal, Dark Mat, and Left Note.
- [x] Successful H5 exports are recorded in local export history.
- [x] Import and Settings surfaces show recent export history.
- [x] Settings can clear local export history.
- [x] H5 and uni-app canvas renderers constrain long watermark and metadata
  text during export rendering.
- [x] Shared renderer smoke covers landscape, portrait, square, and wide output
  dimensions.
- [x] Demo sample selection stays on the demo page until `Use Selected Demo`.
- [x] Portrait demo editor uses a narrower frame surface instead of a large
  landscape-style mat.
- [x] Bottom Band screen preview alignment matches the Left/Center/Right
  controls before export.
- [x] Export modal preview has been visually checked after the larger preview
  treatment and still renders a real generated image.
- [ ] Real uni-app export creates a composed image.
- [x] Export failure state is visible in H5 simulation and exposes Retry.
- [ ] Real uni-app page consumes the shared composition model.
- [x] Real H5 build output loads in the browser.
- [x] Real H5 `Choose Photo` creates a native `input[type=file]` picker.
- [x] Real H5 demo-photo export renders through the H5 DOM Canvas fallback and
  reaches `Ready locally`.
- [x] Real H5 demo-photo smoke covers Full Frame, Bottom Band, and In-Photo
  exports.
- [x] Export failure state has a visible Retry action.
- [x] User-provided H5 download was inspected as a real composed JPEG output.
- [ ] Real H5 export/download is manually validated after selecting a local
  photo.
- [ ] Downloaded H5 export file opens and contains the composed frame/text, not
  only the original photo.
- [ ] Real uni-app canvas temp-file adapter is validated in App runtime.
- [ ] Real uni-app export saves the generated temp file to the photo album where
  supported.

## Phase 2 EXIF Validation

- [ ] EXIF parser reads complete metadata from a test photo.
- [ ] Parser handles missing lens data.
- [ ] Parser handles stripped metadata.
- [ ] Shutter speed is formatted correctly.
- [ ] Aperture, ISO, focal length, and date formatting are correct.
- [ ] EXIF orientation is handled correctly.

## Phase 3 Batch Validation

- [ ] Batch of 3 images exports successfully.
- [ ] Batch of 10 images exports successfully.
- [ ] Batch of 30 images does not crash on target device.
- [ ] Failed image does not stop the whole queue without recovery.
- [ ] Progress state remains accurate.

## UI and i18n Validation

- [ ] English labels fit.
- [ ] German labels fit.
- [ ] French labels fit.
- [ ] Japanese labels fit.
- [x] H5 UI audit checks mobile and tablet import, editor, Bottom Band, export,
  Settings, and failure states.
- [x] Controls do not overlap on audited H5 mobile/tablet widths.
- [x] Export modal remains inside the viewport on audited H5 mobile/tablet
  widths.
- [x] Buttons and sliders remain stable in automated H5 smoke/audit flows.
- [x] Main editor controls keep long metadata text to one line with ellipsis in
  preview harness.

## Privacy Validation

- [ ] No photo upload endpoint exists.
- [ ] App does not request unnecessary permissions.
- [ ] Privacy copy matches actual behavior.
- [ ] Store screenshots show implemented features only.

## Latest Local Verification

Date: 2026-06-10

Commands:

```powershell
cd Signet-Uniapp/preview
npm run smoke:renderer
npm run smoke:shared-renderer
npm run build
cd ..
npm install
npm run build:h5
npm run smoke:shared-renderer
npm run smoke:h5
npm run audit:h5-ui
```

Observed:

- Vite build completed successfully.
- `npm run smoke:shared-renderer` passed with landscape Full Frame
  `1600x1483`, landscape In-Photo `1600x1200`, landscape Bottom Band
  `1600x1520`, portrait Full Frame `1600x2414`, square In-Photo `1600x1600`,
  and wide Bottom Band `1600x1120`.
- `docs/PHASE_ASSESSMENT.md` was added to record that the browser-preview MVP
  is validated but the real uni-app MVP is not complete yet.
- Local preview server returned HTTP 200 in the previous validation pass.
- Automated browser screenshot verified `Try Demo` editor state.
- Automated browser interaction changed watermark text to `My Custom Mark` and
  the preview caption updated.
- Image stage and rendered image height differed by only the border thickness,
  confirming the earlier white-edge artifact was removed.
- Automated browser export generated a local blob download named
  `signet-fullFrame-*.png`.
- Export preview image loaded at 1600 by 1483 for the Full Frame demo case.
- Latest browser checks verified import, demo, portrait editor, and Settings
  export defaults after visual-density fixes.
- `compositionModel.js` was added for browser preview export modeling.
- `canvasRenderer.js` was added to separate browser Canvas drawing from page
  state.
- `npm run smoke:renderer` passed with Full Frame `1600x1483`, In-Photo
  `1600x1200`, and Bottom Band `1600x1520`.
- Renderer smoke now also checks the composition-model contract and generated
  export filename extension.
- Preview export defaults now persist in local storage.
- Browser check changed defaults to `1200px / PNG`, reloaded, confirmed the
  setting persisted, then restored the default JPEG export profile.
- Browser visual check confirmed the Settings Export controls no longer inherit
  the close-button circle style and labels fit inside their buttons.
- Browser visual check confirmed Bottom Band alignment changes are visible in
  the screen preview, not only in the Canvas export result.
- Browser visual check confirmed Bottom Band export renders a generated
  `1600x1520` JPEG preview and reports `560 KB / 24% of original size` for the
  landscape demo case.
- Browser mobile-width check at `390x844` found no real visible horizontal
  overflow; the only flagged zero-size element was the hidden file input.
- Real uni-app source has `common/compositionModel.js` and
  `common/uniCanvasRenderer.js`; the export modal now calls the temp-file
  adapter, previews the generated temp file when ready, and exposes a save
  action.
- The real uni-app export/save path still needs H5/App runtime validation before
  it can be marked complete.
- In-app browser regression on `http://localhost:5188/` confirmed import home,
  demo isolation, editor entry, and browser-preview export still work. Export
  produced a ready download link and a generated `1600x1483` preview image.
- Real H5 `npm run build:h5` passes with the locked DCloud/Vite dependency set.
- Real H5 `npm run smoke:h5` passes. It serves the built H5 output on a
  temporary local port, checks the document title is `Signet`, loads
  `?demoPhoto=landscape#/`, exports to `Ready locally`, verifies
  `Q86 / No upscale / 1600px cap`, and asserts the export canvas is
  `1600x1483`.
- The same H5 smoke changes Settings export options to `1080px / PNG`, verifies
  the Settings summary updates, then verifies a custom PNG export reaches
  `Ready locally` with a `1080x1002` canvas.
- H5 smoke also verifies Bottom Band export at `1600x1520` and In-Photo export
  at `1600x1200`.
- H5 smoke verifies the Signature preset path reaches the Position screen and
  confirms Settings exposes Reset Editor.
- Real H5 build output served from `http://localhost:5192/` returned HTTP 200.
- In-app browser opened the real H5 build output and confirmed the real import
  page renders.
- Clicking real H5 `Choose Photo` creates a native `input[type=file]` picker,
  proving the H5 photo selection path is no longer preview-only.
- H5 save behavior now explicitly uses browser download. App/mini-program save
  behavior remains on `uni.saveImageToPhotosAlbum`.
- H5 export no longer upscales beyond the selected source width. Small source
  images use their source width rather than the 1600px cap.
- H5 export defaults to JPEG Q86 and applies an H5 auto-compression guard when
  the generated JPEG remains larger than a small source photo.
- User-provided download
  `C:\Users\Yt\Downloads\signet-fullFrame-1080px-1780991629020.jpg` was
  inspected: `1080x1211`, `118308` bytes, 24-bit JPEG, and it contains the
  composed Full Frame image rather than only the source photo.
- The inspected output showed the Full Frame metadata/signature area was too
  prominent, so the shared renderer now uses a smaller caption typography
  layout for metadata and signature text.
- In-app browser opened `http://localhost:5192/?demoPhoto=landscape#/`; the
  real H5 editor loaded the demo photo dimensions, generated a Full Frame
  `1600x1483` export, reached `Ready locally`, and reported
  `295 KB / 10%` with `Q86 / No upscale / 1600px cap`.
- In-app browser layout metrics measured the compact Name/Metadata switch row
  at roughly 53px high, reducing the prior pressure on the Border slider row.
- `npm run build:h5` passed on 2026-06-10 with the existing DCloud/Vite
  warnings.
- `npm run smoke:shared-renderer` passed on 2026-06-10.
- `npm run smoke:h5` passed on 2026-06-10 and now covers six presets, export
  history record/clear behavior, long-text export, simulated export failure,
  default JPEG export, custom PNG export, Bottom Band, and In-Photo exports.
- `npm run audit:h5-ui` passed on 2026-06-10. It checks mobile and tablet
  import, editor, Bottom Band, export success, Settings with recent history,
  and export failure screens. It also asserts no horizontal overflow and export
  modal viewport fit.

Manual H5 validation needed:

1. Open `http://localhost:5192/`.
2. Click `Choose Photo` and select one local JPG or PNG.
3. Confirm the editor opens and shows the selected photo dimensions.
4. Click `Export`.
5. Confirm the modal reaches `Ready locally`, shows an output size, and says
   `Download`.
6. Click `Save`.
7. Open the downloaded file and confirm it is the composed Signet image.
8. For small input images, confirm the downloaded file is not unexpectedly much
   larger because of 1600px upscaling or overly high JPEG quality.

Screenshots:

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
- `Signet-Uniapp/preview/visual-editor-current.png`
- `Signet-Uniapp/preview/visual-editor-custom-watermark.png`
- `Signet-Uniapp/preview/visual-settings-current.png`
- `Signet-Uniapp/preview/visual-export-ready.png`
- `Signet-Uniapp/preview/audit3-home-final.png`
- `Signet-Uniapp/preview/audit3-mobile-home.png`
- `Signet-Uniapp/preview/audit3-bottom-center.png`
- `Signet-Uniapp/preview/audit3-bottom-left.png`
- `Signet-Uniapp/preview/audit3-bottom-right.png`
- `Signet-Uniapp/preview/audit3-export-bottom.png`
