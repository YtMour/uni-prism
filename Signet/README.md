# Signet

Signet is a privacy-first photo watermark and gallery framing app concept for
independent photographers, creators, and small sellers. The intended product is
a uni-app / Vue 3 mobile application that can decorate photos with tasteful
gallery-style borders, creator marks, and manually editable camera metadata
while keeping the entire workflow local on the device.

Current status: validated browser-preview MVP prototype plus a real uni-app
migration scaffold. This is not yet a complete App MVP. Phase 1 is complete
only when a real H5 or App runtime can select one local photo, export one
composed image with the same composition model, and save it locally.

## Product Direction

- Local-first single-photo watermarking and gallery-style presentation for
  Phase 1.
- Gallerist Minimalism visual style: warm paper surfaces, restrained typography,
  soft shadows, and non-invasive framing.
- MVP focus: select one local photo in real H5/App runtime, preview a single
  composition model, add text/manual metadata, adjust core layout controls, and
  export/save the composed image locally.
- Deferred scope: subscription billing, brand logo auto-detection, signature
  background removal, large batch rendering, and store submission.

## Documentation

Start with the documentation index:

- [Documentation Index](docs/DOCUMENTATION_INDEX.md)
- [Project Status and Plan](docs/PROJECT_STATUS_AND_PLAN.md)
- [Product Spec](docs/PRODUCT_SPEC.md)
- [Feature Spec](docs/FEATURE_SPEC.md)
- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [UI Style Guide](docs/UI_STYLE_GUIDE.md)
- [Privacy and Store Prep](docs/PRIVACY_AND_STORE_PREP.md)
- [Validation Checklist](docs/VALIDATION_CHECKLIST.md)
- [Design Assets](docs/DESIGN_ASSETS.md)

## Immediate Engineering Target

The browser-preview prototype already validates the main interaction and canvas
export direction. The next build target is the real Phase 1 runtime gate:

1. Re-check the uni-app H5 dependency/runtime path.
2. Select one local photo in real H5 or App runtime.
3. Build the same composition model used by the browser preview.
4. Render the composed image through the uni-app canvas adapter.
5. Save the generated image locally where supported.
6. Validate preview/export parity for Full Frame, In-Photo, and Bottom Band.

## Non-Negotiable Constraints

- Do not upload user photos.
- Do not promise perfect original quality before export validation.
- Keep document status separate from implementation status.
- Treat real H5/App export, save behavior, EXIF parsing, and memory behavior as
  technical risks until tested on real devices.
