# Product Spec

## Positioning

Signet is a mobile photo finishing tool for creators who want photographs to
look intentionally presented rather than simply stamped with a utilitarian
watermark. Its core value is local, privacy-preserving decoration: gallery
frames, creator marks, copyright labels, and manually editable metadata.

## Target Users

- Independent photographers publishing portfolio or social work.
- Full-time creators preparing image sets for posts and client delivery.
- Small e-commerce sellers protecting product photography.
- Travel, street, and portrait photographers who want tasteful camera metadata
  presentation.

## Core Jobs

- Add an elegant border and manual metadata caption to a photo.
- Add a small creator mark or copyright label.
- Reuse the same composition style after the single-photo path is proven.
- Export without uploading private image assets.
- Recover gracefully when automatic metadata is missing by keeping manual fields
  editable.

## Product Principles

- Local-first: user photos remain on device.
- Non-invasive: decoration should frame the image rather than hide it.
- Phase-gated: single-photo export/save must be proven before repeated photo
  workflows.
- Verifiable: export quality claims must be backed by device tests.
- International: copy and layout must survive English, Spanish, French, German,
  and Japanese.

## Phase 1 MVP Definition

The Phase 1 MVP is not complete yet. The current repository has a validated
browser-preview MVP prototype. Phase 1 is complete only when a real H5 or App
runtime can select one local photo and export/save one composed image using the
same composition model as the browser preview.

Included:

- Pick one local image in real H5 or App runtime.
- Preview the image inside a warm paper canvas.
- Choose one gallery border style.
- Edit visible text metadata.
- Adjust border size, text size, and watermark opacity.
- Export and save one composed image locally.

Excluded from MVP:

- Automatic EXIF extraction.
- Batch queue.
- Subscription billing.
- App store release.
- Store asset expansion.
- Signature extraction.
- Camera brand logo auto-detection.

## Success Criteria

- A user can create one framed photo from local selection to local save in H5 or
  App runtime.
- The export result visually matches the preview closely enough for first use.
- No network upload path is required.
- The app can continue development without rewriting the core product direction.
