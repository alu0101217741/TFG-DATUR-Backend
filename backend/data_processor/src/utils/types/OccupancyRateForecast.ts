export type OccupancyRateForecast = {
  trimester: string
  occupancyRateTrend: {
    increase: number
    decrease: number
    stability: number
  }
  expectedOccupancyByMonth: {
    month: string
    occupancyRate: number
  }[]
}
