import { OccupancyRateForecastModel } from '../../../api/models/occupancyRateForecastModel'
import { OccupancyRateForecast } from '../../domain/occupancy-rate-forecast/OccupancyRateForecast'

export async function occupancyRateForecastService(occupancyRateForecast: OccupancyRateForecast) {
  const occupancyRateForecastPrimitives = occupancyRateForecast.toPrimitives()
  const occupancyRateForecastSaved = await OccupancyRateForecastModel.findOne({
    trimester: occupancyRateForecastPrimitives.trimester,
  })

  if (occupancyRateForecastSaved) {
    await OccupancyRateForecastModel.updateOne(
      { trimester: occupancyRateForecastPrimitives.trimester },
      { $set: occupancyRateForecastPrimitives }
    )
  } else {
    const newOccupancyRateForecast = new OccupancyRateForecastModel(occupancyRateForecastPrimitives)
    await newOccupancyRateForecast.save()
  }
}
