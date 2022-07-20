import { Concepts } from '../../../domain/tourist-spending/types/Concepts'

export const touristSpendingConceptToDomain = (concept: string) => {
  switch (concept) {
    case 'ALOJAMIENTO':
      return Concepts.ACCOMMODATION
    case 'TRANSPORTE NACIONAL / INTERNACIONAL':
      return Concepts.NATIONAL_INTERNATIONAL_TRANSPORT
    case 'TRANSPORTE LOCAL':
      return Concepts.LOCAL_TRANSPORTATION
    case 'ALIMENTACIÓN':
      return Concepts.FEEDING
    case 'RECREACIÓN, CULTURA Y ACTIVIDADES DEPORTIVAS':
      return Concepts.RECREATION_CULTURE_AND_SPORTS_ACTIVITIES
    case 'COMPRAS':
      return Concepts.SHOPPING
    case 'OTROS':
      return Concepts.OTHERS
    default:
      throw new Error(`Impossible to convert the concept ${concept} to domain`)
  }
}
