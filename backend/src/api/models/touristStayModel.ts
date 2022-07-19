import { model, Schema } from 'mongoose'

// Creates an interface representing a document in MongoDB.
interface TouristStayInterface {
  year: number
  averageStay: number
  stayByResidencePlaces: [
    {
      residencePlace: string
      averageStay: number
    }
  ]
  stayByCanaryIslands: [
    {
      island: string
      averageStay: number
      residencePlaces: [
        {
          residencePlace: string
          averageStay: number
        }
      ]
    }
  ]
  stayByAccommodations: [
    {
      accommodation: string
      averageStay: number
      residencePlaces: [
        {
          residencePlace: string
          averageStay: number
        }
      ]
    }
  ]
}

//Create a Schema corresponding to the document interface.
const TouristStaySchema = new Schema<TouristStayInterface>(
  {
    year: {
      type: Number,
      unique: true,
      required: true,
    },
    averageStay: {
      type: Number,
      required: true,
    },
    stayByResidencePlaces: {
      type: [
        {
          residencePlace: { type: String, required: true },
          averageStay: { type: Number, required: true },
        },
      ],
      required: true,
      default: undefined,
    },
    stayByCanaryIslands: {
      type: [
        {
          island: { type: String, required: true },
          averageStay: { type: Number, required: true },
          residencePlaces: [
            {
              residencePlace: { type: String, required: true },
              averageStay: { type: Number, required: true },
            },
          ],
        },
      ],
      required: true,
      default: undefined,
    },
    stayByAccommodations: {
      type: [
        {
          accommodation: { type: String, required: true },
          averageStay: { type: Number, required: true },
          residencePlaces: [
            {
              residencePlace: { type: String, required: true },
              averageStay: { type: Number, required: true },
            },
          ],
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

// Creates the Model.
export const TouristStayModel = model<TouristStayInterface>('tourist_stays', TouristStaySchema)
