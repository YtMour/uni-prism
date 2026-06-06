import type { DogSize, PetProfile, PetSpecies } from '../types/pet'

const STORAGE_KEY = 'pawage.petProfiles.v1'
const STORAGE_VERSION = 1

interface PetProfileStoragePayload {
  version: typeof STORAGE_VERSION
  profiles: PetProfile[]
}

export interface StorageAdapter {
  getStorageSync(key: string): unknown
  setStorageSync(key: string, value: unknown): void
}

export function loadPetProfiles(storage: StorageAdapter = uni): PetProfile[] {
  try {
    const saved = storage.getStorageSync(STORAGE_KEY)
    return normalizeStoragePayload(saved)
  } catch {
    return []
  }
}

export function savePetProfiles(profiles: PetProfile[], storage: StorageAdapter = uni): void {
  const payload: PetProfileStoragePayload = {
    version: STORAGE_VERSION,
    profiles
  }

  storage.setStorageSync(STORAGE_KEY, payload)
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
  patch: Partial<Pick<PetProfile, 'name' | 'birthday' | 'avatar'>> & {
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

function normalizeStoragePayload(saved: unknown): PetProfile[] {
  if (Array.isArray(saved)) {
    return saved.filter(isPetProfile)
  }

  if (isStoragePayload(saved)) {
    return saved.profiles.filter(isPetProfile)
  }

  return []
}

function isStoragePayload(value: unknown): value is PetProfileStoragePayload {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<PetProfileStoragePayload>
  return candidate.version === STORAGE_VERSION && Array.isArray(candidate.profiles)
}

function isPetProfile(value: unknown): value is PetProfile {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<PetProfile>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    (candidate.species === 'dog' || candidate.species === 'cat') &&
    typeof candidate.birthday === 'string' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  )
}
