import { Concepts } from './types/Concepts'

export type SpendingConceptPrimitives = ReturnType<SpendingConcept['toPrimitives']>

export class SpendingConcept {
  static fromPrimitives(spendingConceptPrimitives: SpendingConceptPrimitives) {
    return new SpendingConcept(
      spendingConceptPrimitives.concept,
      spendingConceptPrimitives.totalSpending,
      spendingConceptPrimitives.averageSpending
    )
  }

  constructor(
    private concept: Concepts,
    private totalSpending: number,
    private averageSpending: number
  ) {}

  getConcept(): string {
    return this.concept
  }

  setTotalSpending(totalSpending: number) {
    this.totalSpending = totalSpending
  }

  toPrimitives() {
    return {
      concept: this.concept,
      totalSpending: this.totalSpending,
      averageSpending: this.averageSpending,
    }
  }
}
