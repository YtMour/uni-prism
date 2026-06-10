# Phase Assessment

Date: 2026-06-09

## Assessment Summary

Signet has a validated browser-preview MVP slice, but it is not yet a complete
uni-app MVP.

The current stage is strong enough to continue product-detail refinement and
renderer-contract work. It is not yet strong enough to start batch processing,
EXIF automation, monetization, or store packaging.

## What Is Now Solid

The browser preview harness has proven the core product direction:

- The first screen starts from real local photo import, not a fake default image.
- Demo content is isolated behind an explicit demo entry.
- The editor supports Full Frame, In-Photo, and Bottom Band modes.
- Watermark text can be edited directly in the main editor controls.
- Manual metadata fields remain editable through a sheet.
- Name and metadata visibility can be toggled.
- Bottom Band has visible controls for height, text size, alignment, and
  background.
- In-Photo has visible controls for anchor, size, opacity, and offset.
- Export can render a composed browser Canvas image for all three modes.
- Export settings include width, PNG/JPEG format, and JPEG quality.
- The export modal reports output size and source-relative size.
- The renderer is separated behind a composition model in the preview harness.
- Browser smoke checks cover renderer dimensions, model shape, and export
  naming.
- In-app browser screenshot checks have covered import, mobile-width import,
  Bottom Band alignment, and Bottom Band export preview.

This means the interaction model and the visual direction are no longer just
mockups. They are executable and testable in the preview harness.

## What Is Not Yet Complete

The main incompleteness is runtime confidence:

- The real uni-app H5 build is still not validated because of dependency
  resolution issues.
- The App runtime has not validated photo selection.
- The App runtime has not validated Canvas export.
- The `common/uniCanvasRenderer.js` adapter exists, but its temp-file output is
  not proven in H5 or App.
- Save-to-album behavior is not implemented or validated.
- Large-photo memory behavior is not measured.
- Full-resolution quality, color-space preservation, HEIC/HEIF behavior, and
  EXIF orientation are not proven.

Because of this, the current state should be treated as a validated prototype
plus migration scaffold, not a release-ready app.

## Current Completeness Judgment

| Area | Status | Judgment |
| --- | --- | --- |
| Product direction | Good | The photo watermark/frame concept is clear and usable. |
| Browser preview UI | Mostly good | Main flows work, but more long-text and ratio QA is still needed. |
| Browser export | Good for prototype | It renders real files and exposes quality tradeoffs. |
| Composition model | Good baseline | Enough to continue porting, but more ratio cases should be tested. |
| Real uni-app runtime | Incomplete | H5/App export and save are not proven. |
| EXIF | Not started | Manual metadata is the guaranteed fallback. |
| Batch workflow | Not started | Should stay deferred. |
| Store readiness | Not ready | Runtime, privacy, screenshots, and permissions are not validated. |

## Is The Current Stage "完善"?

No, not as an app.

It is reasonably complete as a browser-preview MVP prototype. It is not complete
as a uni-app MVP because the real runtime path is the product path, and that
path still lacks validated export and save behavior.

The next work should therefore focus on closing the gap between preview and real
uni-app runtime, while continuing visual QA only where it protects the export
contract.

## Next Objective

The next objective is:

```text
Make one real uni-app runtime path export one composed image from one selected
photo, using the same composition model as the browser preview.
```

This should be considered the Phase 1 completion gate.

## Recommended Next Work Order

1. Re-check the uni-app H5 dependency issue and document the exact blocker.
2. Add renderer smoke cases for portrait, square, and wide source ratios.
3. Validate `common/uniCanvasRenderer.js` in H5 if the dependency issue is
   resolved.
4. If H5 remains blocked, validate the renderer adapter through the nearest
   available uni-app/App runtime path.
5. Only after temp-file export works, add save-to-album behavior.
6. Then run a visual parity pass: preview image versus exported image for Full
   Frame, In-Photo, and Bottom Band.

## Gates Before Phase 2

Do not begin EXIF, batch, monetization, or store-prep work until these are true:

- Real H5 or App runtime can select a photo.
- Real H5 or App runtime can export a composed image.
- Exported output visually matches the preview for all three MVP modes.
- Export failure state can be triggered or simulated and recovered from.
- At least one high-resolution phone photo is tested for memory and output
  size behavior.

## Documentation Impact

This assessment supersedes older wording that described Canvas export as the
highest-priority missing piece in the browser preview. Browser-preview Canvas
export now exists. The highest-priority missing piece is validated real
uni-app runtime export and save behavior.
