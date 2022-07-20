import { ResidencePlaceStay } from './ResidencePlaceStay'
import { Accommodations } from './types/Accommodations'
import { ResidencePlaces } from './types/ResidencePlaces'

export type AccommodationStayPrimitives = ReturnType<AccommodationStay['toPrimitives']>

export class AccommodationStay {
  static fromPrimitives(accommodationStayPrimitives: AccommodationStayPrimitives) {
    const accommodationStayByResidencePlace =
      accommodationStayPrimitives.accommodationStayByResidencePlace
        ? accommodationStayPrimitives.accommodationStayByResidencePlace.map(
            (residencePlaceStayPrimitives) =>
              ResidencePlaceStay.fromPrimitives(residencePlaceStayPrimitives)
          )
        : undefined

    return new AccommodationStay(
      accommodationStayPrimitives.accommodation,
      accommodationStayPrimitives.averageStay,
      accommodationStayByResidencePlace
    )
  }

  constructor(
    private accommodation: Accommodations,
    private averageStay: number,
    private accommodationStayByResidencePlace?: ResidencePlaceStay[]
  ) {}

  getAccommodation() {
    return this.accommodation
  }

  addAverageStay(averageStay: number) {
    this.averageStay += averageStay
  }

  addAccommodationStayByResidencePlace(residencePlace: ResidencePlaces, averageStay: number) {
    const accommodationStayByResidencePlace = ResidencePlaceStay.fromPrimitives({
      residencePlace,
      averageStay,
    })

    if (!this.accommodationStayByResidencePlace) {
      this.accommodationStayByResidencePlace = [accommodationStayByResidencePlace]
    } else {
      this.accommodationStayByResidencePlace.push(accommodationStayByResidencePlace)
    }
  }

  findAccommodationStayByResidencePlace(residencePlace: ResidencePlaces) {
    return this.accommodationStayByResidencePlace?.find(
      (accommodationStay) => accommodationStay.getResidencePlace() === residencePlace
    )
  }

  toPrimitives() {
    return {
      accommodation: this.accommodation,
      averageStay: this.averageStay,
      accommodationStayByResidencePlace: this.accommodationStayByResidencePlace
        ? this.accommodationStayByResidencePlace.map((residencePlaceStay) =>
            residencePlaceStay.toPrimitives()
          )
        : undefined,
    }
  }
}
