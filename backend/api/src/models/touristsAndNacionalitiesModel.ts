import { model, Schema } from 'mongoose'

// Creates an interface representing a document in MongoDB.
interface TouristsAndNacionalitiesInterface {
  year: number
  totalTourists: number
  touristsByCountryAndTrimester: [
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

//Create a Schema corresponding to the document interface.
const TouristsAndNacionalitiesSchema = new Schema<TouristsAndNacionalitiesInterface>(
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

// Create the Model.
export const TouristsAndNacionalities = model<TouristsAndNacionalitiesInterface>(
  'tourists_and_nacionalities',
  TouristsAndNacionalitiesSchema
)
