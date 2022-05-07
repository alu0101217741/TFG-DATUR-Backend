import { Document, model, Schema } from 'mongoose'

interface TouristsAndNacionalitiesInterface extends Document {
  year: number
  totalTourists: number
  touristsByNacionalityAndTrimester: [
    {
      nationality: string
      firtTrimester: number
      secondTrimester: number
      thirdTrimester: number
      fourthTrimester: number
    }
  ]
  touristsByCanaryIslands: [
    {
      island: string
      tourists: number
    }
  ]
}

const TouristsAndNacionalitiesSchema = new Schema(
  {
    year: {
      type: Number,
      unique: true,
      required: true,
    },
    totalTourists: {
      type: Number,
      required: true,
    },
    touristsByCountryAndTrimester: {
      type: [
        {
          country: { type: String, required: true },
          firtTrimester: { type: Number, required: true },
          secondTrimester: { type: Number, required: true },
          thirdTrimester: { type: Number, required: true },
          fourthTrimester: { type: Number, required: true },
        },
      ],
      required: true,
      default: undefined,
    },
    touristsByCanaryIslands: {
      type: [
        {
          island: { type: String, required: true },
          tourists: { type: Number, required: true },
        },
      ],
      required: true,
      default: undefined,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export const TouristsAndNacionalities = model<TouristsAndNacionalitiesInterface>(
  'tourists_and_nacionalities',
  TouristsAndNacionalitiesSchema
)
