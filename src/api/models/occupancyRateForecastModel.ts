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
      month: string
      occupancyRate: number
    }
  ]
}

// Create a Schema corresponding to the document interface.
const OccupancyRateForecastSchema = new Schema<OccupancyRateForecastInterface>(
  {
    trimester: {
      type: String,
      match: [/^\d{4}M(0(1|4|7)|10)$/, '{VALUE} is an invalid trimester'],
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
          month: { type: String, required: true },
          occupancyRate: { type: Number, required: true },
        },
      ],
      required: true,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
)

export const OccupancyRateForecastModel = model<OccupancyRateForecastInterface>(
  'occupancy_rate_forecasts',
  OccupancyRateForecastSchema
)
