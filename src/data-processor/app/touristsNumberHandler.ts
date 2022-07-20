import { TouristsNumber } from '../domain/tourists-number/TouristsNumber'
import { OpenDataInteractor } from '../infrastructure/open_data_interactor/OpenDataInteractor'
import { TouristsNumberProcessor } from '../infrastructure/processors/touristsNumberProcessor'
import { touristsNumberService } from '../services/TouristsNumberService'

const FIRST_DATASET_ID = '0bd1385f-fbfb-49ce-b8aa-d8a428454ceb'
const SECOND_DATASET_ID = '4373ada0-58e4-4f74-8c96-c36de97c8fbe'

export class TouristsNumberHandler {
  private touristsNumberProcessor = new TouristsNumberProcessor()

  private openDataInteractor = new OpenDataInteractor()

  async execute() {
    try {
      const touristsNumberDatasets = await this.openDataInteractor.getData([
        FIRST_DATASET_ID,
        SECOND_DATASET_ID,
      ])

      const response = (await this.touristsNumberProcessor.process(
        touristsNumberDatasets
      )) as TouristsNumber[]

      if (response.length === 0) {
        console.log('Tourist number database not modified')
      } else {
        for (const touristsNumber of response) {
          await touristsNumberService(touristsNumber)
        }

        console.log('Tourists number datasets have been modified and these data have been stored')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
