export type SpendingByConcept = {
  concept: string
  totalSpending: number
  averageSpending: number
}

export type TouristSpending = {
  trimester: string
  totalSpending: number
  averageSpending: number
  averageSpendingByDay: number
  spendingByConcept: SpendingByConcept[]
  spendingByResidencePlace: {
    residencePlace: string
    averageSpending: number
    averageSpendingByDay: number
    concepts: SpendingByConcept[]
  }[]
}
