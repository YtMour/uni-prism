# Compliance Notes

## Product Boundary

FitCal must be presented as a wellness calculator and tracking utility. It should not claim to diagnose, treat, cure, or prevent disease.

Use language such as:

- Estimate
- General guidance
- Wellness reference
- Weight management support

Avoid language such as:

- Diagnose
- Treatment
- Cure
- Medical prescription
- Guaranteed weight loss

## Required Disclaimer

Suggested English disclaimer:

```text
FitCal provides general wellness estimates for informational purposes only. It is not medical advice and should not replace consultation with a doctor, dietitian, or qualified health professional.
```

Suggested short in-app disclaimer:

```text
Results are estimates for general wellness reference only.
```

## Data and Privacy

MVP data strategy:

- Store records locally on the user's device.
- Do not require login.
- Do not upload height, weight, BMI, calorie targets, or diet goals.
- Provide a clear local data deletion option.

Privacy policy must match the actual implementation.

Current Android permission baseline:

- The MVP should not request camera, contacts/accounts, phone state, log access, WiFi management, system settings, or storage-mount permissions.
- The Android manifest should keep `permissions` empty while the app remains local-first and ad-placeholder-only.
- Revisit this baseline only when a real platform feature or SDK requires a specific permission.

If analytics or ads are integrated later, disclose:

- Third-party SDK usage
- Device identifiers if applicable
- Approximate data categories used by ad SDKs
- Whether data is linked to user identity

## Advertising Compliance

Rules:

- Current MVP uses ad placeholders only; no real ad SDK is integrated.
- Do not target ads based on sensitive health conditions.
- Do not imply medical endorsement.
- Do not hide required content behind ads.
- Do not make users watch ads to access basic BMI or calorie results.

Rewarded ads may unlock optional enhanced guidance, but the free app must remain useful.

## Store Listing Guidelines

Recommended title:

```text
FitCal: BMI & Calorie Tracker
```

Recommended short description:

```text
Calculate BMI, estimate daily calories, and track weight goals with simple diet guidance.
```

Store copy should avoid:

- Medical guarantees
- Before/after transformation claims
- Disease treatment claims
- Claims that the app replaces professional advice

Detailed store-prep draft:

- `docs/STORE_LAUNCH_PREP.md`

## Age and Region Notes

FitCal should be safe for general audiences, but weight and diet content can be sensitive. Avoid aggressive body-shaming language.

Use neutral category labels and supportive explanations.

## Future Risk Areas

Extra review may be needed if future versions add:

- AI-generated diet plans
- Health condition-specific recommendations
- Cloud sync of body metrics
- Subscription purchases
- Third-party nutrition database integration
- User-generated content
