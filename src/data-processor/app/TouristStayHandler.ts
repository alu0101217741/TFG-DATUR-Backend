import { TouristStay } from '../domain/tourist-stay/TouristStay'
import { OpenDataInteractor } from '../infrastructure/open_data_interactor/OpenDataInteractor'
import { TouristStayProcessor } from '../infrastructure/processors/touristStayProcessor'
import { touristStayService } from '../services/database/TouristStayService'

const FIRST_DATASET_ID = 'a929256b-ac0f-4546-8079-81cba390ce1c'
const SECOND_DATASET_ID = 'af15df23-3d19-4ebd-aefb-23ccf0501140'

export class TouristStayHandler {
  private touristStayProcessor = new TouristStayProcessor()

  private openDataInteractor = new OpenDataInteractor()

  async execute() {
    try {
      const touristSpendigDatasets = await this.openDataInteractor.getData([
        FIRST_DATASET_ID,
        SECOND_DATASET_ID,
      ])

      const response = (await this.touristStayProcessor.process(
        touristSpendigDatasets
      )) as TouristStay[]

      if (response.length === 0) {
        console.log('Tourist stay database not modified')
      } else {
        for (const touristStay of response) {
          await touristStayService(touristStay)
        }

        console.log('Tourist stay datasets have been modified and these data have been stored')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
