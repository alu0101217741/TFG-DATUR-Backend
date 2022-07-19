import { BusinessProgressTendency } from './types/BusinessProgressTendency'
import { IndicatorsLabels } from './types/IndicatorsLabels'
import { MainFactorsExpectations } from './types/MainFactorsExpectations'
import { MainFactorsLabels } from './types/MainFactorsLabels'
import { TendencyLabels } from './types/TendencyLabels'

export type BusinessExpectationPrimitives = ReturnType<BusinessProgressExpectation['toPrimitives']>

export class BusinessProgressExpectation {
  static fromPrimitives(businessPrimitives: BusinessExpectationPrimitives) {
    const mainFactorsExpectations = {
      businessVolume: {
        increase: businessPrimitives.mainFactorsExpectations.businessVolume.increase,
        stability: businessPrimitives.mainFactorsExpectations.businessVolume.stability,
        decline: businessPrimitives.mainFactorsExpectations.businessVolume.decline,
      },
      hiredStaff: {
        increase: businessPrimitives.mainFactorsExpectations.hiredStaff.increase,
        stability: businessPrimitives.mainFactorsExpectations.hiredStaff.stability,
        decline: businessPrimitives.mainFactorsExpectations.hiredStaff.decline,
      },
      investment: {
        increase: businessPrimitives.mainFactorsExpectations.investment.increase,
        stability: businessPrimitives.mainFactorsExpectations.investment.stability,
        decline: businessPrimitives.mainFactorsExpectations.investment.decline,
      },
      priceLevel: {
        increase: businessPrimitives.mainFactorsExpectations.priceLevel.increase,
        stability: businessPrimitives.mainFactorsExpectations.priceLevel.stability,
        decline: businessPrimitives.mainFactorsExpectations.priceLevel.decline,
      },
    }
    return new BusinessProgressExpectation(
      businessPrimitives.trimester,
      businessPrimitives.hotelConfidenceIndex,
      businessPrimitives.businessProgressTendency,
      mainFactorsExpectations
    )
  }

  constructor(
    private trimester: string,
    private hotelConfidenceIndex: number,
    private businessProgressTendency: BusinessProgressTendency,
    private mainFactorsExpectations: MainFactorsExpectations
  ) {}

  getTrimester() {
    return this.trimester
  }

  addBusinessProgressTendency(tendency: TendencyLabels, value: number) {
    if (tendency === TendencyLabels.FAVORABLE) this.businessProgressTendency.favorable = value
    if (tendency === TendencyLabels.NORMAL) this.businessProgressTendency.normal = value
    if (tendency === TendencyLabels.UNFAVORABLE) this.businessProgressTendency.unfavorable = value
  }

  addMainFactorsExpectations(
    mainFactor: MainFactorsLabels,
    indicator: IndicatorsLabels,
    value: number
  ) {
    if (mainFactor === MainFactorsLabels.BUSINESS_VOLUME) {
      if (indicator === IndicatorsLabels.INCREASE)
        this.mainFactorsExpectations.businessVolume.increase = value
      if (indicator === IndicatorsLabels.STABILITY)
        this.mainFactorsExpectations.businessVolume.stability = value
      if (indicator === IndicatorsLabels.DECLINE)
        this.mainFactorsExpectations.businessVolume.decline = value
    }

    if (mainFactor === MainFactorsLabels.HIRED_STAFF) {
      if (indicator === IndicatorsLabels.INCREASE)
        this.mainFactorsExpectations.hiredStaff.increase = value
      if (indicator === IndicatorsLabels.STABILITY)
        this.mainFactorsExpectations.hiredStaff.stability = value
      if (indicator === IndicatorsLabels.DECLINE)
        this.mainFactorsExpectations.hiredStaff.decline = value
    }

    if (mainFactor === MainFactorsLabels.INVESTMENT) {
      if (indicator === IndicatorsLabels.INCREASE)
        this.mainFactorsExpectations.investment.increase = value
      if (indicator === IndicatorsLabels.STABILITY)
        this.mainFactorsExpectations.investment.stability = value
      if (indicator === IndicatorsLabels.DECLINE)
        this.mainFactorsExpectations.investment.decline = value
    }

    if (mainFactor === MainFactorsLabels.PRICE_LEVEL) {
      if (indicator === IndicatorsLabels.INCREASE)
        this.mainFactorsExpectations.priceLevel.increase = value
      if (indicator === IndicatorsLabels.STABILITY)
        this.mainFactorsExpectations.priceLevel.stability = value
      if (indicator === IndicatorsLabels.DECLINE)
        this.mainFactorsExpectations.priceLevel.decline = value
    }
  }

  toPrimitives() {
    return {
      trimester: this.trimester,
      hotelConfidenceIndex: this.hotelConfidenceIndex,
      businessProgressTendency: this.businessProgressTendency,
      mainFactorsExpectations: this.mainFactorsExpectations,
    }
  }
}
