import * as assert from 'node:assert/strict'
import { calculatePetAge } from '../utils/ageCalculator'
import type { DogSize, PetProfile, PetSpecies } from '../types/pet'

const fixedNow = new Date('2026-06-01T12:00:00')

function profile(patch: Partial<PetProfile> = {}): PetProfile {
  return {
    id: 'pet-test',
    name: 'Test Pet',
    species: 'dog',
    dogSize: 'medium',
    birthday: '2022-06-01',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...patch
  }
}

function humanAgeFor(species: PetSpecies, birthday: string, dogSize?: DogSize): number {
  return calculatePetAge(profile({ species, birthday, dogSize }), fixedNow).humanAge
}

const adultDog = calculatePetAge(profile(), fixedNow)
assert.equal(adultDog.actualAge.years, 4)
assert.equal(adultDog.actualAge.months, 0)
assert.equal(adultDog.stage.stage, 'adult')
assert.equal(adultDog.humanAge, 34)
assert.equal(adultDog.nextStageLabel, 'Senior')
assert.equal(adultDog.daysToNextStage, 1096)

assert.equal(humanAgeFor('cat', '2024-05-15'), 24)
assert.equal(calculatePetAge(profile({ species: 'cat', birthday: '2024-05-15', dogSize: undefined }), fixedNow).stage.stage, 'adult')

assert.equal(humanAgeFor('dog', '2024-05-15', 'small'), 22)
assert.equal(humanAgeFor('dog', '2024-05-15', 'medium'), 24)
assert.equal(humanAgeFor('dog', '2024-05-15', 'large'), 27)
assert.equal(humanAgeFor('dog', '2024-05-15', 'giant'), 30)

const futureBirthday = calculatePetAge(profile({ birthday: '2030-01-01' }), fixedNow)
assert.equal(futureBirthday.actualAge.totalDays, 0)
assert.equal(futureBirthday.humanAge, 1)
assert.equal(futureBirthday.stage.stage, 'puppy_kitten')

console.log('ageCalculator samples passed')
