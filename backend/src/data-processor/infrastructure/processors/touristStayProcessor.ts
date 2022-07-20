import { Dataset } from '../../domain/containers/Dataset'
import { TouristStay } from '../../domain/tourist-stay/TouristStay'
import { ResidencePlaces } from '../../domain/tourist-stay/types/ResidencePlaces'
import { notEqualAndOperator } from '../../utils/logicOperations'
import { DatasetProcessor } from './datasetProcessor'
import { accommodationTouristStayToDomain } from './mappers/accommodationTouristStayToDomain'
import { islandToDomain } from './mappers/islandToDomain'
import { ResidencePlaceMapper } from './mappers/residencePlaceMapper'
import { residencePlaceToDomain } from './mappers/residencePlaceToDomain'
import { ResidencePlaceResponse } from './types/residencePlaceResponse'

export class TouristStayProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: Dataset[]): string {
    const firstDatasetCodes = datasets[0].getCodesForCategory('Periodos')

    const secondDatasetCodes = datasets[1].getCodesForCategory('Periodos')

    const firstDatasetYear = firstDatasetCodes.find((code) => code.length === 4) as string
    const secondDatasetYear = secondDatasetCodes.find((code) => code.length === 4) as string

    if (Number(firstDatasetYear) < Number(secondDatasetYear)) return firstDatasetYear

    return secondDatasetYear
  }

  processDatasets(datasets: Dataset[]): TouristStay[] {
    // The first dataset is processed
    const storageDataProcessed = this.processFirstDataset(datasets[0])

    // The second dataset is processed
    this.processSecondDataset(datasets[1], storageDataProcessed)

    this.normalizeDataProcessed(storageDataProcessed)

    // Processed data is returned
    return storageDataProcessed
  }

  processFirstDataset(dataset: Dataset): TouristStay[] {
    // The codes and labels of the islands are obtained
    const islandsCodes = dataset.getCodesForCategory('Islas de alojamiento')

    const islandsLabels = dataset.getLabelsForCategory('Islas de alojamiento')

    // The dataset begins to process
    const storageDataProcessed: TouristStay[] = []

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[2].length > 4) continue
      if (data.categoryCodes[2] === this.lastDateStored) break

      // Get the object that is going to store the data that is being processed in this iteration
      const touristStay = storageDataProcessed.find(
        (a) => a.getYear() === Number(data.categoryCodes[2])
      )

      if (!touristStay) {
        // Average stay in the Canary Islands of a tourist of any nationality in a given year
        storageDataProcessed.push(
          TouristStay.fromPrimitives({
            year: Number(data.categoryCodes[2]),
            averageStay: Number(data.dataValue),
            stayByResidencePlaces: [],
            stayByIsland: [],
            stayByAccommodations: [],
          })
        )
      } else if (
        notEqualAndOperator(data.categoryCodes[0], ['T', 'T1', 'ZZ']) &&
        (data.categoryCodes[0] === 'ES_XES70' || data.categoryCodes[0].slice(0, 2) !== 'ES') &&
        data.categoryCodes[1] === 'ES70'
      ) {
        // Average stay in the Canary Islands of tourists by residence place

        if (!Object.values(ResidencePlaceResponse).toString().includes(data.categoryCodes[0])) {
          throw new Error(`The residence place code ${data.categoryCodes[0]} is not valid`)
        }

        const residencePlaceInDomain = ResidencePlaceMapper(
          data.categoryCodes[0] as ResidencePlaceResponse
        )

        const residencePlaceFound = touristStay.findStayByResidencePlace(residencePlaceInDomain)

        if (!residencePlaceFound) {
          touristStay.addStayByResidencePlace(residencePlaceInDomain, Number(data.dataValue))
        } else {
          residencePlaceFound.addAverageStay(Number(data.dataValue))
        }
      } else if (data.categoryCodes[0] === 'T' && data.categoryCodes[1] !== 'ES70') {
        // Average stay in the Canary Islands of tourists by island

        const indexCode = islandsCodes.indexOf(data.categoryCodes[1])

        const islandInDomain = islandToDomain(islandsLabels[indexCode])

        touristStay.addStayByIsland(islandInDomain, Number(data.dataValue))
      } else if (
        notEqualAndOperator(data.categoryCodes[0], ['T', 'T1', 'ZZ']) &&
        (data.categoryCodes[0] === 'ES_XES70' || data.categoryCodes[0].slice(0, 2) !== 'ES') &&
        data.categoryCodes[1] !== 'ES70'
      ) {
        // Average stay tourists on an island by residence place

        const indexCode = islandsCodes.indexOf(data.categoryCodes[1])

        const stayByIsland = touristStay.findStayByIsland(islandToDomain(islandsLabels[indexCode]))

        if (!stayByIsland) {
          throw new Error(`Island with label ${islandsLabels[indexCode]} not found`)
        }

        if (!Object.values(ResidencePlaceResponse).toString().includes(data.categoryCodes[0])) {
          throw new Error(`The residence place code ${data.categoryCodes[0]} is not valid`)
        }

        const residencePlaceInDomain = ResidencePlaceMapper(
          data.categoryCodes[0] as ResidencePlaceResponse
        )

        const islandStayByResidencePlace =
          stayByIsland.findIslandStayByResidencePlace(residencePlaceInDomain)

        if (!islandStayByResidencePlace) {
          stayByIsland.addIslandStayByResidencePlaces(
            residencePlaceInDomain,
            Number(data.dataValue)
          )
        } else {
          islandStayByResidencePlace.addAverageStay(Number(data.dataValue))
        }
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(dataset: Dataset, storageDataProcessed: TouristStay[]) {
    const residencePlacesCodes = dataset.getCodesForCategory('Países de residencia')

    const residencePlacesLabels = dataset.getLabelsForCategory('Países de residencia')

    const accommodationCodes = dataset.getCodesForCategory('Tipos de alojamiento')

    const accommodationLabels = dataset.getLabelsForCategory('Tipos de alojamiento')

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[3].length > 4) continue
      if (data.categoryCodes[3] === this.lastDateStored) break

      // Get the object that is going to store the data that is being processed in this iteration
      const touristStay = storageDataProcessed.find(
        (a) => a.getYear() === Number(data.categoryCodes[3])
      )

      if (!touristStay) {
        throw new Error(
          'The datasets are not aligned, the second dataset contains different years than the first'
        )
      }

      if (
        data.categoryCodes[0] !== '0' &&
        data.categoryCodes[1] === '0' &&
        data.categoryCodes[2] === 'ES70'
      ) {
        const indexCode = accommodationCodes.indexOf(data.categoryCodes[0])

        const accommodationInDomain = accommodationTouristStayToDomain(
          accommodationLabels[indexCode]
        )

        const stayByAccommodations = touristStay.findStayByAccommodation(accommodationInDomain)

        if (!stayByAccommodations) {
          touristStay.addStayByAccommodation(accommodationInDomain, Number(data.dataValue))
        } else {
          stayByAccommodations.addAverageStay(Number(data.dataValue))
        }
      } else if (
        data.categoryCodes[0] !== '0' &&
        data.categoryCodes[1] !== '0' &&
        data.categoryCodes[2] === 'ES70'
      ) {
        const indexAccommodationCode = accommodationCodes.indexOf(data.categoryCodes[0])

        const accommodationCodeInDomain = accommodationTouristStayToDomain(
          accommodationLabels[indexAccommodationCode]
        )

        const stayByAccommodations = touristStay.findStayByAccommodation(accommodationCodeInDomain)

        if (!stayByAccommodations) {
          throw new Error(
            `Stay by accommodation not found to domain label ${accommodationCodeInDomain}`
          )
        }

        const indexCode = residencePlacesCodes.indexOf(data.categoryCodes[1])

        const residencePlaceInDomain = residencePlaceToDomain(residencePlacesLabels[indexCode])

        const accommodationStayByResidencePlace =
          stayByAccommodations.findAccommodationStayByResidencePlace(residencePlaceInDomain)

        if (!accommodationStayByResidencePlace) {
          stayByAccommodations.addAccommodationStayByResidencePlace(
            residencePlaceInDomain,
            Number(data.dataValue)
          )
        } else {
          accommodationStayByResidencePlace.addAverageStay(Number(data.dataValue))
        }
      }
    }
  }

  normalizeDataProcessed(dataProcessed: TouristStay[]) {
    for (const data of dataProcessed) {
      const otherCountriesResidencePlace = data.findStayByResidencePlace(
        ResidencePlaces.OTHER_COUNTRIES
      )

      const nordicCountriesResidencePlace = data.findStayByResidencePlace(
        ResidencePlaces.NORDIC_COUNTRIES
      )

      if (!otherCountriesResidencePlace || !nordicCountriesResidencePlace) {
        throw new Error(
          'Error normalizing tourist stay data, not possible to get stay by residence'
        )
      }

      otherCountriesResidencePlace.setAverageStay(
        Math.round((otherCountriesResidencePlace.getAverageStay() / 9 + Number.EPSILON) * 100) / 100
      )

      nordicCountriesResidencePlace.setAverageStay(
        Math.round((nordicCountriesResidencePlace.getAverageStay() / 4 + Number.EPSILON) * 100) /
          100
      )

      const stayByIslands = data.getStayByIsland()

      if (!stayByIslands) {
        throw new Error('Error normalizing tourist stay data, not possible to get stay by island')
      }

      for (const stayByIsland of stayByIslands) {
        const otherCountriesStayByIsland = stayByIsland?.findIslandStayByResidencePlace(
          ResidencePlaces.OTHER_COUNTRIES
        )

        const nordicCountriesStayByIsland = stayByIsland?.findIslandStayByResidencePlace(
          ResidencePlaces.NORDIC_COUNTRIES
        )

        if (!otherCountriesStayByIsland || !nordicCountriesStayByIsland) {
          throw new Error(
            'Error normalizing tourist stay data, not possible to get countries data in stay by island'
          )
        }

        otherCountriesStayByIsland.setAverageStay(
          Math.round((otherCountriesStayByIsland.getAverageStay() / 9 + Number.EPSILON) * 100) / 100
        )

        nordicCountriesStayByIsland.setAverageStay(
          Math.round((nordicCountriesStayByIsland.getAverageStay() / 4 + Number.EPSILON) * 100) /
            100
        )
      }
    }
  }
}
