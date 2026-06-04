# Feature Specification

## Feature Categories

### 1. BMI Calculator

Purpose: provide a fast body mass index result and plain-language category.

Inputs:

- Height
- Weight
- Unit system
- Optional age and sex for future personalization

Outputs:

- BMI value
- BMI category
- Healthy weight range
- Short wellness note

MVP calculation:

```text
BMI = weight_kg / (height_m * height_m)
```

Suggested categories:

- Underweight
- Normal weight
- Overweight
- Obesity

Notes:

- Category labels should be localized later.
- Display a non-medical disclaimer near result details.

### 2. Calorie Calculator

Purpose: estimate daily calorie needs using BMR and activity level.

Inputs:

- Sex
- Age
- Height
- Weight
- Activity level
- Goal: maintain, lose weight, gain weight

Outputs:

- BMR
- TDEE
- Suggested daily calorie target
- Goal explanation

Suggested formulas:

- Mifflin-St Jeor formula for BMR
- TDEE = BMR * activity factor

Activity levels:

- Sedentary
- Lightly active
- Moderately active
- Very active
- Extra active

Goal adjustment:

- Maintain: TDEE
- Lose weight: TDEE minus a moderate deficit
- Gain weight: TDEE plus a moderate surplus

### 3. Diet Guidance

Purpose: convert BMI and calorie results into easy, non-clinical food guidance.

Guidance dimensions:

- Goal-based calorie direction
- Protein, carbs, and fat balance
- Meal structure suggestions
- General habits such as water, vegetables, and processed food reduction

MVP implementation:

- Rule-based templates
- No AI dependency
- No medical diet plans

Example guidance types:

- Weight loss guidance
- Weight maintenance guidance
- Muscle gain guidance
- Underweight support guidance

### 4. Record History

Purpose: improve retention and support repeat use.

Stored locally:

- Date
- Height
- Weight
- BMI
- BMI category
- Optional calorie result snapshot

Views:

- Latest result
- Record list
- Basic trend chart in later version

### 5. Settings

Required settings:

- Unit system: metric / imperial
- Language later: English first, more languages later
- Privacy policy
- Disclaimer
- Clear local data

### 6. Advertising

Reserved placements:

- Result page native/banner ad
- Diet guidance page native/banner ad
- Rewarded video for enhanced guidance in later version
- Low-frequency interstitial after completed calculation in later version

Advertising must not block basic BMI and calorie calculation.

## Navigation Proposal

Bottom tabs:

- BMI
- Calories
- Guidance
- Records
- Settings

MVP may combine BMI and Calories into one Calculate tab if development speed is prioritized.
