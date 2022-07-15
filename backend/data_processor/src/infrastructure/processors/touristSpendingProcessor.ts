import { Dataset } from '../../domain/containers/Dataset'
import { ResidencePlace } from '../../domain/tourist-spending/ResidencePlace'
import { SpendingConcept } from '../../domain/tourist-spending/SpendingConcept'
import { TouristSpending } from '../../domain/tourist-spending/TouristSpending'

import { equalOrOperator, notEqualAndOperator } from '../../utils/logicOperations'
import { DatasetProcessor } from './datasetProcessor'
import { touristNationalityMapper } from './mappers/touristNationalityMapper'
import { touristResidencePlaceToDomain } from './mappers/touristResidencePlaceToDomain'
import { touristSpendingConceptToDomain } from './mappers/touristSpendingConceptToDomain'
import { TouristNationalityResponse } from './types/touristNationalityReponse'

export class TouristSpendingProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: Dataset[]): string {
    const firstDatasetCodes = datasets[0].getCodesForCategory('Periodos')

    const secondDatasetCodes = datasets[1].getCodesForCategory('Periodos')

    const firstDatasetPeriod = firstDatasetCodes.find((code) => code.length === 6) as string
    const secondDatasetPeriod = secondDatasetCodes.find((code) => code.length === 6) as string

    const firstDatasetYear = Number(firstDatasetPeriod.substring(5)) // TODO: arreglar esto
    const secondDatasetYear = Number(secondDatasetPeriod.substring(5))

    const firstDatasetTrimester = Number(firstDatasetPeriod.substring(5))
    const secondDatasetTrimester = Number(secondDatasetPeriod.substring(5))

    if (firstDatasetYear < secondDatasetYear) return firstDatasetPeriod
    if (firstDatasetYear > secondDatasetYear) return secondDatasetPeriod
    if (firstDatasetTrimester < secondDatasetTrimester) return firstDatasetPeriod
    if (firstDatasetTrimester > secondDatasetTrimester) return secondDatasetPeriod
    return firstDatasetPeriod
  }

  processDatasets(datasets: Dataset[]): TouristSpending[] {
    // The first dataset is processed
    const storageDataProcessed = this.processFirstDataset(datasets[0])

    // The second dataset is processed
    this.processSecondDataset(datasets[1], storageDataProcessed)

    return storageDataProcessed
  }

  processFirstDataset(dataset: Dataset): TouristSpending[] {
    // The codes and labels of the concepts are obtained
    const conceptsCodes = dataset.getCodesForCategory('Conceptos')

    const conceptsLabels = dataset.getLabelsForCategory('Conceptos')

    // The codes and labels of the residence places are obtained
    const residencePlacesCodes = dataset.getCodesForCategory('Países de residencia')

    const residencePlacesLabels = dataset.getLabelsForCategory('Países de residencia')

    // The storage that is going to store the process data
    const storageDataProcessed: TouristSpending[] = []

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[4].length !== 6) continue
      if (data.categoryCodes[4] === this.lastDateStored) break

      // Get the object that is going to store the data that is being processed in this iteration
      const touristSpending = storageDataProcessed.find(
        (t) => t.getTrimester() === data.categoryCodes[4]
      )

      if (!touristSpending) {
        // If the trimester does not exist
        storageDataProcessed.push(
          TouristSpending.fromPrimitives({
            trimester: data.categoryCodes[4],
            averageSpending: Number(data.dataValue),
            totalSpending: 0,
            averageSpendingByDay: 0,
            spendingByConcept: undefined,
            spendingByResidencePlace: undefined,
          })
        )
      } else if (
        data.categoryCodes[0] === 'Gasto por turista y día' &&
        data.categoryCodes[1] === '0_0' &&
        data.categoryCodes[2] === '0' &&
        data.categoryCodes[3] === 'ES70'
      ) {
        // The average spending by day is added
        touristSpending.setAverageSpendingByDay(Number(data.dataValue))
      } else if (
        data.categoryCodes[0] === 'Gasto por turista' &&
        notEqualAndOperator(data.categoryCodes[1], ['0_0', '3', '4', '12', '13']) &&
        data.categoryCodes[2] === '0' &&
        data.categoryCodes[3] === 'ES70'
      ) {
        // Is a new concept is processed, it is added to the storage data processed

        const indexCode = conceptsCodes.indexOf(data.categoryCodes[1])

        touristSpending.addSpendingByConcept(
          SpendingConcept.fromPrimitives({
            concept: touristSpendingConceptToDomain(conceptsLabels[indexCode]),
            totalSpending: 0,
            averageSpending: Number(data.dataValue),
          })
        )
      } else if (
        data.categoryCodes[0] === 'Gasto por turista' &&
        data.categoryCodes[1] === '0_0' &&
        data.categoryCodes[2] !== '0' &&
        data.categoryCodes[3] === 'ES70'
      ) {
        // Is a new residence place is processed, it is added to the storage data processed

        const indexPlace = residencePlacesCodes.indexOf(data.categoryCodes[2])

        touristSpending.addSpendingByResidencePlace(
          ResidencePlace.fromPrimitives({
            country: touristResidencePlaceToDomain(residencePlacesLabels[indexPlace]),
            averageSpending: Number(data.dataValue),
            averageSpendingByDay: 0,
            concepts: undefined,
          })
        )
      } else if (
        data.categoryCodes[0] === 'Gasto por turista y día' &&
        data.categoryCodes[1] === '0_0' &&
        data.categoryCodes[2] !== '0' &&
        data.categoryCodes[3] === 'ES70'
      ) {
        // The average spending by day to a particular resindence place is added
        const indexPlace = residencePlacesCodes.indexOf(data.categoryCodes[2])

        const residencePlace = touristSpending.getResidencePlacesByLabel(
          residencePlacesLabels[indexPlace]
        )

        residencePlace.setAverageSpendingByDay(Number(data.dataValue))
      } else if (
        data.categoryCodes[0] === 'Gasto por turista' &&
        notEqualAndOperator(data.categoryCodes[1], ['0_0', '3', '4', '12', '13']) &&
        data.categoryCodes[2] !== '0' &&
        data.categoryCodes[3] === 'ES70'
      ) {
        // Is a new concept is processed to a particular residence place, it is added
        const indexPlace = residencePlacesCodes.indexOf(data.categoryCodes[2])

        const residencePlace = touristSpending.getResidencePlacesByLabel(
          residencePlacesLabels[indexPlace]
        )

        const indexCode = conceptsCodes.indexOf(data.categoryCodes[1])

        residencePlace.addSpendingConcept(
          SpendingConcept.fromPrimitives({
            concept: touristSpendingConceptToDomain(conceptsLabels[indexCode]),
            totalSpending: 0,
            averageSpending: Number(data.dataValue),
          })
        )
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(dataset: Dataset, storageDataProcessed: TouristSpending[]) {
    // The codes and labels of the concepts are obtained
    const conceptsCodes = dataset.getCodesForCategory('Conceptos')

    const conceptsLabels = dataset.getLabelsForCategory('Conceptos')

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[2].length !== 6) continue
      if (data.categoryCodes[2] === this.lastDateStored) break

      // Get the object that is going to store the data that is being processed in this iteration
      const touristSpending = storageDataProcessed.find(
        (t) => t.getTrimester() === data.categoryCodes[2]
      )

      if (!touristSpending) {
        throw new Error(
          'The datasets are not aligned, the second dataset contains different trimesters than the first'
        )
      }

      if (
        data.categoryCodes[0] === '0' &&
        data.categoryCodes[1] === '0' &&
        data.categoryCodes[3] === 'Valor absoluto'
      ) {
        // The total spending is added
        touristSpending.setTotalSpending(Number(data.dataValue))
      } else if (
        notEqualAndOperator(data.categoryCodes[0], ['0', '3', '4', '12', '13']) &&
        data.categoryCodes[1] === '0' &&
        data.categoryCodes[3] === 'Valor absoluto'
      ) {
        const indexCode = conceptsCodes.indexOf(data.categoryCodes[0])

        const spendingByConcept = touristSpending.getSpendingByConceptwithLabel(
          conceptsLabels[indexCode]
        )

        spendingByConcept.setTotalSpending(Number(data.dataValue))
      } else if (
        notEqualAndOperator(data.categoryCodes[0], ['0', '3', '4', '12', '13']) &&
        equalOrOperator(data.categoryCodes[1], [
          'DEU276',
          'ESP724',
          'NLD528',
          'DNK208_FIN246_NOR578_SWE752',
          'GBR826',
          'ZZZ900',
        ]) &&
        data.categoryCodes[3] === 'Valor absoluto'
      ) {
        const residencePlace = touristSpending.getResidencePlacesByLabel(
          touristNationalityMapper(data.categoryCodes[1] as TouristNationalityResponse)
        )

        const indexCode = conceptsCodes.indexOf(data.categoryCodes[0])

        const residencePlaceConcept = residencePlace.getConceptWithLabel(conceptsLabels[indexCode])

        residencePlaceConcept.setTotalSpending(Number(data.dataValue))
      }
    }
  }
}
