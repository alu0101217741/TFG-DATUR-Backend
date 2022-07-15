import { Countries } from '../../../domain/tourist-spending/types/Countries'
import { TouristNationalityResponse } from '../types/touristNationalityReponse'

export const touristNationalityMapper = (touristNationality: TouristNationalityResponse) => {
  const mapper: Record<TouristNationalityResponse, Countries> = {
    [TouristNationalityResponse.GERMAN]: Countries.GERMANY,
    [TouristNationalityResponse.BRITISH]: Countries.UNITED_KINGDOM,
    [TouristNationalityResponse.SPANISH]: Countries.SPAIN,
    [TouristNationalityResponse.DUTCH]: Countries.NETHERLANDS,
    [TouristNationalityResponse.NORDIC]: Countries.NORDIC_COUNTRIES,
    [TouristNationalityResponse.OTHER_NATIONALITIES]: Countries.OTHER_COUNTRIES,
  }

  const result = mapper[touristNationality]

  if (!result) {
    throw new Error(`No mapping found for ${touristNationality}`)
  }

  return result
}
