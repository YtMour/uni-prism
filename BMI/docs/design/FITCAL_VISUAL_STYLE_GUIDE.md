# FitCal Visual Style Guide

## Design Goal

FitCal should feel like a practical overseas wellness tool: fast, clear, calm, and credible. It should not look like a medical app, a diet challenge app, or a decorative landing page.

The interface must support frequent repeated use. Screens should be compact enough for daily tracking, but not dense enough to feel like a spreadsheet.

## Product Tone

- Friendly but not playful
- Health-focused but not clinical
- Data-driven but not cold
- International, English-first, app-store-ready

## Core Visual Direction

Style name: Clean Wellness Utility

Keywords:

- Clean
- Light
- Structured
- Fresh
- Trustworthy
- Practical

Avoid:

- Medical blue hospital style
- Purple SaaS gradients
- Beige meal planner look
- Heavy dark dashboard style
- Body transformation imagery
- Oversized marketing hero layouts

## Color System

The app should use a light interface with restrained accent colors.

Primary:

- Teal: `#0F9F8F`
- Deep text: `#172326`
- White: `#FFFFFF`

Secondary:

- Pale mint: `#E6F7F4`
- Cool surface: `#F4F8F8`
- Border: `#D8E6E5`
- Muted text: `#65787B`

Functional accents:

- Coral CTA: `#F06F5D`
- Green success: `#58A85F`
- Amber nutrition: `#F4B84F`

Usage rules:

- White and cool surface should dominate.
- Teal is the main brand/action support color.
- Coral is only for primary CTA buttons and important positive actions.
- Green is for normal/healthy/success states.
- Amber is for nutrition/calorie highlights.
- Do not use large gradients as primary page backgrounds.

## Typography

Use a system sans-serif stack suitable for English UI:

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
```

Type scale:

- App header: 22-24px, 800 weight
- Screen title: 28-32px, 800 weight
- Section title: 15-17px, 700 weight
- Body text: 14-16px, 400-500 weight
- Labels: 12-13px, 700 weight
- Result number: 40-52px, 800-850 weight

Rules:

- Letter spacing is 0.
- Do not scale text by viewport width.
- Result numbers may be large, but form labels and tab labels must stay compact.

## Layout System

Target mobile viewport:

- Design reference: 390 x 844
- Safe horizontal padding: 20px
- Vertical screen padding: 20-24px
- Card gap: 12-16px
- Section gap: 18-24px

Card radius:

- Standard cards: 8px
- Inputs: 8px
- Buttons: 8px
- Bottom navigation pill container may use 16-18px because it is a shell element.

Rules:

- Do not nest cards inside decorative cards.
- Do not make page sections float as huge cards.
- Use simple white cards only for functional grouped content.
- Keep each screen focused on one workflow.

## Component System

### Top Bar

Contains:

- App name: FitCal
- Small context pill: Metric, Goal, Plan, Local, or Settings

### Inputs

Use compact input blocks:

- Label above value
- Unit on the right
- Clear border
- No oversized fields

### Segmented Controls

Use for:

- Metric / Imperial
- Maintain / Lose / Gain
- Weight Trend / BMI Trend

Active state:

- White active surface
- Teal text
- Subtle shadow or border

### Primary Button

Style:

- Coral fill
- White text
- 8px radius
- 52px height

Usage:

- Calculate BMI
- Calculate Calories
- Add Record
- Unlock optional content

### Result Panel

Style:

- Pale mint surface
- Teal-tinted border
- Large number
- Compact status badge

### Bottom Navigation

Tabs:

- BMI
- Calories
- Guidance
- Records
- Settings

Rules:

- Same tab bar on every main screen.
- Active tab uses white rounded item and teal label.
- Use simple symbolic icons or lucide-style icons.
- Do not use question marks as placeholder icons in final designs.

### Ad Slots

MVP visual placement:

- Result page: below useful result summary
- Guidance page: between summary and extended guidance, or near bottom

Visual placeholder:

- Dashed border
- Muted text
- Clearly secondary

Rules:

- Never place ads before the first result.
- Never make an ad look like a core action button.

## Page-Level Requirements

### BMI Screen

Primary goal:

- Fast BMI calculation.

Must show:

- Metric/Imperial control
- Height input
- Weight input
- Calculate BMI button
- BMI result
- Category badge
- Healthy range
- Wellness disclaimer

### Calories Screen

Primary goal:

- Estimate BMR, TDEE, and daily calorie target.

Must show:

- Sex
- Age
- Activity level
- Goal
- Calculate Calories button
- BMR
- TDEE
- Daily target

### Guidance Screen

Primary goal:

- Convert calculator results into simple diet guidance.

Must show:

- Goal summary
- Daily target
- Macro split
- Meal focus suggestions
- Optional extended guide CTA
- Wellness-only note

### Records Screen

Primary goal:

- Encourage repeat use through local tracking.

Must show:

- Current weight
- Current BMI
- Trend chart
- Add Record button
- Recent records
- Local data only note

### Settings Screen

Primary goal:

- Trust, units, privacy, and data control.

Must show:

- Units
- Language placeholder
- Privacy Policy
- Disclaimer
- Clear local data
- App version

## Image Generation Rules

When generating UI mockups:

- Use the same visual system for every screen.
- Use one mobile screen per detailed image.
- Use one large board only for overview.
- Do not place multiple unrelated visual styles in one board.
- No surrounding device frame unless explicitly requested.
- No generated photos of bodies, doctors, clinics, or food plates.
- No watermarks.
- All visible UI text must be English.
- No lorem ipsum.
- No question-mark icons.
- Avoid decorative background blobs, orbs, and heavy gradients.

## Design Board Structure

The first overview board should include:

- A short title: FitCal UI System
- Color swatches
- 5 main mobile screens: BMI, Calories, Guidance, Records, Settings
- Shared bottom navigation visible on each screen
- Same card, input, button, and typography treatment

## Detailed Screen Generation Order

1. Overview board
2. BMI screen
3. Calories screen
4. Guidance screen
5. Records screen
6. Settings screen

Each detailed screen must visually match the overview board.
