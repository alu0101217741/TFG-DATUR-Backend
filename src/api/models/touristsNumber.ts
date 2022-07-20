import { model, Schema } from 'mongoose'

// Creates an interface representing a document in MongoDB.
interface TouristsNumberInterface {
  year: number
  totalTourists: number
  touristsByCountryAndTrimester: [
    {
      nationality: string
      firstTrimester: number
      secondTrimester: number
      thirdTrimester: number
      fourthTrimester: number
    }
  ]
  touristsByIslands: [
    {
      island: string
      tourists: number
    }
  ]
}

//Create a Schema corresponding to the document interface.
const TouristsNumberSchema = new Schema<TouristsNumberInterface>(
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
          firstTrimester: { type: Number, required: true },
          secondTrimester: { type: Number, required: true },
          thirdTrimester: { type: Number, required: true },
          fourthTrimester: { type: Number, required: true },
        },
      ],
      required: true,
      default: undefined,
    },
    touristsByIslands: {
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
    timestamps: true,
  }
)

// Create the Model.
export const TouristsNumberModel = model<TouristsNumberInterface>(
  'tourists_number',
  TouristsNumberSchema
)
