import { TouristStayModel } from '../../../api/models/touristStayModel'
import { TouristStay } from '../../domain/tourist-stay/TouristStay'

export async function touristStayService(touristStay: TouristStay) {
  const touristStayPrimitives = touristStay.toPrimitives()
  const touristStaySaved = await TouristStayModel.findOne({
    year: touristStayPrimitives.year,
  })

  if (touristStaySaved) {
    await TouristStayModel.updateOne(
      { year: touristStayPrimitives.year },
      { $set: touristStayPrimitives }
    )
  } else {
    const newTouristStay = new TouristStayModel(touristStayPrimitives)
    await newTouristStay.save()
  }
}
