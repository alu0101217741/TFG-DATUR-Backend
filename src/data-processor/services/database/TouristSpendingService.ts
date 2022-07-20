import { TouristSpendingModel } from '../../../api/models/touristSpendingModel'
import { TouristSpending } from '../../domain/tourist-spending/TouristSpending'

export async function touristSpendingService(touristSpending: TouristSpending) {
  const touristSpendingPrimitives = touristSpending.toPrimitives()
  const touristSpendingSaved = await TouristSpendingModel.findOne({
    trimester: touristSpendingPrimitives.trimester,
  })

  if (touristSpendingSaved) {
    await TouristSpendingModel.updateOne(
      { trimester: touristSpendingPrimitives.trimester },
      { $set: touristSpendingPrimitives }
    )
  } else {
    const newTouristSpending = new TouristSpendingModel(touristSpendingPrimitives)
    await newTouristSpending.save()
  }
}
