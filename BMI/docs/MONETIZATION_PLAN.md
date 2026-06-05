# Monetization Plan

## Monetization Model

FitCal should use an ad-supported model first, with optional premium features later.

Current MVP decision:

- Use ad placeholders only.
- Use fake ad placeholder mode only for local layout and close-flow testing.
- View fake ad placeholder metrics in the internal admin dashboard, not in user-facing Settings.
- Do not integrate a production ad SDK yet.
- Do not add rewarded video behavior yet.
- Keep all calculator, guidance, and record flows independent from ad loading.

Primary revenue:

- Native/banner ads on result and guidance pages
- Rewarded video for optional enhanced content

Future revenue:

- Ad-free upgrade
- Premium meal template packs
- Advanced charts and insights

## Ad Placement Strategy

### Result Page Ad

Placement:

- Below the main BMI or calorie result
- Above secondary explanations or record list

Reason:

- The user has already received value.
- Result pages naturally have higher attention.

### Guidance Page Ad

Placement:

- Between summary guidance and detailed suggestions
- Or near the bottom of the page

Reason:

- Guidance content has longer reading time.
- Ads can be integrated without blocking calculation.

### Rewarded Video

Use cases:

- Unlock 7-day meal guidance
- Unlock detailed macro split
- Unlock extended weight goal suggestions

Rules:

- Never require rewarded ads for core BMI or calorie calculation.
- Clearly label optional unlocked content.
- Provide useful free content before offering rewarded ads.

### Interstitial Ads

Use later and sparingly.

Possible trigger:

- After a completed calculation and when navigating to a detail page

Frequency control:

- Not on first launch
- Not before first result
- Not repeatedly within short sessions

## Stability Strategy

Stable ad revenue depends on repeat use, not aggressive ad frequency.

Retention features that support ad stability:

- Local history
- Weight trend
- Goal tracking
- Reminder settings
- Reusable diet templates

## Platform Notes

uni-app can reserve ad components through an abstraction layer so each platform can implement supported ad formats later.

The MVP should use placeholder ad containers during development. Production ad SDK integration is explicitly deferred until H5 smoke, Android App-base smoke, and compliance wording are stable.

Current fake ad placeholder mode:

- Shows local placeholder creative only.
- Supports close-flow testing.
- Stores local impression and dismissal counters.
- Exposes internal smoke metrics through the Go backend and React admin dashboard.
- The same internal dashboard also tracks anonymous test activity and retention indicators.
- Does not load network ads.
- Does not require an ad SDK, permission, or consent flow.

## Metrics to Track Later

- Daily active users
- Calculation completion rate
- Result page views
- Guidance page views
- Ad fill rate
- Ad impressions per session
- Rewarded video click rate
- Rewarded video completion rate
- Crash-free sessions

## Monetization Risks

- Too many ads can reduce retention.
- Health-related apps must avoid sensitive data misuse.
- Store review may reject misleading health claims.
- Rewarded content must be optional and transparent.

## Recommended Launch Configuration

Version 1.0:

- Result page visual ad placeholder only
- Guidance page visual ad placeholder only
- Internal admin dashboard for placeholder metrics
- No production ad SDK
- No rewarded video
- No opening ad
- No forced interstitial

Version 1.1:

- Re-evaluate whether to add real banner/native ads after Android package smoke, compliance copy, and store review preparation are stable
- Keep rewarded video deferred unless optional content, frequency control, and compliance wording are all finalized

Version 1.2:

- Consider rewarded video or ad-free premium only after real-ad integration has a proven stable baseline
