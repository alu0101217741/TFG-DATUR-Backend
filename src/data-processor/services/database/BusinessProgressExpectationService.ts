import { BusinessProgressExpectationModel } from '../../../api/models/businessProgressExpectationModel'
import { BusinessProgressExpectation } from '../../domain/business-progress-expectation/BusinessProgressExpectation'

export async function businessProgressExpectationService(
  businessProgressExpectation: BusinessProgressExpectation
) {
  const businessProgressExpectationPrimitives = businessProgressExpectation.toPrimitives()
  const businessProgressExpectationSaved = await BusinessProgressExpectationModel.findOne({
    trimester: businessProgressExpectationPrimitives.trimester,
  })

  if (businessProgressExpectationSaved) {
    await BusinessProgressExpectationModel.updateOne(
      { trimester: businessProgressExpectationPrimitives.trimester },
      { $set: businessProgressExpectationPrimitives }
    )
  } else {
    const newbusinessProgressExpectation = new BusinessProgressExpectationModel(
      businessProgressExpectationPrimitives
    )
    await newbusinessProgressExpectation.save()
  }
}
