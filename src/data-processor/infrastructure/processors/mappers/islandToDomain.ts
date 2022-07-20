import { Islands } from '../../../domain/tourist-stay/types/Islands'

export const islandToDomain = (island: string) => {
  switch (island) {
    case 'Tenerife':
      return Islands.TENERIFE
    case 'Gran Canaria':
      return Islands.GRAN_CANARIA
    case 'Fuerteventura':
      return Islands.FUERTEVENTURA
    case 'Lanzarote':
      return Islands.LANZAROTE
    case 'La Gomera':
      return Islands.LA_GOMERA
    case 'La Palma':
      return Islands.LA_PALMA
    case 'El Hierro':
      return Islands.EL_HIERRO
    default:
      throw new Error(`Impossible to convert the island ${island} to domain`)
  }
}
