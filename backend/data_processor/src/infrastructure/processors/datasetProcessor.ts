import { Dataset } from '../../domain/containers/Dataset'
import { DomainDataset } from './types/DomainDataset'

export abstract class DatasetProcessor {
  lastRecordedCodes: string[]

  lastDateStored: string

  constructor() {
    this.lastRecordedCodes = []
    this.lastDateStored = ''
  }

  async process(datasets: Dataset[]): Promise<DomainDataset[]> {
    // The current codes of the datasets are obtained
    const actualCodes = datasets.map((dataset) => dataset.getCodesForCategory('Periodos')[0])

    // Checks if datasets have been updated
    const updatedDatasets = this.checkUpdateDatasets(actualCodes)

    let processedDatasets: DomainDataset[] = []

    // If datasets have been updated
    if (updatedDatasets) {
      // The lowest common date of the datasets is obtained
      const commonMinimumDate = this.getCommonMinimumDate(datasets)

      // If the lowest common date is different from the last saved date, the data is processed
      if (this.lastDateStored != commonMinimumDate) {
        processedDatasets = this.processDatasets(datasets)

        // The last saved date is updated
        this.lastDateStored = commonMinimumDate
      }
    }

    return processedDatasets
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

  abstract getCommonMinimumDate(datasets: Dataset[]): string

  abstract processDatasets(datasets: Dataset[]): DomainDataset[]
}
