import { BusinessProgressExpectation } from '../domain/business-progress-expectation/BusinessProgressExpectation'
import { OpenDataInteractor } from '../infrastructure/open_data_interactor/OpenDataInteractor'
import { BusinessProgressExpectationProcessor } from '../infrastructure/processors/businessProgressExpectationProcessor'
import { businessProgressExpectationService } from '../services/database/BusinessProgressExpectationService'

const FIRST_DATASET_ID = '4fc301dd-d3cc-489a-b7cc-d1ac9021af12'
const SECOND_DATASET_ID = 'eef1bf10-02ad-41d9-84dc-34414aa7dfd2'
const THIRD_DATASET_ID = '3912a9f5-a4c3-4bbc-a6ef-88d0a31d71c0'

export class BusinessProgressExpectationHandler {
  private businessProgressExpectationProcessor = new BusinessProgressExpectationProcessor()

  private openDataInteractor = new OpenDataInteractor()

  async execute() {
    try {
      const businessProgressExpectationDatasets = await this.openDataInteractor.getData([
        FIRST_DATASET_ID,
        SECOND_DATASET_ID,
        THIRD_DATASET_ID,
      ])

      const response = (await this.businessProgressExpectationProcessor.process(
        businessProgressExpectationDatasets
      )) as BusinessProgressExpectation[]

      if (response.length === 0) {
        console.log('Business progress expectation database not modified')
      } else {
        for (const businessProgressExpectation of response) {
          await businessProgressExpectationService(businessProgressExpectation)
        }

        console.log(
          'Business progress expectation datasets have been modified and these data have been stored'
        )
      }
    } catch (error) {
      console.log(error)
    }
  }
}
