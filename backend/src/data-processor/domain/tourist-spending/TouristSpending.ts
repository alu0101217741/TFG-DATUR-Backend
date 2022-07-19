import { ResidencePlace } from './ResidencePlace'
import { SpendingConcept } from './SpendingConcept'

export type TouristSpendingPrimitives = ReturnType<TouristSpending['toPrimitives']>

export class TouristSpending {
  static fromPrimitives(touristSpendingPrimitives: TouristSpendingPrimitives) {
    const spendingByConcept = touristSpendingPrimitives.spendingByConcept
      ? touristSpendingPrimitives.spendingByConcept.map((c) => SpendingConcept.fromPrimitives(c))
      : undefined

    const spendingByResidencePlace = touristSpendingPrimitives.spendingByResidencePlace
      ? touristSpendingPrimitives.spendingByResidencePlace.map((r) =>
          ResidencePlace.fromPrimitives(r)
        )
      : undefined

    return new TouristSpending(
      touristSpendingPrimitives.trimester,
      touristSpendingPrimitives.totalSpending,
      touristSpendingPrimitives.averageSpending,
      touristSpendingPrimitives.averageSpendingByDay,
      spendingByConcept,
      spendingByResidencePlace
    )
  }

  constructor(
    private trimester: string,
    private totalSpending: number,
    private averageSpending: number,
    private averageSpendingByDay: number,
    private spendingByConcept?: SpendingConcept[],
    private spendingByResidencePlace?: ResidencePlace[]
  ) {}

  getTrimester(): string {
    return this.trimester
  }

  getResidencePlacesByLabel(nationalityLabel: string) {
    return this.spendingByResidencePlace?.find((r) => r.getCountry() === nationalityLabel)
  }

  getSpendingByConceptwithLabel(conceptLabel: string) {
    return this.spendingByConcept?.find((s) => s.getConcept() === conceptLabel)
  }

  setAverageSpendingByDay(averageSpendingByDay: number) {
    this.averageSpendingByDay = averageSpendingByDay
  }

  setTotalSpending(totalSpending: number) {
    this.totalSpending = totalSpending
  }

  addSpendingByConcept(spendingByConcept: SpendingConcept) {
    if (!this.spendingByConcept) {
      this.spendingByConcept = [spendingByConcept]
    } else {
      this.spendingByConcept.push(spendingByConcept)
    }
  }

  addSpendingByResidencePlace(spendingByResidencePlace: ResidencePlace) {
    if (!this.spendingByResidencePlace) {
      this.spendingByResidencePlace = [spendingByResidencePlace]
    } else {
      this.spendingByResidencePlace.push(spendingByResidencePlace)
    }
  }

  toPrimitives() {
    return {
      trimester: this.trimester,
      totalSpending: this.totalSpending,
      averageSpending: this.averageSpending,
      averageSpendingByDay: this.averageSpendingByDay,
      spendingByConcept: this.spendingByConcept
        ? this.spendingByConcept.map((c) => c.toPrimitives())
        : undefined,
      spendingByResidencePlace: this.spendingByResidencePlace
        ? this.spendingByResidencePlace.map((r) => r.toPrimitives())
        : undefined,
    }
  }
}
