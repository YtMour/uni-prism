# FitCal Brand Assets

Last updated: 2026-06-05

## Generated Assets

The current app icon and splash assets are stored under:

```text
FitCal-Uniapp/static/brand/
```

Files:

- `fitcal-icon-1024.png`
  - Size: 1024 x 1024
  - Use: app icon source
  - Background: transparent
- `fitcal-splash-480x762.9.png`
  - Size: 480 x 762
  - Use: Android nine-patch splash candidate only
  - Format: nine-patch PNG with 1px transparent border and split stretch/content markers
- `fitcal-splash-720x1242.9.png`
  - Size: 720 x 1242
  - Use: Android nine-patch splash candidate only
  - Format: nine-patch PNG with 1px transparent border and split stretch/content markers
- `fitcal-splash-1080x1882.9.png`
  - Size: 1080 x 1882
  - Use: Android nine-patch splash candidate only
  - Format: nine-patch PNG with 1px transparent border and split stretch/content markers
- `fitcal-splash-480x762.png`
  - Size: 480 x 762
  - Use: normal HBuilderX startup image candidate if the field does not explicitly require `.9.png`
- `fitcal-splash-720x1242.png`
  - Size: 720 x 1242
  - Use: normal HBuilderX startup image candidate if the field does not explicitly require `.9.png`
- `fitcal-splash-1080x1882.png`
  - Size: 1080 x 1882
  - Use: normal HBuilderX startup image candidate if the field does not explicitly require `.9.png`
- `fitcal-splash-480x762.preview.png`
  - Size: 478 x 760
  - Use: visual preview only, without the nine-patch border
- `fitcal-splash-720x1242.preview.png`
  - Size: 718 x 1240
  - Use: visual preview only, without the nine-patch border
- `fitcal-splash-1080x1882.preview.png`
  - Size: 1078 x 1880
  - Use: visual preview only, without the nine-patch border
- `fitcal-brand-source.png`
  - Size: source image copy for traceability
  - Use: regenerate derived assets if needed
- `fitcal-splash-source-image2.png`
  - Size: generated splash background source
  - Use: regenerate splash variants if needed

## Style Notes

The assets follow the current FitCal visual direction:

- warm off-white / mint background
- teal primary accents
- coral calorie accent
- soft rounded app utility style
- image-generated soft abstract wellness background
- no hard top/bottom color split
- upper and lower decorative elements so the splash does not feel empty
- no local-script UI card blocks, hard color blocks, dark blocks, or jagged line art
- no text
- no medical cross
- no real-person imagery
- no ad or store badges

## Manual Setup Notes

These files are generated for manual setup in HBuilderX / uni-app configuration.

The `.9.png` splash files include a real 1px nine-patch border marker while preserving the requested total image dimensions. Stretch markers are split into side/top background-only bands so the center icon and decorative bars are not stretched.

Current `FitCal-Uniapp/manifest.json` uses the official recommended `.9.png` startup images:

- `static/brand/fitcal-splash-480x762.9.png`
- `static/brand/fitcal-splash-720x1242.9.png`
- `static/brand/fitcal-splash-1080x1882.9.png`

The `.9.png` files were compiled successfully with Android SDK `aapt2`, and their stretch markers avoid the center icon region.

Android custom base feedback:

- Rebuilt custom base confirmed the startup image no longer stretches or compresses the center icon.

The normal PNG files remain available as visual references or fallback assets, but the current manifest is configured for `.9.png`.
