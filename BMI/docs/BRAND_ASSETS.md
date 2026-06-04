# FitCal Brand Assets

Last updated: 2026-06-04

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
  - Use: Android splash / startup image candidate
  - Format: nine-patch PNG with 1px transparent border and black stretch/content markers
- `fitcal-splash-720x1242.9.png`
  - Size: 720 x 1242
  - Use: Android splash / startup image candidate
  - Format: nine-patch PNG with 1px transparent border and black stretch/content markers
- `fitcal-splash-1080x1882.9.png`
  - Size: 1080 x 1882
  - Use: Android splash / startup image candidate
  - Format: nine-patch PNG with 1px transparent border and black stretch/content markers
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

## Style Notes

The assets follow the current FitCal visual direction:

- warm off-white / mint background
- teal primary accents
- coral calorie accent
- soft rounded app utility style
- no text
- no medical cross
- no real-person imagery
- no ad or store badges

## Manual Setup Notes

These files are generated for manual setup in HBuilderX / uni-app configuration.

The `.9.png` splash files include a real 1px nine-patch border marker while preserving the requested total image dimensions. Stretch markers are placed on background-only bands so the center icon is not stretched.

If HBuilderX expects non-nine-patch startup images for a specific field, use the same visual source to export normal PNG variants without the `.9.png` border.
