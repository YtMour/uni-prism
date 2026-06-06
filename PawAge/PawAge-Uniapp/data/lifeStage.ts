import type { DogSize, PetSpecies } from '../types/pet'
import catAdult from '../static/assets/cat-adult.png'
import dogAdult from '../static/assets/dog-adult.png'
import dogSizeGiant from '../static/assets/dog-size-giant.png'
import dogSizeLarge from '../static/assets/dog-size-large.png'
import dogSizeMedium from '../static/assets/dog-size-medium.png'
import dogSizeSmall from '../static/assets/dog-size-small.png'

export const speciesOptions: Array<{ value: PetSpecies; label: string; icon: string }> = [
  {
    value: 'dog',
    label: 'Dog',
    icon: dogAdult
  },
  {
    value: 'cat',
    label: 'Cat',
    icon: catAdult
  }
]

export const dogSizeOptions: Array<{ value: DogSize; label: string; icon: string }> = [
  {
    value: 'small',
    label: 'Small',
    icon: dogSizeSmall
  },
  {
    value: 'medium',
    label: 'Medium',
    icon: dogSizeMedium
  },
  {
    value: 'large',
    label: 'Large',
    icon: dogSizeLarge
  },
  {
    value: 'giant',
    label: 'Giant',
    icon: dogSizeGiant
  }
]
