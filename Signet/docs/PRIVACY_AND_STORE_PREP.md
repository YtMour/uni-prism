# Privacy and Store Prep

## Privacy Position

Signet should be local-first. The intended product promise is that photos are
processed on the user's device and are not uploaded to a server.

Store-facing copy must only claim behavior that the implementation proves.
Store preparation is deferred until the real Phase 1 H5/App export and save path
is validated.

Draft statement:

```text
Signet processes your photos locally on your device. We do not upload or store
your photos on a server.
```

## Permissions

Expected permission needs:

- Read selected photos.
- Save exported photos.

Permissions to avoid in MVP:

- Network access for photo processing.
- Location access unless explicitly required for optional EXIF display.
- Background services.
- Advertising SDK permissions.

## Store Metadata Draft

Category:

- Photo and video.

Short description:

```text
Create elegant photo watermarks and gallery frames locally on your device.
```

Primary selling points:

- Local photo processing.
- Elegant gallery frames.
- Creator copyright marks.
- Manual metadata captions.

## Compliance Risks

- If EXIF GPS fields are displayed or retained, privacy copy must explain it.
- If subscriptions are added, store purchase disclosures must match actual gates.
- If any cloud feature is added later, the zero-upload promise must be revised.
- If third-party analytics are added, privacy policy and permissions must be
  updated before release.

## Store Prep Checklist

- Privacy policy written.
- Permission list audited.
- App icon created.
- Screenshots created from real app state.
- ASO copy aligned with implemented features.
- No unverified claims about original quality preservation.
