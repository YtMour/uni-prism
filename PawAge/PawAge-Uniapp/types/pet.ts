export type PetSpecies = 'dog' | 'cat'

export type DogSize = 'small' | 'medium' | 'large' | 'giant'

export type LifeStage = 'puppy_kitten' | 'junior' | 'adult' | 'senior' | 'geriatric'

export interface PetProfile {
  id: string
  name: string
  species: PetSpecies
  birthday: string
  dogSize?: DogSize
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AgeBreakdown {
  years: number
  months: number
  days: number
  totalDays: number
}

export interface LifeStageAdvice {
  stage: LifeStage
  label: string
  summary: string
  nutrition: string
  activity: string
  wellness: string
}

export interface PetAgeResult {
  actualAge: AgeBreakdown
  humanAge: number
  stage: LifeStageAdvice
  nextStageLabel: string
  daysToNextStage: number | null
}
