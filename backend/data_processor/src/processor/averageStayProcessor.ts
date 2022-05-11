import { postDocument } from '../utils/axios/post'
import { DATABASE } from '../utils/config'
import {
  AverageStay,
  StayByAccommodations,
  StayByCanaryIslands,
  StayByResidencePlaces,
} from '../utils/types/AverageStay'
import { DatasetData } from '../utils/types/DatasetData'
import { DatasetFormat } from '../utils/types/DatasetFormat'
import { DatasetProcessor } from './datasetProcessor'

export class AverageStayProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: DatasetFormat[]): string {
    const firstDatasetCodes = datasets[0].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const secondDatasetCodes = datasets[1].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const firstDatasetYear = firstDatasetCodes.find((code) => code.length === 4) as string
    const secondDatasetYear = secondDatasetCodes.find((code) => code.length === 4) as string

    if (
      firstDatasetYear === secondDatasetYear ||
      Number(firstDatasetYear) > Number(secondDatasetYear)
    ) {
      return secondDatasetYear
    }

    return firstDatasetYear
  }

  processDatasets(datasets: DatasetFormat[], leastMinimunCommonState: string): AverageStay[] {
    console.log(leastMinimunCommonState) // TODO: quitar
    // Storage to store the data to be processed

    // const storageDataProcessed = this.createNewStorage(datasets)

    // The first dataset is processed
    const storageDataProcessed = this.processFirstDataset(datasets[0])

    // The second dataset is processed
    this.processSecondDataset(datasets[1], storageDataProcessed)

    this.normalizeDataProcessed(storageDataProcessed)

    // Processed data is returned
    return storageDataProcessed
  }

  processFirstDataset(dataset: DatasetFormat): AverageStay[] {
    // The codes and labels of the places of residence are obtained
    const residencePlacesCodes = dataset.categories.find(
      (category) => category.variable === 'Lugares de residencia'
    )?.codes

    const residencePlacesLabels = dataset.categories.find(
      (category) => category.variable === 'Lugares de residencia'
    )?.labels

    if (!residencePlacesCodes || !residencePlacesLabels) {
      throw new Error(
        `Residence places of the first dataset not found for the residence countries variable`
      )
    }

    // The codes and labels of the islands are obtained
    const islandsCodes = dataset.categories.find(
      (category) => category.variable === 'Islas de alojamiento'
    )?.codes

    const islandsLabels = dataset.categories.find(
      (category) => category.variable === 'Islas de alojamiento'
    )?.labels

    if (!islandsCodes || !islandsLabels) {
      throw new Error(`Islands of the first dataset not found for the residence countries variable`)
    }

    // Codes used in the dataset, it indicates the allowed residence places in the processor
    const individualResidencePlaces = ['DE', 'ES_XES70', 'UK']

    // Years that are not allowed to be processed
    const notAllowedYears = ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']

    // The dataset begins to process
    const storageDataProcessed: AverageStay[] = []

    for (const data of dataset.data) {
      if (data.dimCodes[2].length > 4 || notAllowedYears.includes(data.dimCodes[2])) continue
      if (data.dimCodes[2] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      // Get the object that is going to store the data that is being processed in this iteration
      const averageStay = storageDataProcessed.find((a) => a.year === Number(data.dimCodes[2]))

      if (!averageStay) {
        // Equal to:  data.dimCodes[0] === 'T' && data.dimCodes[1] === 'ES70'
        // Average stay in the Canary Islands of a tourist of any nationality in a given year
        storageDataProcessed.push({
          year: Number(data.dimCodes[2]),
          averageStay: Number(data.Valor),
          stayByResidencePlaces: [],
          stayByCanaryIslands: [],
          stayByAccommodations: [],
        })
      } else if (
        data.dimCodes[0] !== 'T' &&
        data.dimCodes[0] !== 'T1' &&
        data.dimCodes[1] === 'ES70'
      ) {
        // Average stay in the Canary Islands of tourists by residence place
        this.processStayByCountries(
          data,
          averageStay,
          individualResidencePlaces,
          residencePlacesCodes,
          residencePlacesLabels
        )
      } else if (data.dimCodes[0] === 'T' && data.dimCodes[1] !== 'ES70') {
        // Average stay in the Canary Islands of tourists by island

        const indexCode = islandsCodes.indexOf(data.dimCodes[1])

        averageStay.stayByCanaryIslands.push({
          island: islandsLabels[indexCode],
          averageStay: Number(data.Valor),
          residencePlaces: [],
        })
      } else if (
        data.dimCodes[0] !== 'T' &&
        data.dimCodes[0] !== 'T1' &&
        data.dimCodes[1] !== 'ES70'
      ) {
        // Average stay on an island of tourists by residence place

        this.processStayByIslandAndResidencePlace(
          data,
          averageStay,
          individualResidencePlaces,
          islandsCodes,
          islandsLabels,
          residencePlacesCodes,
          residencePlacesLabels
        )
      }
    }

    console.log(storageDataProcessed[3])

    return storageDataProcessed
  }

  processStayByCountries(
    data: DatasetData,
    averageStay: AverageStay,
    individualResidencePlaces: string[],
    residencePlacesCodes: string[],
    residencePlacesLabels: string[]
  ) {
    let groupResidencePlaces = ''

    if (individualResidencePlaces.includes(data.dimCodes[0])) {
      const indexCode = residencePlacesCodes.indexOf(data.dimCodes[0])

      averageStay.stayByResidencePlaces.push({
        residencePlace: residencePlacesLabels[indexCode],
        averageStay: Number(data.Valor),
      })
    } else if (
      // Nordic countries
      data.dimCodes[0] === 'FI' ||
      data.dimCodes[0] === 'NO' ||
      data.dimCodes[0] === 'SE' ||
      data.dimCodes[0] === 'DK'
    ) {
      groupResidencePlaces = 'Países nórdicos'
    } else if (data.dimCodes[0].slice(0, 2) !== 'ES' && data.dimCodes[0] !== 'ZZ') {
      groupResidencePlaces = 'Otros países'
    }

    if (groupResidencePlaces) {
      const otherResidencePlace = averageStay.stayByResidencePlaces.find(
        (a) => a.residencePlace === groupResidencePlaces
      )

      if (!otherResidencePlace) {
        averageStay.stayByResidencePlaces.push({
          residencePlace: groupResidencePlaces,
          averageStay: Number(data.Valor),
        })
      } else {
        otherResidencePlace.averageStay += Number(data.Valor)
      }
    }
  }

  processStayByIslandAndResidencePlace(
    data: DatasetData,
    averageStay: AverageStay,
    individualResidencePlaces: string[],
    islandsCodes: string[],
    islandsLabels: string[],
    residencePlacesCodes: string[],
    residencePlacesLabels: string[]
  ) {
    const indexCode = islandsCodes.indexOf(data.dimCodes[1])
    const stayByCanaryIslands = averageStay.stayByCanaryIslands.find(
      (a) => a.island === islandsLabels[indexCode]
    ) as StayByCanaryIslands

    let groupResidencePlaces = ''

    if (individualResidencePlaces.includes(data.dimCodes[0])) {
      const indexCode2 = residencePlacesCodes.indexOf(data.dimCodes[0])

      stayByCanaryIslands.residencePlaces.push({
        residencePlace: residencePlacesLabels[indexCode2],
        averageStay: Number(data.Valor),
      })
    } else if (
      // Nordic countries
      data.dimCodes[0] === 'FI' ||
      data.dimCodes[0] === 'NO' ||
      data.dimCodes[0] === 'SE' ||
      data.dimCodes[0] === 'DK'
    ) {
      groupResidencePlaces = 'Países nórdicos'
    } else if (data.dimCodes[0].slice(0, 2) !== 'ES' && data.dimCodes[0] !== 'ZZ') {
      groupResidencePlaces = 'Otros países'
    }

    if (groupResidencePlaces) {
      const otherResidencePlace = stayByCanaryIslands.residencePlaces.find(
        (a) => a.residencePlace === groupResidencePlaces
      )

      if (!otherResidencePlace) {
        stayByCanaryIslands.residencePlaces.push({
          residencePlace: groupResidencePlaces,
          averageStay: Number(data.Valor),
        })
      } else {
        otherResidencePlace.averageStay += Number(data.Valor)
      }
    }
  }

  processSecondDataset(dataset: DatasetFormat, storageDataProcessed: AverageStay[]) {
    const residencePlacesCodes = dataset.categories.find(
      (category) => category.variable === 'Países de residencia'
    )?.codes

    const residencePlacesLabels = dataset.categories.find(
      (category) => category.variable === 'Países de residencia'
    )?.labels

    if (!residencePlacesCodes || !residencePlacesLabels) {
      throw new Error(
        `Residence places of the second dataset not found for the residence countries variable`
      )
    }

    for (const data of dataset.data) {
      if (data.dimCodes[3].length > 4) continue
      if (data.dimCodes[3] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      // Get the object that is going to store the data that is being processed in this iteration
      const averageStay = storageDataProcessed.find(
        (a) => a.year === Number(data.dimCodes[3])
      ) as AverageStay

      if (data.dimCodes[0] !== '0' && data.dimCodes[1] === '0' && data.dimCodes[2] === 'ES70') {
        const accommodationType = this.getAccommodationTypes(data.dimCodes[0])

        const stayByAccommodations = averageStay.stayByAccommodations.find(
          (a) => a.accommodation === accommodationType
        )

        if (!stayByAccommodations) {
          averageStay.stayByAccommodations.push({
            accommodation: accommodationType,
            averageStay: Number(data.Valor),
            residencePlaces: [],
          })
        } else {
          stayByAccommodations.averageStay += Number(data.Valor)
        }
      } else if (
        data.dimCodes[0] !== '0' &&
        data.dimCodes[1] !== '0' &&
        data.dimCodes[2] === 'ES70'
      ) {
        const accommodationType = this.getAccommodationTypes(data.dimCodes[0])

        const stayByAccommodations = averageStay.stayByAccommodations.find(
          (a) => a.accommodation === accommodationType
        ) as StayByAccommodations

        const indexCode = residencePlacesCodes.indexOf(data.dimCodes[1])

        const residencePlaces = stayByAccommodations.residencePlaces.find(
          (a) => a.residencePlace === residencePlacesLabels[indexCode]
        )

        if (!residencePlaces) {
          stayByAccommodations.residencePlaces.push({
            residencePlace: residencePlacesLabels[indexCode],
            averageStay: Number(data.Valor),
          })
        } else {
          residencePlaces.averageStay += Number(data.Valor)
        }
      }
    }
  }

  normalizeDataProcessed(dataProcessed: AverageStay[]) {
    for (const data of dataProcessed) {
      const otherResidencePlace = data.stayByResidencePlaces.find(
        (a) => a.residencePlace === 'Otros países'
      ) as StayByResidencePlaces

      otherResidencePlace.averageStay =
        Math.round((otherResidencePlace.averageStay / 9 + Number.EPSILON) * 100) / 100

      const nordicCountries = data.stayByResidencePlaces.find(
        (a) => a.residencePlace === 'Países nórdicos'
      ) as StayByResidencePlaces

      nordicCountries.averageStay =
        Math.round((nordicCountries.averageStay / 4 + Number.EPSILON) * 100) / 100

      for (const stayByCanaryIslands of data.stayByCanaryIslands) {
        const otherResidencePlaceByIsland = stayByCanaryIslands.residencePlaces.find(
          (a) => a.residencePlace === 'Otros países'
        ) as StayByResidencePlaces

        otherResidencePlaceByIsland.averageStay =
          Math.round((otherResidencePlaceByIsland.averageStay / 9 + Number.EPSILON) * 100) / 100

        const nordicCountriesByIsland = stayByCanaryIslands.residencePlaces.find(
          (a) => a.residencePlace === 'Países nórdicos'
        ) as StayByResidencePlaces

        nordicCountriesByIsland.averageStay =
          Math.round((nordicCountriesByIsland.averageStay / 4 + Number.EPSILON) * 100) / 100
      }
    }
  }

  getAccommodationTypes(accommodationCode: string) {
    switch (accommodationCode) {
      case '1':
        return 'Hotel de 5 estrellas y 5 GL'
      case '2':
        return 'Hotel de 4 estrellas'
      case '3':
        return 'Hotel de 1, 2, 3 estrellas'
      case '4':
        return 'Apartahotel o villa turística'
      case '5':
        return 'Otros establecimientos colectivos'
      case '6':
        return 'Alquiler'
      case '7':
        return 'Alojamiento privado'
      default:
        throw new Error(`Accommodation type not found for the code ${accommodationCode}`)
    }
  }

  async storedDataProcessed(dataProcessed: AverageStay[]) {
    for (const data of dataProcessed) {
      await postDocument(DATABASE + '/averageStay', data)
    }
  }
}
