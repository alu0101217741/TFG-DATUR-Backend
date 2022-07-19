import { IndicatorsLabels } from '../../../domain/business-progress-expectation/types/IndicatorsLabels'

export const expectationIndicatorLabelToDomain = (expectationIndicatorLabel: string) => {
  switch (expectationIndicatorLabel) {
    case 'Aumento':
      return IndicatorsLabels.INCREASE
    case 'Estabilidad':
      return IndicatorsLabels.STABILITY
    case 'Descenso':
      return IndicatorsLabels.DECLINE
    default:
      throw new Error(
        `Impossible to convert the expectation indicator label ${expectationIndicatorLabel} to domain`
      )
  }
}
