import { postDocument } from '../utils/axios/post'
import { DATABASE } from '../utils/config'
import { DatasetFormat } from '../utils/types/DatasetFormat'
import { TouristSpending } from '../utils/types/TouristSpending'
import { DatasetProcessor } from './datasetProcessor'

export class TouristSpendingProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: DatasetFormat[]): string {
    const firstDatasetCodes = datasets[0].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const secondDatasetCodes = datasets[1].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const firstDatasetPeriod = firstDatasetCodes.find((code) => code.length === 6) as string
    const secondDatasetPeriod = secondDatasetCodes.find((code) => code.length === 6) as string

    const firstDatasetYear = Number(firstDatasetPeriod.substring(5)) // TODO: arreglar esto
    const secondDatasetYear = Number(secondDatasetPeriod.substring(5))

    const firstDatasetTrimester = Number(firstDatasetPeriod.substring(5))
    const secondDatasetTrimester = Number(secondDatasetPeriod.substring(5))

    if (firstDatasetYear < secondDatasetYear) {
      return firstDatasetPeriod
    } else if (firstDatasetYear > secondDatasetYear) {
      return secondDatasetPeriod
    } else {
      if (firstDatasetTrimester < secondDatasetTrimester) {
        return firstDatasetPeriod
      } else if (firstDatasetTrimester > secondDatasetTrimester) {
        return secondDatasetPeriod
      } else {
        return firstDatasetPeriod
      }
    }
  }

  processDatasets(datasets: DatasetFormat[], commonMinimumDate: string): TouristSpending[] {
    console.log(commonMinimumDate) // TODO: quitar

    // The first dataset is processed
    const storageDataProcessed = this.processFirstDataset(datasets[0])

    // The second dataset is processed
    this.processSecondDataset(datasets[1], storageDataProcessed)

    return storageDataProcessed
  }

  processFirstDataset(dataset: DatasetFormat): TouristSpending[] {
    // The codes and labels of the concepts are obtained
    const conceptsCodes = dataset.categories.find(
      (category) => category.variable === 'Conceptos'
    )?.codes

    const conceptsLabels = dataset.categories.find(
      (category) => category.variable === 'Conceptos'
    )?.labels

    if (!conceptsCodes || !conceptsLabels) {
      throw new Error(`Codes or labels not found for concepts variable`)
    }

    // The codes and labels of the residence places are obtained
    const residencePlacesCodes = dataset.categories.find(
      (category) => category.variable === 'Países de residencia'
    )?.codes

    const residencePlacesLabels = dataset.categories.find(
      (category) => category.variable === 'Países de residencia'
    )?.labels

    if (!residencePlacesCodes || !residencePlacesLabels) {
      throw new Error(`Codes or labels not found for residence places variable`)
    }

    // The storage that is going to store the process data
    const storageDataProcessed: TouristSpending[] = []

    for (const data of dataset.data) {
      if (data.dimCodes[4].length !== 6) continue
      if (data.dimCodes[4] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      // Get the object that is going to store the data that is being processed in this iteration
      const touristSpending = storageDataProcessed.find((t) => t.trimester === data.dimCodes[4])

      if (!touristSpending) {
        // If the trimester does not exist
        storageDataProcessed.push({
          trimester: data.dimCodes[4],
          totalSpending: 0,
          averageSpending: Number(data.Valor),
          averageSpendingByDay: 0,
          spendingByConcept: [],
          spendingByResidencePlace: [],
        })
      } else if (
        data.dimCodes[0] === 'Gasto por turista y día' &&
        data.dimCodes[1] === '0_0' &&
        data.dimCodes[2] === '0' &&
        data.dimCodes[3] === 'ES70'
      ) {
        // The average spending by day is added
        touristSpending.averageSpendingByDay = Number(data.Valor)
      } else if (
        data.dimCodes[0] === 'Gasto por turista' &&
        data.dimCodes[1] !== '0_0' &&
        data.dimCodes[1] !== '3' &&
        data.dimCodes[1] !== '4' &&
        data.dimCodes[1] !== '12' &&
        data.dimCodes[1] !== '13' &&
        data.dimCodes[2] === '0' &&
        data.dimCodes[3] === 'ES70'
      ) {
        // Is a new concept is processed, it is added to the storage data processed

        const indexCode = conceptsCodes.indexOf(data.dimCodes[1])

        touristSpending.spendingByConcept.push({
          concept: conceptsLabels[indexCode],
          totalSpending: 0,
          averageSpending: Number(data.Valor),
        })
      } else if (
        data.dimCodes[0] === 'Gasto por turista' &&
        data.dimCodes[1] === '0_0' &&
        data.dimCodes[2] !== '0' &&
        data.dimCodes[3] === 'ES70'
      ) {
        // Is a new residence place is processed, it is added to the storage data processed

        const indexPlace = residencePlacesCodes.indexOf(data.dimCodes[2])

        touristSpending.spendingByResidencePlace.push({
          residencePlace: residencePlacesLabels[indexPlace],
          averageSpending: Number(data.Valor),
          averageSpendingByDay: 0,
          concepts: [],
        })
      } else if (
        data.dimCodes[0] === 'Gasto por turista y día' &&
        data.dimCodes[1] === '0_0' &&
        data.dimCodes[2] !== '0' &&
        data.dimCodes[3] === 'ES70'
      ) {
        // The average spending by day to a particular resindence place is added
        const indexPlace = residencePlacesCodes.indexOf(data.dimCodes[2])

        const residencePlace = touristSpending.spendingByResidencePlace.find(
          (rp) => rp.residencePlace === residencePlacesLabels[indexPlace]
        )
        if (!residencePlace)
          throw new Error(
            `Residence place ${data.dimCodes[2]} not found in array SpendignByResindencePlace`
          )

        residencePlace.averageSpendingByDay = Number(data.Valor)
      } else if (
        data.dimCodes[0] === 'Gasto por turista' &&
        data.dimCodes[1] !== '0_0' &&
        data.dimCodes[1] !== '3' &&
        data.dimCodes[1] !== '4' &&
        data.dimCodes[1] !== '12' &&
        data.dimCodes[1] !== '13' &&
        data.dimCodes[2] !== '0' &&
        data.dimCodes[3] === 'ES70'
      ) {
        // Is a new concept is processed to a particular residence place, it is added
        const indexPlace = residencePlacesCodes.indexOf(data.dimCodes[2])

        const residencePlace = touristSpending.spendingByResidencePlace.find(
          (rp) => rp.residencePlace === residencePlacesLabels[indexPlace]
        )

        if (!residencePlace)
          throw new Error(
            `Residence place ${data.dimCodes[2]} not found in array SpendignByResindencePlace`
          )

        const indexCode = conceptsCodes.indexOf(data.dimCodes[1])

        residencePlace.concepts.push({
          concept: conceptsLabels[indexCode],
          totalSpending: 0,
          averageSpending: Number(data.Valor),
        })
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(dataset: DatasetFormat, storageDataProcessed: TouristSpending[]) {
    // The codes and labels of the concepts are obtained
    const conceptsCodes = dataset.categories.find(
      (category) => category.variable === 'Conceptos'
    )?.codes

    const conceptsLabels = dataset.categories.find(
      (category) => category.variable === 'Conceptos'
    )?.labels

    if (!conceptsCodes || !conceptsLabels) {
      throw new Error(`Codes or labels not found for concepts variable`)
    }

    for (const data of dataset.data) {
      if (data.dimCodes[2].length !== 6) continue
      if (data.dimCodes[2] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      // Get the object that is going to store the data that is being processed in this iteration
      const touristSpending = storageDataProcessed.find((t) => t.trimester === data.dimCodes[2])

      if (!touristSpending) {
        throw new Error(
          'The datasets are not aligned, the second dataset contains different trimesters than the first'
        )
      } else if (
        data.dimCodes[0] === '0' &&
        data.dimCodes[1] === '0' &&
        data.dimCodes[3] === 'Valor absoluto'
      ) {
        // The total spending is added
        touristSpending.totalSpending = Number(data.Valor)
      } else if (
        data.dimCodes[0] !== '0' &&
        data.dimCodes[0] !== '3' &&
        data.dimCodes[0] !== '4' &&
        data.dimCodes[0] !== '12' &&
        data.dimCodes[0] !== '13' &&
        data.dimCodes[1] === '0' &&
        data.dimCodes[3] === 'Valor absoluto'
      ) {
        const indexCode = conceptsCodes.indexOf(data.dimCodes[0])

        const spendingByConcept = touristSpending.spendingByConcept.find(
          (sc) => sc.concept === conceptsLabels[indexCode]
        )

        if (!spendingByConcept)
          throw new Error(`Concept ${data.dimCodes[0]} not found in array SpendingByConcept`)

        spendingByConcept.totalSpending = Number(data.Valor)
      } else if (
        data.dimCodes[0] !== '0' &&
        data.dimCodes[0] !== '3' &&
        data.dimCodes[0] !== '4' &&
        data.dimCodes[0] !== '12' &&
        data.dimCodes[0] !== '13' &&
        (data.dimCodes[1] === 'DEU276' ||
          data.dimCodes[1] === 'ESP724' ||
          data.dimCodes[1] === 'NLD528' ||
          data.dimCodes[1] === 'DNK208_FIN246_NOR578_SWE752' ||
          data.dimCodes[1] === 'GBR826' ||
          data.dimCodes[1] === 'ZZZ900') &&
        data.dimCodes[3] === 'Valor absoluto'
      ) {
        const spendingByResidencePlace = touristSpending.spendingByResidencePlace.find(
          (rp) => rp.residencePlace === this.residencePlaceMapping(data.dimCodes[1])
        )

        if (!spendingByResidencePlace)
          throw new Error(
            `Residence place ${data.dimCodes[1]} not found in array SpendignByResindencePlace`
          )

        const indexCode = conceptsCodes.indexOf(data.dimCodes[0])

        const concept = spendingByResidencePlace.concepts.find(
          (c) => c.concept === conceptsLabels[indexCode]
        )

        if (!concept)
          throw new Error(
            `Concept ${data.dimCodes[0]} not found in array SpendingByResindencePlace`
          )

        concept.totalSpending = Number(data.Valor)
      }
    }
  }

  residencePlaceMapping(residencePlacesCodes: string) {
    switch (residencePlacesCodes) {
      case 'DEU276':
        return 'Alemania'
      case 'ESP724':
        return 'España'
      case 'NLD528':
        return 'Holanda'
      case 'DNK208_FIN246_NOR578_SWE752':
        return 'Países Nórdicos'
      case 'GBR826':
        return 'Reino Unido'
      default:
        return 'Otros países'
    }
  }

  async storedDataProcessed(dataProcessed: TouristSpending[]) {
    for (const data of dataProcessed) {
      await postDocument(DATABASE + '/touristSpending', data)
    }
  }
}
