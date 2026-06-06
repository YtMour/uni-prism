import type { DogSize, LifeStage, LifeStageAdvice, PetAgeResult, PetProfile, PetSpecies } from '../types/pet'

const DAY_MS = 24 * 60 * 60 * 1000

const DOG_SIZE_MULTIPLIER: Record<DogSize, number> = {
  small: 0.92,
  medium: 1,
  large: 1.12,
  giant: 1.24
}

const STAGE_ADVICE: Record<LifeStage, LifeStageAdvice> = {
  puppy_kitten: {
    stage: 'puppy_kitten',
    label: 'Puppy / Kitten',
    summary: 'A fast-growth season built around sleep, gentle play, and routine.',
    nutrition: 'Use age-appropriate food and keep feeding times predictable.',
    activity: 'Short play sessions work better than long exercise blocks.',
    wellness: 'Track growth, vaccine timing, and early behavior changes.'
  },
  junior: {
    stage: 'junior',
    label: 'Junior',
    summary: 'Energy is high while habits and confidence are still forming.',
    nutrition: 'Adjust portions as growth slows and body condition changes.',
    activity: 'Mix active play with training and calm recovery time.',
    wellness: 'Keep dental care and weight checks part of the routine.'
  },
  adult: {
    stage: 'adult',
    label: 'Adult',
    summary: 'A steady stage where daily rhythm matters most.',
    nutrition: 'Maintain balanced meals and watch gradual weight changes.',
    activity: 'Build a repeatable activity pattern that fits breed and body size.',
    wellness: 'Annual wellness visits and dental checks are useful anchors.'
  },
  senior: {
    stage: 'senior',
    label: 'Senior',
    summary: 'A slower season where small changes deserve more attention.',
    nutrition: 'Consider senior-friendly nutrition with your veterinarian.',
    activity: 'Keep movement gentle, consistent, and joint-friendly.',
    wellness: 'Ask about more frequent checkups and baseline blood work.'
  },
  geriatric: {
    stage: 'geriatric',
    label: 'Geriatric',
    summary: 'Comfort, observation, and familiar routines become the priority.',
    nutrition: 'Prioritize appetite, hydration, and easy-to-digest meals.',
    activity: 'Use short low-impact movement and more rest breaks.',
    wellness: 'Monitor mobility, appetite, sleep, and behavior closely.'
  }
}

const STAGE_THRESHOLDS: Record<PetSpecies, Array<{ months: number; stage: LifeStage }>> = {
  dog: [
    { months: 0, stage: 'puppy_kitten' },
    { months: 7, stage: 'junior' },
    { months: 18, stage: 'adult' },
    { months: 84, stage: 'senior' },
    { months: 120, stage: 'geriatric' }
  ],
  cat: [
    { months: 0, stage: 'puppy_kitten' },
    { months: 7, stage: 'junior' },
    { months: 24, stage: 'adult' },
    { months: 132, stage: 'senior' },
    { months: 180, stage: 'geriatric' }
  ]
}

export function calculatePetAge(profile: Pick<PetProfile, 'species' | 'birthday' | 'dogSize'>, now = new Date()): PetAgeResult {
  const birthday = new Date(`${profile.birthday}T00:00:00`)
  const totalDays = Math.max(0, Math.floor((startOfDay(now).getTime() - birthday.getTime()) / DAY_MS))
  const totalMonths = Math.floor(totalDays / 30.4375)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const days = Math.max(0, Math.round(totalDays - Math.floor(totalMonths * 30.4375)))
  const stage = resolveStage(profile.species, totalMonths)
  const nextStage = resolveNextStage(profile.species, totalMonths, birthday, now)

  return {
    actualAge: {
      years,
      months,
      days,
      totalDays
    },
    humanAge: estimateHumanAge(profile.species, totalMonths, profile.dogSize),
    stage: STAGE_ADVICE[stage],
    nextStageLabel: nextStage?.label ?? 'Fully grown story',
    daysToNextStage: nextStage?.days ?? null
  }
}

function estimateHumanAge(species: PetSpecies, totalMonths: number, dogSize?: DogSize): number {
  const years = totalMonths / 12

  if (species === 'cat') {
    if (years <= 1) return Math.round(years * 15)
    if (years <= 2) return Math.round(15 + (years - 1) * 9)
    return Math.round(24 + (years - 2) * 4)
  }

  const base = years <= 2 ? years * 12 : 24 + (years - 2) * 5
  const multiplier = DOG_SIZE_MULTIPLIER[dogSize ?? 'medium']

  return Math.max(1, Math.round(base * multiplier))
}

function resolveStage(species: PetSpecies, totalMonths: number): LifeStage {
  return STAGE_THRESHOLDS[species].reduce<LifeStage>((current, item) => {
    return totalMonths >= item.months ? item.stage : current
  }, 'puppy_kitten')
}

function resolveNextStage(species: PetSpecies, totalMonths: number, birthday: Date, now: Date): { label: string; days: number } | null {
  const next = STAGE_THRESHOLDS[species].find((item) => item.months > totalMonths)

  if (!next) return null

  const nextDate = addMonths(birthday, next.months)
  const days = Math.max(0, Math.ceil((nextDate.getTime() - startOfDay(now).getTime()) / DAY_MS))

  return {
    label: STAGE_ADVICE[next.stage].label,
    days
  }
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
