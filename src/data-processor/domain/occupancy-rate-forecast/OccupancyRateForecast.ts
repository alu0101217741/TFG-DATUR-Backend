import { ExpectedOccupancyByMonth } from './types/ExpectedOccupancyByMonth'
import { OccupancyRateTrend } from './types/OccupancyRateTrend'

export type OccupancyRateForecastPrimitives = ReturnType<OccupancyRateForecast['toPrimitives']>

export class OccupancyRateForecast {
  static fromPrimitives(occupancyRateForecastPrimitives: OccupancyRateForecastPrimitives) {
    return new OccupancyRateForecast(
      occupancyRateForecastPrimitives.trimester,
      occupancyRateForecastPrimitives.occupancyRateTrend,
      occupancyRateForecastPrimitives.expectedOccupancyByMonth
    )
  }

  constructor(
    private trimester: string,
    private occupancyRateTrend: OccupancyRateTrend,
    private expectedOccupancyByMonth: ExpectedOccupancyByMonth[]
  ) {}

  getTrimester() {
    return this.trimester
  }

  addIncreaseOccupancyRateTrend(increase: number) {
    this.occupancyRateTrend.increase = increase
  }

  addDecreaseOccupancyRateTrend(decrease: number) {
    this.occupancyRateTrend.decrease = decrease
  }

  addStabilityOccupancyRateTrend(stability: number) {
    this.occupancyRateTrend.stability = stability
  }

  addExpectedOccupancyByMonth(month: string, occupancyRate: number) {
    this.expectedOccupancyByMonth.push({
      month,
      occupancyRate,
    })
  }

  toPrimitives() {
    return {
      trimester: this.trimester,
      occupancyRateTrend: {
        increase: this.occupancyRateTrend.increase,
        decrease: this.occupancyRateTrend.decrease,
        stability: this.occupancyRateTrend.stability,
      },
      expectedOccupancyByMonth: this.expectedOccupancyByMonth.map((m) => ({
        month: m.month,
        occupancyRate: m.occupancyRate,
      })),
    }
  }
}
