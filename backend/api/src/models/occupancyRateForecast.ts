import { model, Schema } from 'mongoose'

interface OccupancyRateForecastInterface {
  trimester: string
  occupancyRateTrend: {
    increase: number
    decrease: number
    stability: number
  }
  expectedOccupancyByMonth: [
    {
      month: number
      occupancyRate: number
    }
  ]
}

// Create a Schema corresponding to the document interface.
const OccupancyRateForecastSchema = new Schema<OccupancyRateForecastInterface>({
  trimester: {
    type: String,
    match: [/^\d{4}Q(1|2|3|4)$/, '{VALUE} is an invalid trimester'],
    unique: true,
    required: true,
  },
  occupancyRateTrend: {
    increase: { type: Number, required: true },
    decrease: { type: Number, required: true },
    stability: { type: Number, required: true },
  },
  expectedOccupancyByMonth: {
    type: [
      {
        month: { type: Number, required: true },
        occupancyRate: { type: Number, required: true },
      },
    ],
    required: true,
    default: undefined,
  },
})

export const OccupancyRateForecastModel = model<OccupancyRateForecastInterface>(
  'occupancy_rate_forecasts',
  OccupancyRateForecastSchema
)
