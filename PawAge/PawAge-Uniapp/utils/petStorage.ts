import type { DogSize, PetProfile, PetSpecies } from '../types/pet'

const STORAGE_KEY = 'pawage.petProfiles.v1'

export function loadPetProfiles(): PetProfile[] {
  try {
    const saved = uni.getStorageSync(STORAGE_KEY)
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function savePetProfiles(profiles: PetProfile[]): void {
  uni.setStorageSync(STORAGE_KEY, profiles)
}

export function createDefaultPetProfile(): PetProfile {
  const now = new Date().toISOString()

  return {
    id: `pet-${Date.now()}`,
    name: 'Max',
    species: 'dog',
    dogSize: 'medium',
    birthday: '2022-06-01',
    createdAt: now,
    updatedAt: now
  }
}

export function updatePetProfile(
  profile: PetProfile,
  patch: Partial<Pick<PetProfile, 'name' | 'birthday'>> & {
    species?: PetSpecies
    dogSize?: DogSize
  }
): PetProfile {
  return {
    ...profile,
    ...patch,
    dogSize: patch.species === 'cat' ? undefined : patch.dogSize ?? profile.dogSize ?? 'medium',
    updatedAt: new Date().toISOString()
  }
}
