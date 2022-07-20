import { ResidencePlaces } from '../../../domain/tourist-stay/types/ResidencePlaces'

export const residencePlaceToDomain = (residencePlace: string) => {
  switch (residencePlace) {
    case 'Alemania':
      return ResidencePlaces.GERMANY
    case 'España':
      return ResidencePlaces.SPAIN
    case 'Reino Unido':
      return ResidencePlaces.UNITED_KINGDOM
    case 'Otros países':
      return ResidencePlaces.OTHER_COUNTRIES
    default:
      throw new Error(`Impossible to convert the residence place ${residencePlace} to domain`)
  }
}
