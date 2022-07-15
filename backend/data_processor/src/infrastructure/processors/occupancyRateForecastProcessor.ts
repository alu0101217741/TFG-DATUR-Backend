/*import { postDocument } from '../utils/axios/post'
import { DATABASE } from '../utils/config'
import { DatasetFormat } from '../utils/types/DatasetFormat'
import { OccupancyRateForecast } from '../utils/types/OccupancyRateForecast'
import { DatasetProcessor } from './datasetProcessor'

export class OccupancyRateForecastProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: DatasetFormat[]): string {
    const firstDatasetCodes = datasets[0].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const secondDatasetCodes = datasets[1].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const firstDatasetPeriod = firstDatasetCodes[0]
    const secondDatasetPeriod = secondDatasetCodes[0]

    const firstDatasetYear = Number(firstDatasetPeriod.substring(0, 4))
    const secondDatasetYear = Number(secondDatasetPeriod.substring(0, 4))

    const firstDatasetMonth = Number(firstDatasetPeriod.substring(5))
    const secondDatasetMonth = Number(secondDatasetPeriod.substring(5))

    if (firstDatasetYear < secondDatasetYear) {
      return firstDatasetPeriod
    } else if (firstDatasetYear > secondDatasetYear) {
      return secondDatasetPeriod
    } else {
      if (firstDatasetMonth < secondDatasetMonth) {
        return firstDatasetPeriod
      } else if (firstDatasetMonth > secondDatasetMonth) {
        return secondDatasetPeriod
      } else {
        return firstDatasetPeriod
      }
    }
  }

  processDatasets(datasets: DatasetFormat[], commonMinimumDate: string): OccupancyRateForecast[] {
    console.log(commonMinimumDate)

    const storageDataProcessed = this.processFirstDataset(datasets[0])

    this.processSecondDataset(datasets[1], storageDataProcessed)

    return storageDataProcessed
  }

  processFirstDataset(dataset: DatasetFormat): OccupancyRateForecast[] {
    const storageDataProcessed: OccupancyRateForecast[] = []

    for (const data of dataset.data) {
      if (data.dimCodes[2] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      const occupancyRateForecast = storageDataProcessed.find(
        (s) => s.trimester === data.dimCodes[2]
      )

      if (!occupancyRateForecast) {
        storageDataProcessed.push({
          trimester: data.dimCodes[2],
          occupancyRateTrend: {
            increase: 0,
            decrease: 0,
            stability: 0,
          },
          expectedOccupancyByMonth: [],
        })
      }

      if (data.dimCodes[0] === '0' && data.dimCodes[1] === 'ES70') {
        if (data.dimCodes[3] === '1') {
          storageDataProcessed[storageDataProcessed.length - 1].occupancyRateTrend.increase =
            Number(data.Valor)
        } else if (data.dimCodes[3] === '2') {
          storageDataProcessed[storageDataProcessed.length - 1].occupancyRateTrend.decrease =
            Number(data.Valor)
        } else if (data.dimCodes[3] === '3') {
          storageDataProcessed[storageDataProcessed.length - 1].occupancyRateTrend.stability =
            Number(data.Valor)
        }
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(dataset: DatasetFormat, storageDataProcessed: OccupancyRateForecast[]) {
    for (const data of dataset.data) {
      if (data.dimCodes[2] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      const occupancyRateForecast = storageDataProcessed.find(
        (s) => s.trimester === data.dimCodes[2]
      )

      if (!occupancyRateForecast) {
        throw new Error(
          `Trimester not found during second dataset processing to ${data.dimCodes[2]} code`
        )
      }

      if (data.dimCodes[0] === '0' && data.dimCodes[1] === 'ES70') {
        occupancyRateForecast.expectedOccupancyByMonth.push({
          month: data.dimCodes[3],
          occupancyRate: Number(data.Valor),
        })
      }
    }
  }

  async storedDataProcessed(dataProcessed: OccupancyRateForecast[]) {
    for (const data of dataProcessed) {
      await postDocument(DATABASE + '/occupancyRateForecast', data)
    }
  }
}
*/
