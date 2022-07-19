import { Dataset } from '../../domain/containers/Dataset'
import { TouristsNumber } from '../../domain/tourists-number/TouristsNumber'
import { Islands } from '../../domain/tourists-number/types/Islands'
import { TrimesterLabel } from '../../domain/tourists-number/types/TrimesterLabel'
import { DatasetProcessor } from './datasetProcessor'
import { touristCountryToDomain } from './mappers/touristCountryToDomain'
import { touristIslandToDomain } from './mappers/touristIslandToDomain'

export class TouristsNumberProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: Dataset[]): string {
    const firstDatasetPeriodCodes = datasets[0].getCodesForCategory('Periodos')

    const secondDatasetPeriodCodes = datasets[1].getCodesForCategory('Periodos')

    const firstDatasetPeriod = firstDatasetPeriodCodes.find((code) => code.length > 4) as string

    const secondDatasetPeriod = secondDatasetPeriodCodes.find((code) => code.length > 4) as string

    const firstDatasetYear = Number(firstDatasetPeriod.slice(0, 4))
    const firstDatasetMonth = Number(firstDatasetPeriod.slice(5))

    const secondDatasetYear = Number(secondDatasetPeriod.slice(0, 4))
    const secondDatasetMonth = Number(secondDatasetPeriod.slice(5))

    if (firstDatasetYear < secondDatasetYear) return firstDatasetPeriod

    if (firstDatasetYear > secondDatasetYear) return secondDatasetPeriod

    if (firstDatasetMonth < secondDatasetMonth) return firstDatasetPeriod

    return secondDatasetPeriod
  }

  processDatasets(datasets: Dataset[]): TouristsNumber[] {
    // The first dataset is processed
    const storageDataProcessed = this.processFirstDataset(datasets[0])

    // The second dataset is processed
    this.processSecondDataset(datasets[1], storageDataProcessed)

    // Processed data is returned
    return storageDataProcessed
  }

  processFirstDataset(dataset: Dataset): TouristsNumber[] {
    const TOTAL_RESIDENCE_PLACE = 'T' // Total
    const FOREIGN_RESIDENCE_PLACE = 'T1' // Total residentes en el extranjero

    const countriesCodes = dataset.getCodesForCategory('Lugares de residencia').slice(2)
    const countriesLabel = dataset.getLabelsForCategory('Lugares de residencia').slice(2)

    const datasetPrimitives = dataset.toPrimitives()

    const storageDataProcessed: TouristsNumber[] = []

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[1] === this.lastDateStored) break

      // Get the object that is going to store the data that is being processed in this iteration
      const touristsAndCountries = storageDataProcessed.find(
        (t) => t.getYear() === Number(data.categoryCodes[1].slice(0, 4))
      )

      if (!touristsAndCountries) {
        storageDataProcessed.push(
          TouristsNumber.fromPrimitives({
            year: Number(data.categoryCodes[1].slice(0, 4)),
            totalTourists: Number(data.dataValue),
            touristsByCountryAndTrimester: [],
            touristsByIslands: [],
          })
        )
      } else if (data.categoryCodes[0] === TOTAL_RESIDENCE_PLACE) {
        // If the data corresponds to the total number of tourists per period
        touristsAndCountries.addTotalTourists(Number(data.dataValue))
      } else if (data.categoryCodes[0] !== FOREIGN_RESIDENCE_PLACE) {
        // If the data corresponds to the total number of tourists by nationality and trimester

        const indexCode = countriesCodes.indexOf(data.categoryCodes[0])
        const countryLabel = countriesLabel[indexCode]

        let trimester: TrimesterLabel = TrimesterLabel.FIRST_TRIMESTER

        // The value of the corresponding trimester is increased
        if (data.categoryCodes[1].slice(5).match(/0[1-3]$/)) {
          trimester = TrimesterLabel.FIRST_TRIMESTER
        } else if (data.categoryCodes[1].slice(5).match(/0[4-6]$/)) {
          trimester = TrimesterLabel.SECOND_TRIMESTER
        } else if (data.categoryCodes[1].slice(5).match(/0[7-9]$/)) {
          trimester = TrimesterLabel.THIRD_TRIMESTER
        } else if (data.categoryCodes[1].slice(5).match(/[10-12]$/)) {
          trimester = TrimesterLabel.FOURTH_TRIMESTER
        }

        touristsAndCountries.addTouristsByCountryAndTrimester(
          touristCountryToDomain(countryLabel),
          trimester,
          Number(data.dataValue)
        )
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(dataset: Dataset, storageDataProcessed: TouristsNumber[]) {
    const RESIDENCE_PLACE = 'T' // Total
    const ISLANDS = 'ES70' // Canarias

    const islandsCodes = dataset.getCodesForCategory('Islas').slice(1)
    const islandsLabels = dataset.getLabelsForCategory('Islas').slice(1)

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[2] === this.lastDateStored) break
      if (data.categoryCodes[2].length !== 7) continue

      const touristsAndNacionalities = storageDataProcessed.find(
        (a) => a.getYear() === Number(data.categoryCodes[2].slice(0, 4))
      )

      if (!touristsAndNacionalities) {
        throw new Error(
          'The datasets are not aligned, the second dataset contains different years than the first'
        )
      }

      if (data.categoryCodes[0] === RESIDENCE_PLACE && data.categoryCodes[1] !== ISLANDS) {
        // If the data corresponds to the total number of tourists per island

        const indexCode = islandsCodes.indexOf(data.categoryCodes[1])
        const islandLabel = islandsLabels[indexCode]

        touristsAndNacionalities.addTouristsByIsland(
          touristIslandToDomain(islandLabel),
          Number(data.dataValue)
        )
      }
    }

    for (const dataProcessed of storageDataProcessed) {
      const touristsInOtherIslands = dataProcessed.getTotalTouristsByIslands([
        Islands.TENERIFE,
        Islands.GRAN_CANARIA,
        Islands.LA_PALMA,
        Islands.FUERTEVENTURA,
        Islands.LANZAROTE,
      ])

      dataProcessed.addTouristsByIsland(
        Islands.LA_GOMERA_EL_HIERRO,
        dataProcessed.getTotalTourists() - touristsInOtherIslands
      )
    }
  }
}
