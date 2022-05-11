import { getDatasets } from '../utils/getDatasets'
import { Data } from '../utils/types/Data'
import { DatasetFormat } from '../utils/types/DatasetFormat'
import { ProcessorResponse } from '../utils/types/processorResponse'

export abstract class DatasetProcessor {
  lastRecordedCodes: string[]

  lastDateStored: string

  lastDataStored!: Data

  packageIds: string[]

  constructor(packageIds: string[]) {
    this.lastRecordedCodes = []
    this.lastDateStored = ''
    this.packageIds = packageIds
  }

  async execute(): Promise<string> {
    // Gets the datasets
    const datasets = await getDatasets(this.packageIds)

    // The current codes of the datasets are obtained
    const actualCodes = this.getActualCodes(datasets)

    // Checks if datasets have been updated
    const updatedDatasets = this.checkUpdateDatasets(actualCodes)

    // If datasets have been updated
    if (updatedDatasets) {
      // The lowest common date of the datasets is obtained
      const commonMinimumDate = this.getCommonMinimumDate(datasets)

      // If the lowest common date is different from the last saved date, the data is processed
      if (this.lastDateStored != commonMinimumDate) {
        const dataProcessed = this.processDatasets(datasets, commonMinimumDate)

        // The processed data is stored in the database
        this.storedDataProcessed(dataProcessed)

        // The last saved date is updated
        this.lastDateStored = commonMinimumDate

        // The last stored data is updated
        this.lastDataStored = dataProcessed[0]

        return ProcessorResponse.DATABASE_MODIFIED
      }

      // If the least common date is already stored in the database
      return ProcessorResponse.COMMON_MINIMUM_DATE_ALREADY_STORED
    }

    // If no dataset has been updated
    return ProcessorResponse.NO_MODIFIED_DATASET
  }

  checkUpdateDatasets(actualCodes: string[]): boolean {
    let updated = false

    for (let i = 0; i < actualCodes.length; i++) {
      if (actualCodes[i] !== this.lastRecordedCodes[i]) {
        this.lastRecordedCodes[i] = actualCodes[i]
        updated = true
      }
    }

    return updated
  }

  getActualCodes(datasets: DatasetFormat[]): string[] {
    const actualCodes: string[] = []

    for (const dataset of datasets) {
      const actualCode = dataset.categories.find((category) => category.variable === 'Periodos')
        ?.codes[0]

      if (!actualCode) {
        throw new Error(`Code not found for periods variable`)
      }

      actualCodes.push(actualCode)
    }

    return actualCodes
  }

  abstract getCommonMinimumDate(datasets: DatasetFormat[]): string

  abstract processDatasets(datasets: DatasetFormat[], commonMinimumDate: string): Data[]

  abstract storedDataProcessed(dataProcessed: Data[]): void
}
