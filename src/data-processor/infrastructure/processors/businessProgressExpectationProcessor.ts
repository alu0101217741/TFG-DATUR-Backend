import { BusinessProgressExpectation } from '../../domain/business-progress-expectation/BusinessProgressExpectation'
import { MainFactorsLabels } from '../../domain/business-progress-expectation/types/MainFactorsLabels'
import { Dataset } from '../../domain/containers/Dataset'
import { DatasetProcessor } from './datasetProcessor'
import { expectationIndicatorLabelToDomain } from './mappers/expectationIndicatorLabelToDomain'
import { tendencyLabelsToDomain } from './mappers/tendencyLabelsToDomain'

export class BusinessProgressExpectationProcessor extends DatasetProcessor {
  getCommonMinimumDate(datasets: Dataset[]): string {
    const firstDatasetPeriod = datasets[0].getCodesForCategory('Periodos')[0]

    const secondDatasetPeriod = datasets[1].getCodesForCategory('Periodos')[0]

    const thirdDatasetPeriod = datasets[0].getCodesForCategory('Periodos')[0]

    const firstDatasetYear = Number(firstDatasetPeriod.substring(0, 4))
    const secondDatasetYear = Number(secondDatasetPeriod.substring(0, 4))
    const thirdDatasetYear = Number(thirdDatasetPeriod.substring(0, 4))

    const firstDatasetMonth = Number(firstDatasetPeriod.substring(5))
    const secondDatasetMonth = Number(secondDatasetPeriod.substring(5))
    const thirdDatasetMonth = Number(thirdDatasetPeriod.substring(5))

    // return the minimum year and month of the three datasets
    if (firstDatasetYear < secondDatasetYear) {
      if (firstDatasetYear < thirdDatasetYear) return firstDatasetPeriod
      return thirdDatasetPeriod
    }

    if (firstDatasetYear > secondDatasetYear) {
      if (secondDatasetYear < thirdDatasetYear) return secondDatasetPeriod
      return thirdDatasetPeriod
    }

    if (firstDatasetYear > thirdDatasetYear) {
      return thirdDatasetPeriod
    }

    if (firstDatasetMonth < secondDatasetMonth) {
      if (firstDatasetMonth < thirdDatasetMonth) return firstDatasetPeriod
      return thirdDatasetPeriod
    }

    if (firstDatasetMonth > secondDatasetMonth) {
      if (secondDatasetMonth < thirdDatasetMonth) return secondDatasetPeriod
      return thirdDatasetPeriod
    }

    if (firstDatasetMonth > thirdDatasetMonth) {
      return thirdDatasetPeriod
    }

    return firstDatasetPeriod
  }

  processDatasets(datasets: Dataset[]): BusinessProgressExpectation[] {
    const storageDataProcessed = this.processFirstDataset(datasets[0])

    this.processSecondDataset(datasets[1], storageDataProcessed)

    this.processThirdDataset(datasets[2], storageDataProcessed)

    return storageDataProcessed
  }

  processFirstDataset(dataset: Dataset): BusinessProgressExpectation[] {
    const ISLANDS = 'ES70' // CANARIAS
    const LABEL = 'ICH (Base 2013)'

    const storageDataProcessed: BusinessProgressExpectation[] = []

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[1] === this.lastDateStored) break

      if (data.categoryCodes[0] === ISLANDS && data.categoryCodes[2] === LABEL) {
        const expectationIndicator = {
          increase: 0,
          stability: 0,
          decline: 0,
        }

        storageDataProcessed.push(
          BusinessProgressExpectation.fromPrimitives({
            trimester: data.categoryCodes[1],
            hotelConfidenceIndex: Number(data.dataValue),
            businessProgressTendency: {
              favorable: 0,
              normal: 0,
              unfavorable: 0,
            },
            mainFactorsExpectations: {
              businessVolume: expectationIndicator,
              hiredStaff: expectationIndicator,
              investment: expectationIndicator,
              priceLevel: expectationIndicator,
            },
          })
        )
      }
    }

    return storageDataProcessed
  }

  processSecondDataset(dataset: Dataset, storageDataProcessed: BusinessProgressExpectation[]) {
    const CATEGORY_ESTABLISHMENTS = '0' // TOTAL CATEGORIAS
    const ISLANDS = 'ES70' // CANARIAS

    const businessProgressTendencyCodes = dataset.getCodesForCategory(
      'Expectativas de la marcha del negocio'
    )

    const businessProgressTendencyLabels = dataset.getLabelsForCategory(
      'Expectativas de la marcha del negocio'
    )

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[2] === this.lastDateStored) break

      const businessProgressExpectation = storageDataProcessed.find(
        (expectation) => expectation.getTrimester() === data.categoryCodes[2]
      )

      if (!businessProgressExpectation) {
        throw new Error(
          `Trimester not found during second dataset processing to ${data.categoryCodes[1]} code`
        )
      }

      if (
        data.categoryCodes[0] === CATEGORY_ESTABLISHMENTS &&
        data.categoryCodes[1] === ISLANDS &&
        data.categoryCodes[3] !== '0'
      ) {
        const indexCode = businessProgressTendencyCodes.indexOf(data.categoryCodes[3])
        const tendencyLabel = businessProgressTendencyLabels[indexCode]

        businessProgressExpectation.addBusinessProgressTendency(
          tendencyLabelsToDomain(tendencyLabel),
          Number(data.dataValue)
        )
      }
    }
  }

  processThirdDataset(dataset: Dataset, storageDataProcessed: BusinessProgressExpectation[]) {
    const CATEGORY_ESTABLISHMENTS = '0' // TOTAL CATEGORIAS
    const ISLANDS = 'ES70' // CANARIAS
    const EXPECTATIONS = 'Respecto al trimestre anterior'
    const EXPECTATIONS_INDICATORS = '0' // SALDO

    const expectationIndicatorsCode = dataset.getCodesForCategory('Indicadores de expectativa')

    const expectationIndicatorsLabels = dataset.getLabelsForCategory('Indicadores de expectativa')

    const datasetPrimitives = dataset.toPrimitives()

    for (const data of datasetPrimitives.data) {
      if (data.categoryCodes[3] === this.lastDateStored) break

      const businessProgressExpectation = storageDataProcessed.find(
        (expectation) => expectation.getTrimester() === data.categoryCodes[3]
      )

      if (!businessProgressExpectation) {
        throw new Error(
          `Trimester not found during third dataset processing to ${data.categoryCodes[1]} code`
        )
      }

      if (
        data.categoryCodes[1] === CATEGORY_ESTABLISHMENTS &&
        data.categoryCodes[2] === ISLANDS &&
        data.categoryCodes[4] === EXPECTATIONS &&
        data.categoryCodes[5] !== EXPECTATIONS_INDICATORS
      ) {
        const indexCode = expectationIndicatorsCode.indexOf(data.categoryCodes[5])
        const indicatorLabel = expectationIndicatorsLabels[indexCode]

        let mainFactorLabel: MainFactorsLabels

        switch (data.categoryCodes[0]) {
          case 'Facturación (volumen de negocio)':
            mainFactorLabel = MainFactorsLabels.BUSINESS_VOLUME
            break
          case 'Empleo (personal contratado)':
            mainFactorLabel = MainFactorsLabels.HIRED_STAFF
            break
          case 'Inversión':
            mainFactorLabel = MainFactorsLabels.INVESTMENT
            break
          case 'Nivel de precios':
            mainFactorLabel = MainFactorsLabels.PRICE_LEVEL
            break
          default:
            throw new Error(`Unknown main factor expectation code ${data.categoryCodes[0]}`)
        }

        businessProgressExpectation.addMainFactorsExpectations(
          mainFactorLabel,
          expectationIndicatorLabelToDomain(indicatorLabel),
          Number(data.dataValue)
        )
      }
    }
  }
}
