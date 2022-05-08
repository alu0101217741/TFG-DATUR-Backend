import { postDocument } from '../utils/axios/post'
import {
  AverageStay,
  StayByAccommodations,
  StayByCanaryIslands,
  StayByResidencePlaces,
} from '../utils/types/AverageStay'
import { DatasetFormat } from '../utils/types/DatasetFormat'
import { DatasetProcessor } from './datasetProcessor'

// TODO: meter ajustes para incluir los países nórdicos (Dinamarca, Suecia, Noruega y Finlandia), y para incluir cada tipo de hotel.

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

  /*
  createNewStorage(datasets: DatasetFormat[]): AverageStay[] {
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
      if (period.length < 4) continue
      const year = Number(period)
      years.push(year)
    }

    //  Are obtained every residence place
    const residencePlaces = datasets[1].categories
      .find((category) => category.variable === 'Países de residencia')
      ?.labels.slice(1)

    if (!residencePlaces) {
      throw new Error(
        `Residence places of the second dataset not found for the countries of residence variable`
      )
    }

    //  Are obtained every islands
    const islands = datasets[0].categories
      .find((category) => category.variable === 'Islas de alojamiento')
      ?.labels.slice(1)

    if (!islands) {
      throw new Error(
        `Islands of the first dataset not found for the islands of accommodation variable`
      )
    }

    // Are obtained every accommodations
    const accommodations = ['Hotel', 'Apartahotel o villa turística', 'Otros establecimientos']

    // The structure is created to store the processed data
    const stayByResidencePlaces = residencePlaces.map((residencePlace) => {
      return {
        residencePlace: residencePlace,
        averageStay: 0,
      }
    })

    const stayByCanaryIslands = islands.map((island) => {
      return {
        island: island,
        averageStay: 0,
        residencePlaces: [...stayByResidencePlaces],
      }
    })

    const stayByAccommodations = accommodations.map((accommodation) => {
      return {
        accommodation: accommodation,
        averageStay: 0,
        residencePlaces: [...stayByResidencePlaces],
      }
    })

    return years.map((year) => {
      return {
        year: year,
        averageStay: 0,
        stayByResidencePlaces: [...stayByResidencePlaces],
        stayByCanaryIslands: [...stayByCanaryIslands],
        stayByAccommodations: [...stayByAccommodations],
      }
    })
  }*/

  processFirstDataset(dataset: DatasetFormat): AverageStay[] {
    // Codes used in the dataset, it indicates the allowed residence places in the processor
    const allowedResidencePlaces = ['DE', 'ES', 'UK']

    // Years that are not allowed to be processed
    const notAllowedYears = ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017']

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

    const islandsCodes = dataset.categories.find(
      (category) => category.variable === 'Islas de alojamiento'
    )?.codes

    const islandsLabels = dataset.categories.find(
      (category) => category.variable === 'Islas de alojamiento'
    )?.labels

    if (!islandsCodes || !islandsLabels) {
      throw new Error(`Islands of the first dataset not found for the residence countries variable`)
    }

    const storageDataProcessed: AverageStay[] = []

    for (const data of dataset.data) {
      if (data.dimCodes[2].length > 4 || notAllowedYears.includes(data.dimCodes[2])) continue
      if (data.dimCodes[2] === this.lastDateStored) break

      // Get the object that is going to store the data that is being processed in this iteration
      const averageStay = storageDataProcessed.find((a) => a.year === Number(data.dimCodes[2]))

      if (!averageStay) {
        // Equal to:  data.dimCodes[0] === 'T' && data.dimCodes[1] === 'ES70
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
        if (allowedResidencePlaces.includes(data.dimCodes[0])) {
          const indexCode = residencePlacesCodes.indexOf(data.dimCodes[0])

          averageStay.stayByResidencePlaces.push({
            residencePlace: residencePlacesLabels[indexCode],
            averageStay: Number(data.Valor),
          })
        } else if (data.dimCodes[0].slice(0, 2) !== 'ES' && data.dimCodes[0] !== 'ZZ') {
          const otherResidencePlace = averageStay.stayByResidencePlaces.find(
            (a) => a.residencePlace === 'Otros países'
          )

          if (!otherResidencePlace) {
            averageStay.stayByResidencePlaces.push({
              residencePlace: 'Otros países',
              averageStay: Number(data.Valor),
            })
          } else {
            otherResidencePlace.averageStay += Number(data.Valor)
          }
        }
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
        const indexCode = islandsCodes.indexOf(data.dimCodes[1])
        const stayByCanaryIslands = averageStay.stayByCanaryIslands.find(
          (a) => a.island === islandsLabels[indexCode]
        ) as StayByCanaryIslands

        if (allowedResidencePlaces.includes(data.dimCodes[0])) {
          const indexCode2 = residencePlacesCodes.indexOf(data.dimCodes[0])

          stayByCanaryIslands.residencePlaces.push({
            residencePlace: residencePlacesLabels[indexCode2],
            averageStay: Number(data.Valor),
          })
        } else if (data.dimCodes[0].slice(0, 2) !== 'ES' && data.dimCodes[0] !== 'ZZ') {
          const otherResidencePlace = stayByCanaryIslands.residencePlaces.find(
            (a) => a.residencePlace === 'Otros países'
          )

          if (!otherResidencePlace) {
            stayByCanaryIslands.residencePlaces.push({
              residencePlace: 'Otros países',
              averageStay: Number(data.Valor),
            })
          } else {
            otherResidencePlace.averageStay += Number(data.Valor)
          }
        }
      }
    }

    return storageDataProcessed
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

      otherResidencePlace.averageStay = otherResidencePlace.averageStay / 13

      for (const stayByCanaryIslands of data.stayByCanaryIslands) {
        const stayByIsland = stayByCanaryIslands.residencePlaces.find(
          (a) => a.residencePlace === 'Otros países'
        ) as StayByResidencePlaces

        stayByIsland.averageStay = stayByIsland.averageStay / 13
      }

      for (const stayByAccommodations of data.stayByAccommodations) {
        if (stayByAccommodations.accommodation === 'Hotel') {
          stayByAccommodations.averageStay = stayByAccommodations.averageStay / 3
          for (const residencePlaces of stayByAccommodations.residencePlaces) {
            residencePlaces.averageStay = residencePlaces.averageStay / 3
          }
        }
      }
    }
  }

  getAccommodationTypes(accommodationCode: string) {
    switch (accommodationCode) {
      case '4':
        return 'Apartahotel o villa turística'
      case '5':
        return 'Otros establecimientos colectivos'
      case '6':
        return 'Alquiler'
      case '7':
        return 'Alojamiento privado'
      default:
        return 'Hotel'
    }
  }

  async storedDataProcessed(dataProcessed: AverageStay[]) {
    for (const data of dataProcessed) {
      await postDocument('http://localhost:3000/averageStay', data)
    }
  }
}
