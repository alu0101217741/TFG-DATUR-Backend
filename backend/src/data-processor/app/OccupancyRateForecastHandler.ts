import { OccupancyRateForecast } from '../domain/occupancy-rate-forecast/OccupancyRateForecast'
import { OpenDataInteractor } from '../infrastructure/open_data_interactor/OpenDataInteractor'
import { OccupancyRateForecastProcessor } from '../infrastructure/processors/occupancyRateForecastProcessor'
import { occupancyRateForecastService } from '../services/database/OccupancyRateForecastService'

const FIRST_DATASET_ID = '8bb318e7-b4d6-4a52-b2c6-e2d145bd864f'
const SECOND_DATASET_ID = '84ea8776-db42-49ba-b09c-87ee748db1cc'

export class OccupancyRateForecastHandler {
  private occupancyRateForecastProcessor = new OccupancyRateForecastProcessor()

  private openDataInteractor = new OpenDataInteractor()

  async execute() {
    try {
      const occupancyRateForecastDatasets = await this.openDataInteractor.getData([
        FIRST_DATASET_ID,
        SECOND_DATASET_ID,
      ])

      const response = (await this.occupancyRateForecastProcessor.process(
        occupancyRateForecastDatasets
      )) as OccupancyRateForecast[]

      if (response.length === 0) {
        console.log('Occupancy rate forecast database not modified')
      } else {
        for (const occupancyRateForecast of response) {
          await occupancyRateForecastService(occupancyRateForecast)
        }

        console.log(
          'Occupancy rate forecast datasets have been modified and these data have been stored'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
}
