import { ResidencePlaces } from './types/ResidencePlaces'

export type ResidencePlaceStayPrimitives = ReturnType<ResidencePlaceStay['toPrimitives']>

export class ResidencePlaceStay {
  static fromPrimitives(residencePlaceStayPrimitives: ResidencePlaceStayPrimitives) {
    return new ResidencePlaceStay(
      residencePlaceStayPrimitives.residencePlace,
      residencePlaceStayPrimitives.averageStay
    )
  }

  constructor(private residencePlace: ResidencePlaces, private averageStay: number) {}

  getResidencePlace() {
    return this.residencePlace
  }

  getAverageStay() {
    return this.averageStay
  }

  addAverageStay(averageStay: number) {
    this.averageStay += averageStay
  }

  setAverageStay(averageStay: number) {
    this.averageStay = averageStay
  }

  toPrimitives() {
    return {
      residencePlace: this.residencePlace,
      averageStay: this.averageStay,
    }
  }
}
