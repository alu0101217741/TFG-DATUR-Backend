import { ResidencePlace } from './ResidencePlace'
import { SpendingConcept } from './SpendingConcept'

//TODO: revisar naming da las cosas

// TODO: mirar si los throw están bien aquí

// TODO: incluir clase para trimester

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
      touristSpendingPrimitives.averageSpending,
      touristSpendingPrimitives.totalSpending,
      touristSpendingPrimitives.averageSpendingByDay,
      spendingByConcept,
      spendingByResidencePlace
    )
  }

  constructor(
    private trimester: string,
    private averageSpending: number,
    private totalSpending: number,
    private averageSpendingByDay: number,
    private spendingByConcept?: SpendingConcept[],
    private spendingByResidencePlace?: ResidencePlace[]
  ) {}

  getTrimester(): string {
    return this.trimester
  }

  getResidencePlacesByLabel(nationalityLabel: string) {
    const residencePlace = this.spendingByResidencePlace?.find(
      (r) => r.getCountry() === nationalityLabel
    )

    if (!residencePlace) {
      throw new Error(`Residence place for nationality ${nationalityLabel} not found`)
    }

    return residencePlace
  }

  getSpendingByConceptwithLabel(conceptLabel: string) {
    const spendingByConcept = this.spendingByConcept?.find((s) => s.getConcept() === conceptLabel)

    if (!spendingByConcept) {
      throw new Error(`Spending concept for label ${conceptLabel} not found`)
    }

    return spendingByConcept
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
