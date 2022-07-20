import { Accommodations } from '../../../domain/tourist-stay/types/Accommodations'

export const accommodationTouristStayToDomain = (accommodation: string) => {
  switch (accommodation) {
    case 'Hotel de 5 estrellas y 5 GL':
      return Accommodations.FIVE_STAR_HOTEL_AND_FIVE_GL
    case 'Hotel de 4 estrellas':
      return Accommodations.FOUR_STAR_HOTEL
    case 'Hotel de 1, 2, 3 estrellas':
      return Accommodations.ONE_TWO_THREE_STAR_HOTEL
    case 'Apartahotel o villa turística':
      return Accommodations.APARTHOTEL_OR_TOURIST_VILLAGE
    case 'Otros establecimientos colectivos (alojamiento rural, crucero, camping, etc. )':
      return Accommodations.OTHER_COLLECTIVE_ESTABLISHMENTS
    case 'Vivienda o habitación alquilada a un particular':
      return Accommodations.RENTAL
    case 'Vivienda propia o vivienda de amigos o familiares o intercambio gratuito de vivienda u otros alojamientos privados':
      return Accommodations.PRIVATE_ACCOMMODATION
    default:
      throw new Error(`Impossible to convert the accommodation ${accommodation} to domain`)
  }
}
