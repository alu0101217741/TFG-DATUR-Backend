import { model, Schema } from 'mongoose'

type ExpectationIndicators = {
  increase: number
  stability: number
  decline: number
}

interface BusinessProgressExpectationInterface {
  trimester: string
  hotelConfidenceIndex: number
  businessProgressTendency: {
    favorable: number
    normal: number
    unfavorable: number
  }
  mainFactorsExpectations: {
    businessVolume: ExpectationIndicators
    hiredStaff: ExpectationIndicators
    investment: ExpectationIndicators
    priceLevel: ExpectationIndicators
  }
}

// Create a Schema corresponding to the document interface.
const BusinessProgressExpectationSchema = new Schema<BusinessProgressExpectationInterface>({
  trimester: {
    type: String,
    match: [/^\d{4}M((0(1|4|7))|10)$/, '{VALUE} is an invalid trimester'],
    unique: true,
    required: true,
  },
  hotelConfidenceIndex: {
    type: Number,
    required: true,
  },
  businessProgressTendency: {
    favorable: {
      type: Number,
      required: true,
    },
    normal: {
      type: Number,
      required: true,
    },
    unfavorable: {
      type: Number,
      required: true,
    },
  },
  mainFactorsExpectations: {
    businessVolume: {
      increase: {
        type: Number,
        required: true,
      },
      stability: {
        type: Number,
        required: true,
      },
      decline: {
        type: Number,
        required: true,
      },
    },
    hiredStaff: {
      increase: {
        type: Number,
        required: true,
      },
      stability: {
        type: Number,
        required: true,
      },
      decline: {
        type: Number,
        required: true,
      },
    },
    investment: {
      increase: {
        type: Number,
        required: true,
      },
      stability: {
        type: Number,
        required: true,
      },
      decline: {
        type: Number,
        required: true,
      },
    },
    priceLevel: {
      increase: {
        type: Number,
        required: true,
      },
      stability: {
        type: Number,
        required: true,
      },
      decline: {
        type: Number,
        required: true,
      },
    },
  },
})

// Creates the Model.
export const BusinessProgressExpectationModel = model<BusinessProgressExpectationInterface>(
  'business_progress_expectations',
  BusinessProgressExpectationSchema
)
