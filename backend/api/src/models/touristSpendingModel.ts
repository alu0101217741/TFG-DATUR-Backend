import { model, Schema } from 'mongoose'

interface TouristSpendingInterface {
  trimester: string
  totalSpending: number
  averageSpending: number
  averageSpendingByDay: number
  spendingByConcept: [
    {
      concept: string
      totalSpending: number
      averageSpending: number
    }
  ]
  spendingByResidencePlace: [
    {
      country: string
      averageSpending: number
      averageSpendingByDay: number
      concepts: [
        {
          concept: string
          totalSpending: number
          averageSpending: number
        }
      ]
    }
  ]
}

//Create a Schema corresponding to the document interface.
const TouristSpendingSchema = new Schema<TouristSpendingInterface>({
  trimester: {
    type: String,
    match: [/^\d{4}Q(1|2|3|4)$/, '{VALUE} is an invalid trimester'],
    unique: true,
    required: true,
  },
  totalSpending: {
    type: Number,
    required: true,
  },
  averageSpending: {
    type: Number,
    required: true,
  },
  averageSpendingByDay: {
    type: Number,
    required: true,
  },
  spendingByConcept: {
    type: [
      {
        concept: { type: String, required: true },
        totalSpending: { type: Number, required: true },
        averageSpending: { type: Number, required: true },
      },
    ],
    required: true,
    default: undefined,
  },
  spendingByResidencePlace: {
    type: [
      {
        country: { type: String, required: true },
        averageSpending: { type: Number, required: true },
        averageSpendingByDay: { type: Number, required: true },
        concepts: {
          type: [
            {
              concept: { type: String, required: true },
              totalSpending: { type: Number, required: true },
              averageSpending: { type: Number, required: true },
            },
          ],
          required: true,
          default: undefined,
        },
      },
    ],
    required: true,
    default: undefined,
  },
})

// Creates the Model.
export const TouristSpendingModel = model<TouristSpendingInterface>(
  'tourists_spending',
  TouristSpendingSchema
)
