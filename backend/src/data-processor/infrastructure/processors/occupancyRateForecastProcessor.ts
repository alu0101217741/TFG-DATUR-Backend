import { Dataset } from '../../domain/containers/Dataset'
import { OccupancyRateForecast } from '../../domain/occupancy-rate-forecast/OccupancyRateForecast'
import { DatasetProcessor } from './datasetProcessor'

const CATEGORY_ESTABLISHMENTS = '0' // Total categorias
const ISLANDS = 'ES70' // Canarias

export class OccupancyRateForecastProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: Dataset[]): string {
    const firstDatasetPeriod = datasets[0].getCodesForCategory('Periodos')[0]

    const secondDatasetPeriod = datasets[1].getCodesForCategory('Periodos')[0]

    const firstDatasetYear = Number(firstDatasetPeriod.substring(0, 4))
    const secondDatasetYear = Number(secondDatasetPeriod.substring(0, 4))

    const firstDatasetMonth = Number(firstDatasetPeriod.substring(5))
    const secondDatasetMonth = Number(secondDatasetPeriod.substring(5))

    if (firstDatasetYear < secondDatasetYear) return firstDatasetPeriod
    if (firstDatasetYear > secondDatasetYear) return secondDatasetPeriod

    if (firstDatasetMonth < secondDatasetMonth) return firstDatasetPeriod
    if (firstDatasetMonth > secondDatasetMonth) return secondDatasetPeriod
    return firstDatasetPeriod
  }

  processDatasets(datasets: Dataset[]): OccupancyRateForecast[] {
    const storageDataProcessed = this.processFirstDataset(datasets[0])

    this.processSecondDataset(datasets[1], storageDataProcessed)

    return storageDataProcessed
  }

  processFirstDataset(dataset: Dataset): OccupancyRateForecast[] {
    const storageDataProcessed: OccupancyRateForecast[] = []

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[2] === this.lastDateStored) break

      const occupancyRateForecast = storageDataProcessed.find(
        (s) => s.getTrimester() === data.categoryCodes[2]
      )

      if (!occupancyRateForecast) {
        storageDataProcessed.push(
          OccupancyRateForecast.fromPrimitives({
            trimester: data.categoryCodes[2],
            occupancyRateTrend: {
              increase: 0,
              decrease: 0,
              stability: 0,
            },
            expectedOccupancyByMonth: [],
          })
        )
      }

      if (data.categoryCodes[0] === CATEGORY_ESTABLISHMENTS && data.categoryCodes[1] === ISLANDS) {
        switch (data.categoryCodes[3]) {
          case '1':
            storageDataProcessed[storageDataProcessed.length - 1].addIncreaseOccupancyRateTrend(
              Number(data.dataValue)
            )
            break
          case '2':
            storageDataProcessed[storageDataProcessed.length - 1].addDecreaseOccupancyRateTrend(
              Number(data.dataValue)
            )
            break
          case '3':
            storageDataProcessed[storageDataProcessed.length - 1].addStabilityOccupancyRateTrend(
              Number(data.dataValue)
            )
            break
        }
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(dataset: Dataset, storageDataProcessed: OccupancyRateForecast[]) {
    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[2] === this.lastDateStored) break

      const occupancyRateForecast = storageDataProcessed.find(
        (s) => s.getTrimester() === data.categoryCodes[2]
      )

      if (!occupancyRateForecast) {
        throw new Error(
          `Trimester not found during second dataset processing to ${data.categoryCodes[2]} code`
        )
      }

      if (data.categoryCodes[0] === CATEGORY_ESTABLISHMENTS && data.categoryCodes[1] === ISLANDS) {
        occupancyRateForecast.addExpectedOccupancyByMonth(
          data.categoryCodes[3],
          Number(data.dataValue)
        )
      }
    }
  }
}
