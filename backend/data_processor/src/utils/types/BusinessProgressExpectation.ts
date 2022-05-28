export type ExpectationIndicators = {
  increase: number
  stability: number
  decline: number
}

export type BusinessProgressExpectation = {
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
