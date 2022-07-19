import { TouristSpending } from '../domain/tourist-spending/TouristSpending'
import { OpenDataInteractor } from '../infrastructure/open_data_interactor/OpenDataInteractor'
import { TouristSpendingProcessor } from '../infrastructure/processors/touristSpendingProcessor'
import { touristSpendingService } from '../services/database/TouristSpendingService'

const FIRST_DATASET_ID = '19269d77-e347-49ef-ac3c-45f27c42a355'
const SECOND_DATASET_ID = '6339aad3-1a0b-4a98-a89e-95d4608aded7'

export class TouristSpendingHandler {
  private touristSpendingProcessor = new TouristSpendingProcessor()

  private openDataInteractor = new OpenDataInteractor()

  async execute() {
    try {
      const touristSpendigDatasets = await this.openDataInteractor.getData([
        FIRST_DATASET_ID,
        SECOND_DATASET_ID,
      ])

      const response = (await this.touristSpendingProcessor.process(
        touristSpendigDatasets
      )) as TouristSpending[]

      if (response.length === 0) {
        console.log('Tourist spending database not modified')
      } else {
        for (const touristSpending of response) {
          await touristSpendingService(touristSpending)
        }

        console.log('Tourist spending datasets have been modified and these data have been stored')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
