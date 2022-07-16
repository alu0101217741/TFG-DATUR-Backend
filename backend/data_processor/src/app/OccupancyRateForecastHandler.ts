import { OccupancyRateForecast } from '../domain/occupancy-rate-forecast/OccupancyRateForecast'
import { OpenDataInteractor } from '../infrastructure/open_data_interactor/OpenDataInteractor'
import { OccupancyRateForecastProcessor } from '../infrastructure/processors/occupancyRateForecastProcessor'
import { OccupancyRateForecastService } from '../services/database/OccupancyRateForecastService'

const EXPECTATIONS_OCCUPANCY_RATE_TREND = '8bb318e7-b4d6-4a52-b2c6-e2d145bd864f'
const EXPECTED_OCCUPANCY_RATE = '84ea8776-db42-49ba-b09c-87ee748db1cc'

export class OccupancyRateForecastHandler {
  private occupancyRateForecastProcessor = new OccupancyRateForecastProcessor()

  private openDataInteractor = new OpenDataInteractor()

  private databaseInteractor = new OccupancyRateForecastService()

  async execute() {
    const occupancyRateForecastDatasets = await this.openDataInteractor.getData([
      EXPECTATIONS_OCCUPANCY_RATE_TREND,
      EXPECTED_OCCUPANCY_RATE,
    ])

    const response = (await this.occupancyRateForecastProcessor.process(
      occupancyRateForecastDatasets
    )) as OccupancyRateForecast[]

    if (response.length === 0) {
      console.log('Occupancy rate forecast database not modified')
    } else {
      for (const occupancyRateForecast of response) {
        await this.databaseInteractor.saveData(occupancyRateForecast)
      }

      console.log('Occupancy rate forecast dataset has been modified and this data has been stored')
    }
  }
}
