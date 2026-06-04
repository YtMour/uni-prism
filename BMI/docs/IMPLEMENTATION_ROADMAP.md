# Implementation Roadmap

## Phase 0: Planning

Status: in progress

Deliverables:

- Product name and positioning
- Feature scope
- Monetization strategy
- Compliance notes
- Implementation status tracking

## Phase 1: Offline MVP

Goal: build a usable calculator app with no server dependency.

Deliverables:

- uni-app project scaffold
- Home/BMI calculator page
- Calorie calculator page
- Diet guidance page
- Local history page
- Settings page
- Privacy policy and disclaimer pages
- H5 build verification

Technical direction:

- uni-app + Vue
- Local storage for records
- Shared calculation utilities
- Shared i18n-ready text structure
- Reusable result card and form components

Acceptance criteria:

- User can calculate BMI.
- User can calculate BMR/TDEE and target calories.
- User can read diet guidance based on goal.
- User can save and view recent records.
- User can clear local data.
- App runs in H5 preview.

## Phase 2: Ad Integration

Goal: add monetization without damaging the core utility flow.

Deliverables:

- Ad slot abstraction component
- Result page ad placement
- Guidance page ad placement
- Rewarded video prototype for enhanced guidance
- Ad fallback state for development and unsupported platforms

Acceptance criteria:

- Basic calculator remains usable when ads fail to load.
- Ads are not placed before the first useful result.
- Rewarded ad unlocks optional content only.

## Phase 3: Retention Features

Goal: increase repeat usage and stable ad impressions.

Deliverables:

- Weight trend chart
- Target weight setting
- Daily or weekly reminder setting
- More record filters
- Goal progress summary

Acceptance criteria:

- User can see weight/BMI trend.
- User can set a target and track progress.
- Reminder setting is optional and user-controlled.

## Phase 4: Store Launch

Goal: prepare overseas release assets and compliance materials.

Deliverables:

- App icons and splash assets
- Store title, subtitle, short description, long description
- Screenshots
- Privacy policy
- Disclaimer
- Data safety declarations
- Android build package

Acceptance criteria:

- Store materials avoid medical claims.
- Privacy policy matches actual data behavior.
- App package can be installed and smoke-tested.

## Phase 5: Expansion

Possible additions:

- Multi-language support
- Imperial unit support refinement
- Macro calculator
- Ideal weight calculator
- Water intake calculator
- Body fat estimate
- Meal template packs
- Premium ad-free purchase
- Cloud backup only if needed

Expansion rule:

New features should either improve retention, improve search acquisition, or improve monetization. Avoid adding complex nutrition workflows before the basic calculator loop has stable usage.
