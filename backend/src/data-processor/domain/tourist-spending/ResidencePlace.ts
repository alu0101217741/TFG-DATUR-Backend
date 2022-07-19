import { SpendingConcept } from './SpendingConcept'
import { Countries } from './types/Countries'

export type ResidencePlacePrimitives = ReturnType<ResidencePlace['toPrimitives']>

export class ResidencePlace {
  static fromPrimitives(residencePlacePrimitives: ResidencePlacePrimitives) {
    const concepts = residencePlacePrimitives.concepts
      ? residencePlacePrimitives.concepts.map((c) => SpendingConcept.fromPrimitives(c))
      : undefined

    return new ResidencePlace(
      residencePlacePrimitives.country,
      residencePlacePrimitives.averageSpending,
      residencePlacePrimitives.averageSpendingByDay,
      concepts
    )
  }

  constructor(
    private country: Countries,
    private averageSpending: number,
    private averageSpendingByDay: number,
    private concepts?: SpendingConcept[]
  ) {}

  getCountry() {
    return this.country
  }

  getConceptWithLabel(conceptLabel: string) {
    const concept = this.concepts?.find((c) => c.getConcept() === conceptLabel)

    if (!concept) {
      throw new Error(`Concept for label ${conceptLabel} not found`)
    }

    return concept
  }

  setAverageSpendingByDay(averageSpendingByDay: number) {
    this.averageSpendingByDay = averageSpendingByDay
  }

  addSpendingConcept(concept: SpendingConcept) {
    if (!this.concepts) {
      this.concepts = [concept]
    } else {
      this.concepts.push(concept)
    }
  }

  toPrimitives() {
    return {
      country: this.country,
      averageSpending: this.averageSpending,
      averageSpendingByDay: this.averageSpendingByDay,
      concepts: this.concepts?.map((c) => c.toPrimitives()),
    }
  }
}
