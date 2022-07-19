import { Islands } from '../../../domain/tourists-number/types/Islands'

export const touristIslandToDomain = (touristIsland: string) => {
  switch (touristIsland) {
    case 'Tenerife':
      return Islands.TENERIFE
    case 'Gran Canaria':
      return Islands.GRAN_CANARIA
    case 'Fuerteventura':
      return Islands.FUERTEVENTURA
    case 'Lanzarote':
      return Islands.LANZAROTE
    case 'La Palma':
      return Islands.LA_PALMA
    default:
      throw new Error(`Impossible to convert the tourist island ${touristIsland} to domain`)
  }
}
