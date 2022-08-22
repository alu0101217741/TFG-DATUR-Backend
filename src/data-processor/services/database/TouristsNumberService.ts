import { TouristsNumberModel } from '../../../api/models/touristsNumber'
import { TouristsNumber } from '../../domain/tourists-number/TouristsNumber'

export async function touristsNumberService(touristsNumber: TouristsNumber) {
  const touristsNumberPrimitives = touristsNumber.toPrimitives()
  const touristsNumberSaved = await TouristsNumberModel.findOne({
    year: touristsNumberPrimitives.year,
  })

  if (touristsNumberSaved) {
    await TouristsNumberModel.updateOne(
      { year: touristsNumberPrimitives.year },
      { $set: touristsNumberPrimitives }
    )
  } else {
    const newtouristsNumber = new TouristsNumberModel(touristsNumberPrimitives)
    await newtouristsNumber.save()
  }
}
