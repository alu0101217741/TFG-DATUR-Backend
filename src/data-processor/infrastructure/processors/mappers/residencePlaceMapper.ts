import { ResidencePlaces } from '../../../domain/tourist-stay/types/ResidencePlaces'
import { ResidencePlaceResponse } from '../types/residencePlaceResponse'

export const ResidencePlaceMapper = (residencePlace: ResidencePlaceResponse) => {
  const mapper: Record<ResidencePlaceResponse, ResidencePlaces> = {
    [ResidencePlaceResponse.GERMANY]: ResidencePlaces.GERMANY,
    [ResidencePlaceResponse.AUSTRIA]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.BELGIUM]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.CANADA]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.DENMARK]: ResidencePlaces.NORDIC_COUNTRIES,
    [ResidencePlaceResponse.UNITED_STATES]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.FINLAND]: ResidencePlaces.NORDIC_COUNTRIES,
    [ResidencePlaceResponse.FRANCE]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.BRITAIN]: ResidencePlaces.UNITED_KINGDOM,
    [ResidencePlaceResponse.NETHERLANDS]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.IRELAND]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.ITALY]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.NORWAY]: ResidencePlaces.NORDIC_COUNTRIES,
    [ResidencePlaceResponse.SWEDEN]: ResidencePlaces.NORDIC_COUNTRIES,
    [ResidencePlaceResponse.SWITZERLAND]: ResidencePlaces.OTHER_COUNTRIES,
    [ResidencePlaceResponse.SPAIN_RESIDENTS_EXCEPT_CANARY_ISLANDS]: ResidencePlaces.SPAIN,
  }

  const result = mapper[residencePlace]

  if (!result) {
    throw new Error(`No mapping found for ${residencePlace}`)
  }

  return result
}
