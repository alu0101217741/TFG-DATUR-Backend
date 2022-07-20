import { TendencyLabels } from '../../../domain/business-progress-expectation/types/TendencyLabels'

export const tendencyLabelsToDomain = (tendencyLabel: string) => {
  switch (tendencyLabel) {
    case 'Favorable':
      return TendencyLabels.FAVORABLE
    case 'Normal':
      return TendencyLabels.NORMAL
    case 'Desfavorable':
      return TendencyLabels.UNFAVORABLE
    default:
      throw new Error(`Impossible to convert the tendency label ${tendencyLabel} to domain`)
  }
}
