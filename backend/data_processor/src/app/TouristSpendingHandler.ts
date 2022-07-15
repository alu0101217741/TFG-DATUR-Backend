import { TouristSpending } from '../domain/tourist-spending/TouristSpending'
import { OpenDataInteractor } from '../infrastructure/open_data_interactor/OpenDataInteractor'
import { TouristSpendingProcessor } from '../infrastructure/processors/touristSpendingProcessor'
import { TouristSpendingService } from '../services/database/TouristSpendingService'

const AVERAGE_SPENDING_WITH_BREAKDOWN = '19269d77-e347-49ef-ac3c-45f27c42a355'
const TOTAL_SPENDING_WITH_BREAKDOWN = '6339aad3-1a0b-4a98-a89e-95d4608aded7'

export class TouristSpendingHandler {
  private touristSpendingProcessor = new TouristSpendingProcessor()

  private openDataInteractor = new OpenDataInteractor()

  private databaseInteractor = new TouristSpendingService()

  async execute() {
    const touristSpendigDatasets = await this.openDataInteractor.getData([
      AVERAGE_SPENDING_WITH_BREAKDOWN,
      TOTAL_SPENDING_WITH_BREAKDOWN,
    ])

    if (touristSpendigDatasets.length === 0) console.log('hola')

    const response = (await this.touristSpendingProcessor.process(
      touristSpendigDatasets
    )) as TouristSpending[]

    if (response.length === 0) {
      console.log('Tourist spending database not modified')
    } else {
      await this.databaseInteractor.saveData(response)

      console.log('Tourist spending dataset has been modified and this data has been stored')
    }
  }
}
