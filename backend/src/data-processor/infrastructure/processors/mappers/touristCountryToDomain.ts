import { Countries } from '../../../domain/tourists-number/types/Countries'

export const touristCountryToDomain = (touristCountry: string) => {
  switch (touristCountry) {
    case ' Alemania':
      return Countries.GERMANY
    case ' Bélgica':
      return Countries.BELGIUM
    case ' Dinamarca':
      return Countries.DENMARK
    case ' Finlandia':
      return Countries.FINLAND
    case ' Francia':
      return Countries.FRANCE
    case ' Holanda':
      return Countries.NETHERLANDS
    case ' Irlanda':
      return Countries.IRELAND
    case ' Italia':
      return Countries.ITALY
    case ' Noruega':
      return Countries.NORWAY
    case ' Reino Unido':
      return Countries.UNITED_KINGDOM
    case ' Suecia':
      return Countries.SWEDEN
    case ' Suiza':
      return Countries.SWITZERLAND
    case ' Otros países':
      return Countries.OTHER_COUNTRIES
    case 'TOTAL RESIDENTES EN ESPAÑA':
      return Countries.SPAIN
    case ' Otros países':
      return Countries.OTHER_COUNTRIES
    default:
      throw new Error(`Impossible to convert the tourist country ${touristCountry} to domain`)
  }
}
