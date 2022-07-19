import { Countries } from '../../../domain/tourist-spending/types/Countries'

export const touristResidencePlaceToDomain = (residencePlace: string) => {
  switch (residencePlace) {
    case 'Alemania':
      return Countries.GERMANY
    case 'España':
      return Countries.SPAIN
    case 'Holanda':
      return Countries.NETHERLANDS
    case 'Países Nórdicos':
      return Countries.NORDIC_COUNTRIES
    case 'Reino Unido':
      return Countries.UNITED_KINGDOM
    case 'Otros países':
      return Countries.OTHER_COUNTRIES
    default:
      throw new Error(`Impossible to convert the residence place ${residencePlace} to domain`)
  }
}
