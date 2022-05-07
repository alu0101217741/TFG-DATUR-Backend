import { postDocument } from '../utils/axios/post'
import { putDocument } from '../utils/axios/put'
import { DatasetFormat } from '../utils/types/DatasetFormat'
import {
  TouristsAndNacionalities,
  TouristsByCanaryIslands,
} from '../utils/types/TouristsAndNacionalities'
import { DatasetProcessor } from './datasetProcessor'

export class TouristsAndNacionalitiesProcessor extends DatasetProcessor {
  getCommonMinimumDate(actualCodes: string[]): string {
    // TODO: Problema con 2021
    const firstDatasetYear = Number(actualCodes[0].slice(0, 4))
    const firstDatasetMonth = Number(actualCodes[0].slice(5))

    const secondDatasetYear = Number(actualCodes[1].slice(0, 4))
    const secondDatasetMonth = Number(actualCodes[1].slice(5))

    if (
      (firstDatasetYear === secondDatasetYear && firstDatasetMonth > secondDatasetMonth) ||
      firstDatasetYear > secondDatasetYear
    ) {
      return actualCodes[1]
    }

    return actualCodes[0]
  }

  processDatasets(
    datasets: DatasetFormat[],
    commonMinimumDate: string
  ): TouristsAndNacionalities[] {
    // Storage to store the data to be processed
    let storageDataProcessed: TouristsAndNacionalities[]

    const actualYear = Number(commonMinimumDate.slice(0, 4))

    if (this.lastDataStored && this.lastDataStored.year === actualYear) {
      // If the new data belongs to the last saved year, the data for this year will be updated
      storageDataProcessed = [this.lastDataStored]
    } else {
      // If the new data does not belong to the last saved year, new ones will be created
      storageDataProcessed = this.createNewStorage(datasets)
    }

    // The first dataset is processed
    this.processFirstDataset(datasets[0], storageDataProcessed)

    // The second dataset is processed
    this.processSecondDataset(datasets[1], storageDataProcessed)

    // Processed data is returned
    return storageDataProcessed
  }

  createNewStorage(datasets: DatasetFormat[]): TouristsAndNacionalities[] {
    // Are obtained every year until the last one that has been processed
    const periods = datasets[0].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes

    if (!periods) {
      throw new Error(`Codes of the first dataset not found for the periods variable`)
    }

    const years: number[] = []

    for (const period of periods) {
      if (period === this.lastDateStored) break
      const year = Number(period.slice(0, 4))
      if (!years.includes(year)) {
        years.push(year)
      }
    }

    //  Are obtained every nacionalities
    const nacionalities = datasets[0].categories
      .find((category) => category.variable === 'Lugares de residencia')
      ?.labels.slice(2)

    if (!nacionalities) {
      throw new Error(
        `Nacionalities of the first dataset not found for the places of residence variable`
      )
    }

    //  Are obtained every islands
    const islands = datasets[1].categories
      .find((category) => category.variable === 'Islas')
      ?.labels.slice(1)

    if (!islands) {
      throw new Error(`Islands of the second dataset not found for the islands variable`)
    }

    islands?.push('La Gomera y El Hierro')

    // The structure is created to store the processed data
    return years.map((year) => {
      return {
        year: year,
        totalTourists: 0,
        touristsByCountryAndTrimester: nacionalities.map((country) => {
          return {
            country: country,
            firtTrimester: 0,
            secondTrimester: 0,
            thirdTrimester: 0,
            fourthTrimester: 0,
          }
        }),
        touristsByCanaryIslands: islands.map((island) => {
          return {
            island: island,
            tourists: 0,
          }
        }),
      }
    })
  }

  processFirstDataset(dataset: DatasetFormat, storageDataProcessed: TouristsAndNacionalities[]) {
    const countriesCodes = dataset.categories
      .find((category) => category.variable === 'Lugares de residencia')
      ?.codes.slice(2) as string[]

    for (const data of dataset.data) {
      if (data.dimCodes[1] === this.lastDateStored) break

      // Get the object that is going to store the data that is being processed in this iteration
      const touristsAndCountries = storageDataProcessed.find(
        (t) => t.year === Number(data.dimCodes[1].slice(0, 4))
      ) as TouristsAndNacionalities

      if (data.dimCodes[0] === 'T') {
        // If the data corresponds to the total number of tourists per period
        touristsAndCountries.totalTourists += Number(data.Valor)
      } else if (data.dimCodes[0] !== 'T1') {
        // If the data corresponds to the total number of tourists by nationality and trimester

        const index = countriesCodes.findIndex((n) => n === data.dimCodes[0])

        if (isNaN(Number(data.Valor))) continue

        // The value of the corresponding trimester is increased
        if (data.dimCodes[1].slice(5).match(/0[1-3]$/)) {
          touristsAndCountries.touristsByCountryAndTrimester[index].firtTrimester += Number(
            data.Valor
          )
        } else if (data.dimCodes[1].slice(5).match(/0[4-6]$/)) {
          touristsAndCountries.touristsByCountryAndTrimester[index].secondTrimester += Number(
            data.Valor
          )
        } else if (data.dimCodes[1].slice(5).match(/0[7-9]$/)) {
          touristsAndCountries.touristsByCountryAndTrimester[index].thirdTrimester += Number(
            data.Valor
          )
        } else if (data.dimCodes[1].slice(5).match(/[10-12]$/)) {
          touristsAndCountries.touristsByCountryAndTrimester[index].fourthTrimester += Number(
            data.Valor
          )
        }
      }
    }
  }

  processSecondDataset(dataset: DatasetFormat, storageDataProcessed: TouristsAndNacionalities[]) {
    const islandsCodes = dataset.categories
      .find((category) => category.variable === 'Islas')
      ?.codes.slice(1) as string[]

    for (const data of dataset.data) {
      if (data.dimCodes[2] === this.lastDateStored) break
      if (data.dimCodes[2].length !== 7) continue

      const touristsAndNacionalities = storageDataProcessed.find(
        (a) => a.year === Number(data.dimCodes[2].slice(0, 4))
      ) as TouristsAndNacionalities

      if (data.dimCodes[0] === 'T' && data.dimCodes[1] !== 'ES70') {
        // If the data corresponds to the total number of tourists per island

        const index = islandsCodes.findIndex((i) => i === data.dimCodes[1])

        touristsAndNacionalities.touristsByCanaryIslands[index].tourists += Number(data.Valor)
      }
    }

    for (const dataProcessed of storageDataProcessed) {
      let touristsInOtherIslands = 0

      for (const island of dataProcessed.touristsByCanaryIslands) {
        touristsInOtherIslands += island.tourists
      }

      const particularIslands = dataProcessed.touristsByCanaryIslands.find(
        (t) => t.island === 'La Gomera y El Hierro'
      ) as TouristsByCanaryIslands

      particularIslands.tourists = dataProcessed.totalTourists - touristsInOtherIslands
    }
  }

  async storedDataProcessed(dataProcessed: TouristsAndNacionalities[]) {
    if (this.lastDataStored && this.lastDataStored.year === dataProcessed[0].year) {
      await putDocument(
        `http://localhost:3000/numberTouristsAndNacionalites?year=${dataProcessed[0].year}`,
        dataProcessed[0]
      )
    } else {
      for (const data of dataProcessed) {
        await postDocument('http://localhost:3000/numberTouristsAndNacionalites', data)
      }
    }
  }
}
