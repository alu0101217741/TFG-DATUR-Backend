/*import { postDocument } from '../utils/axios/post'
import { DATABASE } from '../utils/config'
import {
  BusinessProgressExpectation,
  ExpectationIndicators,
} from '../utils/types/BusinessProgressExpectation'
import { DatasetFormat } from '../utils/types/DatasetFormat'
import { DatasetProcessor } from './datasetProcessor'

export class BusinessProgressExpectationProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: DatasetFormat[]): string {
    const firstDatasetCodes = datasets[0].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const secondDatasetCodes = datasets[1].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const thirdDatasetCodes = datasets[0].categories.find(
      (category) => category.variable === 'Periodos'
    )?.codes as string[]

    const firstDatasetPeriod = firstDatasetCodes[0]
    const secondDatasetPeriod = secondDatasetCodes[0]
    const thirdDatasetPeriod = thirdDatasetCodes[0]

    const firstDatasetYear = Number(firstDatasetPeriod.substring(0, 4))
    const secondDatasetYear = Number(secondDatasetPeriod.substring(0, 4))
    const thirdDatasetYear = Number(thirdDatasetPeriod.substring(0, 4))

    const firstDatasetMonth = Number(firstDatasetPeriod.substring(5))
    const secondDatasetMonth = Number(secondDatasetPeriod.substring(5))
    const thirdDatasetMonth = Number(thirdDatasetPeriod.substring(5))

    // return the minimum year and month of the three datasets
    if (firstDatasetYear < secondDatasetYear) {
      if (firstDatasetYear < thirdDatasetYear) {
        return firstDatasetPeriod
      } else {
        return thirdDatasetPeriod
      }
    } else if (firstDatasetYear > secondDatasetYear) {
      if (secondDatasetYear < thirdDatasetYear) {
        return secondDatasetPeriod
      } else {
        return thirdDatasetPeriod
      }
    } else {
      if (firstDatasetMonth < secondDatasetMonth) {
        if (firstDatasetMonth < thirdDatasetMonth) {
          return firstDatasetPeriod
        } else {
          return thirdDatasetPeriod
        }
      } else if (firstDatasetMonth > secondDatasetMonth) {
        if (secondDatasetMonth < thirdDatasetMonth) {
          return secondDatasetPeriod
        } else {
          return thirdDatasetPeriod
        }
      } else {
        return firstDatasetPeriod
      }
    }
  }

  processDatasets(
    datasets: DatasetFormat[],
    commonMinimumDate: string
  ): BusinessProgressExpectation[] {
    console.log(commonMinimumDate)

    const storageDataProcessed = this.processFirstDataset(datasets[0])

    this.processSecondDataset(datasets[1], storageDataProcessed)

    this.processThirdDataset(datasets[2], storageDataProcessed)

    return storageDataProcessed
  }

  processFirstDataset(dataset: DatasetFormat): BusinessProgressExpectation[] {
    const storageDataProcessed: BusinessProgressExpectation[] = []

    const ISLANDS = 'ES70' // CANARIAS
    const LABEL = 'ICH (Base 2013)'

    for (const data of dataset.data) {
      if (data.dimCodes[1] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      if (data.dimCodes[0] === ISLANDS && data.dimCodes[2] === LABEL) {
        storageDataProcessed.push({
          trimester: data.dimCodes[1],
          hotelConfidenceIndex: Number(data.Valor),
          businessProgressTendency: {
            favorable: 0,
            normal: 0,
            unfavorable: 0,
          },
          mainFactorsExpectations: {
            businessVolume: {
              increase: 0,
              stability: 0,
              decline: 0,
            },
            hiredStaff: {
              increase: 0,
              stability: 0,
              decline: 0,
            },
            investment: {
              increase: 0,
              stability: 0,
              decline: 0,
            },
            priceLevel: {
              increase: 0,
              stability: 0,
              decline: 0,
            },
          },
        })
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(
    dataset: DatasetFormat,
    storageDataProcessed: BusinessProgressExpectation[]
  ) {
    const CATEGORY_ESTABLISHMENTS = '0' // TOTAL CATEGORIAS
    const ISLANDS = 'ES70' // CANARIAS

    for (const data of dataset.data) {
      if (data.dimCodes[2] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      const businessProgressExpectation = storageDataProcessed.find(
        (expectation) => expectation.trimester === data.dimCodes[2]
      )

      if (!businessProgressExpectation) {
        throw new Error(
          `Trimester not found during second dataset processing to ${data.dimCodes[1]} code`
        )
      }

      if (data.dimCodes[0] === CATEGORY_ESTABLISHMENTS && data.dimCodes[1] === ISLANDS) {
        switch (data.dimCodes[3]) {
          case '0':
            break
          case '1':
            businessProgressExpectation.businessProgressTendency.favorable = Number(data.Valor)
            break
          case '2':
            businessProgressExpectation.businessProgressTendency.normal = Number(data.Valor)
            break
          case '3':
            businessProgressExpectation.businessProgressTendency.unfavorable = Number(data.Valor)
            break
          default:
            throw new Error(`Unknown business progress tendency code ${data.dimCodes[3]}`)
        }
      }
    }
  }

  processThirdDataset(dataset: DatasetFormat, storageDataProcessed: BusinessProgressExpectation[]) {
    const CATEGORY_ESTABLISHMENTS = '0' // TOTAL CATEGORIAS
    const ISLANDS = 'ES70' // CANARIAS
    const EXPECTATIONS = 'Respecto al trimestre anterior'

    for (const data of dataset.data) {
      if (data.dimCodes[3] === this.lastDateStored) break

      if (isNaN(Number(data.Valor))) data.Valor = '0'

      const businessProgressExpectation = storageDataProcessed.find(
        (expectation) => expectation.trimester === data.dimCodes[3]
      )

      if (!businessProgressExpectation) {
        throw new Error(
          `Trimester not found during third dataset processing to ${data.dimCodes[1]} code`
        )
      }

      if (
        data.dimCodes[1] === CATEGORY_ESTABLISHMENTS &&
        data.dimCodes[2] === ISLANDS &&
        data.dimCodes[4] === EXPECTATIONS
      ) {
        switch (data.dimCodes[0]) {
          case 'Facturación (volumen de negocio)':
            this.mainFactorsExpectationsProcessor(
              businessProgressExpectation.mainFactorsExpectations.businessVolume,
              data.dimCodes[5],
              Number(data.Valor)
            )
            break
          case 'Empleo (personal contratado)':
            this.mainFactorsExpectationsProcessor(
              businessProgressExpectation.mainFactorsExpectations.hiredStaff,
              data.dimCodes[5],
              Number(data.Valor)
            )
            break
          case 'Inversión':
            this.mainFactorsExpectationsProcessor(
              businessProgressExpectation.mainFactorsExpectations.investment,
              data.dimCodes[5],
              Number(data.Valor)
            )
            break
          case 'Nivel de precios':
            this.mainFactorsExpectationsProcessor(
              businessProgressExpectation.mainFactorsExpectations.priceLevel,
              data.dimCodes[5],
              Number(data.Valor)
            )
            break
          default:
            throw new Error(`Unknown main factor expectation code ${data.dimCodes[0]}`)
        }
      }
    }
  }

  mainFactorsExpectationsProcessor(
    factorExpectation: ExpectationIndicators,
    indicator: string,
    value: number
  ) {
    switch (indicator) {
      case '0':
        break
      case '1':
        factorExpectation.increase = value
        break
      case '2':
        factorExpectation.stability = value
        break
      case '3':
        factorExpectation.decline = value
        break
      default:
        throw new Error(`Unknown main factor expectation indicator ${indicator}`)
    }
  }

  async storedDataProcessed(dataProcessed: BusinessProgressExpectation[]) {
    for (const data of dataProcessed) {
      await postDocument(DATABASE + '/businessProgressExpectation', data)
    }
  }
}
*/
